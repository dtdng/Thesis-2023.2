import React, { useState, useEffect } from "react";
import { VictoryPie } from "victory";
import axios from "axios";

import "../style.scss";

const color = ["#6F9359", "#CA9F09", "#F53333"];

const MetricChart = ({ instanceID, type }) => {
  const [statusColor, setStatusColor] = useState(color[0]);
  const templateData = [
    { x: "Used", y: 0 },
    { x: "Unused", y: 100 },
  ];

  const [data, setData] = useState(templateData);

  const fetchData = async () => {
    const roundTimeToNearestMinute = (time) => {
      const date = new Date(time * 1000); // Convert to milliseconds
      const seconds = date.getSeconds();
      date.setSeconds(seconds >= 30 ? 60 : 0, 0); // Round to nearest minute
      return Math.floor(date.getTime() / 1000); // Convert back to seconds
    };
    const timeEnd = Math.floor(Date.now() / 1000); // Current time in seconds
    const timeStart = timeEnd - 60 * 10; // 5 minutes ago
    try {
      // Dynamic time calculation for the past 5 minutes

      // API call to fetch the metrics data
      const result = await axios.get(
        `http://localhost:3000/metric/${instanceID}/${timeStart}/${timeEnd}/${type}`
      );

      if (result.data && result.data.length > 0) {
        // Process each data point
        const processedData = result.data.map((dataPoint) => {
          const roundedTime = roundTimeToNearestMinute(Number(dataPoint.time));
          const humanReadableTime = new Date(
            roundedTime * 1000
          ).toLocaleTimeString(); // Convert to human-readable time

          return {
            time: humanReadableTime,
            value: Number(dataPoint.value),
          };
        });

        // Extract the last data point
        const lastDataPoint = processedData[processedData.length - 1];
        if (lastDataPoint && lastDataPoint.value !== undefined) {
          setData([
            { x: "Used", y: lastDataPoint.value },
            { x: "Unused", y: 100 - lastDataPoint.value },
          ]);
        }
        // console.log("Processed Data", processedData);
      } else {
        console.log("No data found");
        console.log("Instance ID", instanceID);
        console.log("timeEnd", timeEnd);
        console.log("timeStart", timeStart);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message || error);
    }
  };

  useEffect(() => {
    setInterval(() => {
      fetchData();
    }, 60000); // Fetch data every 2 minutes
  }, []);

  useEffect(() => {
    if (instanceID == null || type == null) return;
    fetchData();
  }, [instanceID, type]);

  useEffect(() => {
    if (data[0].y > 80) setStatusColor(color[2]);
    else if (data[0].y > 50) setStatusColor(color[1]);
    else setStatusColor(color[0]);
  }, [data]);

  return (
    <div className="simpleMetricChart">
      {type === "cpu" && "CPU Utilization (%)"}
      {type === "memory" && "Memory Utilization (%)"}
      {type === "network_in" && "Network In (bytes)"}
      {type === "network_out" && "Network Out (bytes)"}
      <VictoryPie
        cornerRadius={10}
        colorScale={[statusColor, "#EEF0F2"]}
        labels={() => null}
        width={300}
        height={250}
        startAngle={-90}
        endAngle={90}
        data={data}
        innerRadius={100}
      />
      <div className="simpleMetricChartValue">{data[0].y}%</div>
    </div>
  );
};

export default MetricChart;
