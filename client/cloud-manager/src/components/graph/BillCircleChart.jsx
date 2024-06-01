import React, { useState, useEffect } from "react";

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

const BillCircleChart = (rawData) => {
  const { billData, cloudProjectList } = rawData;
  const [displayData, setDisplayData] = useState(templateData);

  return <div className="projectListPage billProjectCircleGraph">
    <div>BillCircleChart</div>
  </div>;
};

export default BillCircleChart;
