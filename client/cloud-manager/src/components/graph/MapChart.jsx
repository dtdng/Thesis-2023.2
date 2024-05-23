import React, { useState, useEffect } from "react";
import WorldMap from "react-svg-worldmap";

const processedCountryData = (rawData) => {
  const countryData = Object.keys(rawData).map((country) => ({
    country: country,
    value: rawData[country],
  }));
  return countryData;
};

export default function MapChart(processedData) {
  const templateData = {
    google: {
      working: 0,
      notWorking: 0,
    },
    aws: {
      working: 0,
      notWorking: 0,
    },
    cluster: {
      working: 0,
      notWorking: 0,
    },
    regionCount: 0,
    region: {},
    country: {},
    type: {
      cluster: 0,
      VM: 0,
    },
  };
  let temp = [
    { country: "us", value: 0 },
    { country: "PL", value: 5 },
  ];
  const [countryData, setCountryData] = useState(temp);
  const [data, setData] = useState(templateData);

  useEffect(() => {
    setData(processedData.processedData);
  }, [processedData]);

  useEffect(() => {
    const tempCountry = processedCountryData(data.country);
    setCountryData(tempCountry);
  }, [data]);

  return (
    <WorldMap
      color="red"
      title="Instance Distribution"
      value-suffix="clusters"
      size="responsive"
      strokeOpacity={0.6}
      data={countryData}
      backgroundColor="transparent"
    />
  );
}
