import React, { useState, useEffect } from "react";
import { VictoryPie } from "victory";

const ClusterStatusChar = (processedData) => {
  const sampleData = [
    { x: "Working", y: 7 },
    { x: "Not Working", y: 1 },
  ];

  const [data, setData] = useState(sampleData);

  // useEffect(() => {
  //   setData(sampleData);
  // }, []);

  useEffect(() => {
    console.log("processedData", processedData);
    const raw = processedData.processedData.cluster;

    console.log("raw", raw);
    setData([
      { x: "Working", y: raw.working },
      { x: "Not Working", y: raw.notWorking },
    ]);
  }, [processedData]);

  if (data[0].y == 0 && data[1].y == 0) {
    return <p>No Data to display</p>;
  }

  return (
    <VictoryPie
      animate={{
        duration: 2000,
      }}
      colorScale={["#5932EA", "#16C098"]}
      innerRadius={({ datum }) => 80 - datum.y}
      radius={({ datum }) => 100 + datum.y}
      data={data}
    />
  );
};

export default ClusterStatusChar;
