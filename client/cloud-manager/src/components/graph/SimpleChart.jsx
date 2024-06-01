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

const roundTimeToNearestMinute = (time) => {
  const date = new Date(time * 1000); // Convert to milliseconds
  const seconds = date.getSeconds();
  date.setSeconds(seconds >= 30 ? 60 : 0, 0); // Round seconds
  return Math.floor(date.getTime() / 1000); // Convert back to seconds
};

const transformData = (clusters) => {
  const timeMap = {};

  clusters.forEach((cluster, index) => {
    cluster.forEach((data) => {
      const roundedTime = roundTimeToNearestMinute(Number(data.time));
      const humanReadableTime = new Date(
        roundedTime * 1000
      ).toLocaleTimeString(); // Convert to human-readable time
      if (!timeMap[humanReadableTime]) {
        timeMap[humanReadableTime] = { time: humanReadableTime };
      }
      timeMap[humanReadableTime][`instance${index + 1}`] = Number(data.value);
    });
  });
  return Object.values(timeMap).sort(
    (a, b) =>
      new Date(`1970-01-01T${a.time}Z`) - new Date(`1970-01-01T${b.time}Z`)
  );
};

const SimpleChart = ({ instanceIDList, type }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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
        const transformedData = transformData(clustersData);
        setData(transformedData);
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
