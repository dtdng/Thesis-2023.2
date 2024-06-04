import React from "react";
import { useState, useEffect, useContext } from "react";
import { gapi } from "gapi-script";

import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const colors = [
  "#0000ff", // Blue
  "#0099ff", // Sky Blue
  "#ff00ff", // Magenta
  "#00ffff", // Cyan
  "#00ff00", // Green
  "#ffff00", // Yellow
  "#ff0000", // Red
  "#ff9900", // Orange
  "#9900ff", // Purple
  "#00ff99", // Teal
];

const getColor = (index) => colors[index % colors.length];

const SimpleChart = ({ instanceIDList, type, period }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [rawData, setRawData] = useState([]);
  const fetchData = async () => {
    try {
      // Dynamic time calculation for the past 1 hour
      const timeEnd = Math.floor(Date.now() / 1000); // Current time in seconds
      const timeStart = timeEnd - 60 * 60; // 1 hour ago

      const clustersData = await Promise.all(
        instanceIDList.map(async (idCluster) => {
          const result = await axios.get(
            `http://localhost:3000/metric/${idCluster}/${timeStart}/${timeEnd}/${type}`
          );
          return result.data || []; // Return data or empty array
        })
      );

      if (clustersData.length != 0) {
        // const transformedData = transformData(clustersData);
        // setData(transformedData);
        // setRawData(clustersData);
        console.log("clustersData", clustersData);
        const generatedTimeseries = generateTimeseriesData(
          clustersData,
          period
        );
        const timeseriesData = addTimeseriesData(
          clustersData,
          generatedTimeseries,
          period
        );
        setData(timeseriesData);
        console.log("timeseriesData", type, timeseriesData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [instanceIDList]);

  useEffect(() => {
    setInterval(() => {
      fetchData();
    }, 60000); // 1mins
  }, []);

  if (loading) {
    return <div>Loading {type}...</div>;
  }
  return (
    <div className="metricChart">
      {type === "cpu" && <h5>CPU Usage in 1 hour (%)</h5>}
      {type === "memory" && <h5>Memory Usage in 1 hour (%)</h5>}
      {type === "network_in" && <h5>Network In in 1 hour (bytes)</h5>}
      {type === "network_out" && <h5>Network Out in 1 hour (bytes)</h5>}
      <AreaChart width={350} height={200} data={data}>
        <YAxis />
        <XAxis dataKey="time" />
        <CartesianGrid strokeDasharray="5 5" />
        <Tooltip />
        {instanceIDList.length > 1 && <Legend />}

        {Array.from({ length: instanceIDList.length }).map((_, i) => (
          <Area
            key={i} // Add a unique key for each component
            type="monotone"
            fill="none"
            stroke={getColor(i)}
            dataKey={`instance${i + 1}`}
          />
        ))}
      </AreaChart>
    </div>
  );
};

export default SimpleChart;

const roundTimeToNearestMinute = (time) => {
  const date = new Date(time * 1000); // Convert to milliseconds
  const seconds = date.getSeconds();
  date.setSeconds(0, 0); // Round seconds
  return Math.floor(date.getTime() / 1000); // Convert back to seconds
};

const roundTimeToNearest5Minute = (time) => {
  const date = new Date(time * 1000); // Convert to milliseconds
  const minutes = date.getMinutes();
  date.setMinutes(minutes - (minutes % 5), 0, 0); // Round minutes
  return Math.floor(date.getTime() / 1000); // Convert back to seconds
};

function generateTimeseriesData(listClusterMetricTimeseries, period) {
  let highestTime = 0;
  let lowestTime = 100_000_000_000;
  let count_resources = listClusterMetricTimeseries.length;
  // Find the highest and lowest time
  listClusterMetricTimeseries.forEach((clusterMetricTimeseries) => {
    clusterMetricTimeseries.forEach((metricTimeseries) => {
      if (metricTimeseries.time > highestTime) {
        highestTime = metricTimeseries.time;
      }
      if (metricTimeseries.time < lowestTime) {
        lowestTime = metricTimeseries.time;
      }
    });
  });
  if (period == 1) {
    lowestTime = roundTimeToNearestMinute(lowestTime);
    highestTime = roundTimeToNearestMinute(highestTime);
  } else if (period == 5) {
    lowestTime = roundTimeToNearest5Minute(lowestTime);
    highestTime = roundTimeToNearest5Minute(highestTime);
  }
  // Generate time series data from lowest to highest time
  var timeSeriesData = [];
  var currentTime = lowestTime * 1;
  const interval = 60 * period; // 2 minutes in milliseconds

  let i = 0;
  for (i; i <= (highestTime - lowestTime) / interval; i++) {
    const timeSeriesDataPoint = { time: currentTime };
    for (let j = 0; j < count_resources; j++) {
      timeSeriesDataPoint[`instance${j + 1}`] = 0;
    }
    timeSeriesData.push(timeSeriesDataPoint);
    currentTime += interval * 1;
  }
  // console.log("timeSeriesData", timeSeriesData);
  return timeSeriesData;
}

function interpolateValue(value1, value2, fraction) {
  return value1 + (value2 - value1) * fraction;
}

function addTimeseriesData(
  listClusterMetricTimeseries,
  timeSeriesData,
  period
) {
  listClusterMetricTimeseries.forEach((clusterMetricTimeseries, index) => {
    clusterMetricTimeseries.forEach((metricTimeseries, metricIndex) => {
      const currentMetricTime = Number(metricTimeseries.time);
      let roundedTime = 0;

      if (period === 1) {
        roundedTime = roundTimeToNearestMinute(currentMetricTime);
      } else if (period === 5) {
        roundedTime = roundTimeToNearest5Minute(currentMetricTime);
      }

      const timeSeriesDataPointIndex = timeSeriesData.findIndex(
        (data) => new Date(data.time).getTime() === roundedTime
      );

      if (timeSeriesDataPointIndex !== -1) {
        timeSeriesData[timeSeriesDataPointIndex][`instance${index + 1}`] =
          Number(metricTimeseries.value);
      }

      if (metricIndex < clusterMetricTimeseries.length - 1) {
        const nextMetric = clusterMetricTimeseries[metricIndex + 1];
        const nextMetricTime = Number(nextMetric.time);
        const nextMetricValue = Number(nextMetric.value);

        for (
          let i = timeSeriesDataPointIndex + 1;
          i < timeSeriesData.length;
          i++
        ) {
          const timeDifference =
            new Date(timeSeriesData[i].time).getTime() - roundedTime;
          const totalInterval = nextMetricTime - roundedTime;
          if (timeDifference >= 0 && timeDifference < totalInterval) {
            const fraction = timeDifference / totalInterval;
            const interpolatedValue = interpolateValue(
              Number(metricTimeseries.value),
              nextMetricValue,
              fraction
            );
            timeSeriesData[i][`instance${index + 1}`] = interpolatedValue;
          } else {
            break;
          }
        }
      }
    });
  });

  //convert time stamp to human readable
  timeSeriesData.forEach((data) => {
    const humanReadableTime = new Date(data.time * 1000).toLocaleTimeString(); // Convert to human-readable time
    data.time = humanReadableTime;
  });
  return timeSeriesData;
}
