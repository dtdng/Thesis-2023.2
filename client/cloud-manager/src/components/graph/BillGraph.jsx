import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "../style.scss";

const arrayColor = ["#82ca9d", "#8884d8", "#ffc658", "#ff7300", "#ff3864"];

const templateData = [
  {
    month: "03-2024",
    gr_test: 0,
    bustling_dynamo_420507: 0,
  },
  {
    month: "04-2024",
    gr_test: 0,
    bustling_dynamo_420507: 0,
  },
  {
    month: "05-2024",
    gr_test: 0,
    bustling_dynamo_420507: 0,
  },
];

const BillingGraph = (rawData) => {
  const { billData, cloudProjectList } = rawData;
  console.log("cloud project list", cloudProjectList);
  const [displayData, setDisplayData] = useState(templateData);

  useEffect(() => {
    const data = transformData(billData.billByCloudProject, cloudProjectList);
    console.log("Data", data);
    setDisplayData(data);
  }, [billData, cloudProjectList]);

  return (
    <div className="projectListPage billProjectGraph">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          width={1000}
          height={300}
          data={displayData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {cloudProjectList.map((cloudProject, index) => (
            <Bar
              dataKey={cloudProject.name.replace(/-/g, "_")}
              stackId="a"
              fill={arrayColor[index]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BillingGraph;

const transformData = (billOverview, cloudList) => {
  if (!billOverview || !cloudList) {
    return templateData;
  }
  // Initialize the template data with the required months
  const months = [
    "11-2023",
    "12-2023",
    "01-2024",
    "02-2024",
    "03-2024",
    "04-2024",
    "05-2024",
    "06-2024",
  ];
  let data = months.map((month) => {
    let entry = { month };
    cloudList.forEach((project) => {
      entry[project.name.replace(/-/g, "_")] = 0;
    });
    return entry;
  });

  // Fill in the costs for each project
  Object.entries(billOverview).forEach(([projectKey, projectData]) => {
    projectData.bills.forEach((bill) => {
      const billMonth =
        bill.month.substring(5) + "-" + bill.month.substring(0, 4); // "YYYY-MM" to "MM-YYYY"
      const dataEntry = data.find((entry) => entry.month === billMonth);
      if (dataEntry) {
        dataEntry[projectData.projectName.replace(/-/g, "_")] =
          Math.round(bill.cost * 100) / 100;
      }
    });
  });

  return data;
};
