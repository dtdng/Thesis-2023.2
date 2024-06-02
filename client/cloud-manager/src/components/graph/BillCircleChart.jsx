import React, { useState, useEffect } from "react";
import { VictoryPie } from "victory";

var arrayColor = ["#82ca9d", "#8884d8", "#ffc658", "#ff7300", "#ff3864"];
//TODO: get data from backend
const templateData = [
  {
    x: "gr_test",
    y: 0.1,
  },
  { x: "bustling_dynamo_420507", y: 11 },
];

const BillCircleChart = (rawData) => {
  const { billData, cloudProjectList } = rawData;

  const [displayData, setDisplayData] = useState(templateData);

  return (
    <div className="projectListPage billProjectCircleGraph">
      <VictoryPie colorScale={arrayColor} data={displayData} />
    </div>
  );
};

export default BillCircleChart;
