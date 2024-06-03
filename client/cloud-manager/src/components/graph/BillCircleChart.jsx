import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

var arrayColor = [
  "#82ca9d",
  "#8884d8",
  "#ffc658",
  "#ff7300",
  "#ff3864",
  "#00c49f",
  "#0088FE",
  "#FFBB28",
  "#FF8042",
];

const templateData = [
  { name: "", value: 0 },
  { name: "", value: 0 },
];

const BillCircleChart = (rawData) => {
  const [displayData, setDisplayData] = useState(templateData);

  const updateData = () => {
    const { billData, cloudProjectList } = rawData;
    if (billData.totalBill == 0 || billData.billByCloudProject == undefined)
      return;
    console.log(billData);
    const billByProject = billData.billByCloudProject;
    // console.log("billByProject", billByProject);
    const aggregatedCosts = convertToChartData(billByProject);
    setDisplayData(aggregatedCosts);
    console.log("displayData: ", displayData);
  };

  useEffect(() => {
    updateData();
  }, [rawData]);

  return (
    <div className="bg-white p-3 m-3 shadow rounded-md border-gray-900 border">
      <ResponsiveContainer width={350} height={300}>
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            data={displayData}
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={450}
            // outerRadius={80}
            // label
          >
            {displayData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={arrayColor[index % arrayColor.length]}
              />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BillCircleChart;

const convertToChartData = (data) => {
  return Object.values(data).map((project) => ({
    name: project.projectName,
    value: Math.round(project.totalBill * 100) / 100,
  }));
};
