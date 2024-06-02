import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import { VictoryPie, VictoryLegend } from "victory";
// import "./style.scss";

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
  {
    x: "VM_instance",
    y: 170,
  },
  { x: "Cluster", y: 11 },
];

const templateLegend = [{ name: "VM_instance" }, { name: "Cluster" }];

const BillCateGoryCircleChart = ({ billingData }) => {
  const [displayData, setDisplayData] = useState(templateData);
  const [legendData, setLegendData] = useState(templateLegend);
  useEffect(() => {
    const aggregatedCosts = aggregateCostsByCategory(billingData);
    const transformedData = transformToXYFormat(aggregatedCosts);
    const legend = getLegend(aggregatedCosts);
    setLegendData(legend);
    setDisplayData(transformedData);
  }, [billingData]);

  return (
    <div className="projectListPage rounded-lg shadow">
      <h3 className="text-xl font-bold">Billing Category</h3>
      <div className="row-direction">
        <VictoryPie
          colorScale={arrayColor}
          data={displayData}
          labels={({ datum }) => ``}
        />
        <VictoryLegend
          // x={125}
          // y={10}
          width={300}
          colorScale={arrayColor}
          centerTitle
          // orientation="horizontal"
          gutter={20}
          data={legendData}
        />
      </div>
    </div>
  );
};

export default BillCateGoryCircleChart;

const serviceMapping = {
  // AWS Services
  "EC2 - Other": "Compute",
  "Amazon Elastic Compute Cloud - Compute": "Compute",
  EC2: "Compute",
  Lambda: "Compute",
  "Elastic Beanstalk": "Compute",
  S3: "Storage",
  EBS: "Storage",
  Glacier: "Storage",
  RDS: "Database",
  DynamoDB: "Database",
  Redshift: "Database",
  VPC: "Networking",
  CloudFront: "Networking",
  "Route 53": "Networking",
  ECS: "Containers",
  EKS: "Containers",
  Fargate: "Containers",
  SageMaker: "Machine Learning",
  Rekognition: "Machine Learning",
  Comprehend: "Machine Learning",
  // Google Cloud Services
  "Compute Engine": "Compute",
  "Cloud Functions": "Compute",
  "App Engine": "Compute",
  "Cloud Storage": "Storage",
  "Persistent Disk": "Storage",
  Filestore: "Storage",
  "Cloud SQL": "Database",
  Firestore: "Database",
  Bigtable: "Database",
  VPC: "Networking",
  Networking: "Networking",
  "VM Manager": "Monitoring",
  "Cloud Logging": "Monitoring",
  "Cloud Monitoring": "Monitoring",
  BigQuery: "Analytics",
  "Cloud CDN": "Networking",
  "Cloud DNS": "Networking",
  "Kubernetes Engine": "Containers",
  "Cloud Run": "Containers",
  "Container Registry": "Containers",
  "AI Platform": "Machine Learning",
  "Vision AI": "Machine Learning",
  "Natural Language API": "Machine Learning",
  // Add other mappings as needed
};

const USD_TO_VND_RATE = 23000; // Example conversion rate

const aggregateCostsByCategory = (costs) => {
  const aggregatedCosts = {};

  costs.forEach((bill) => {
    let costInUSD = parseFloat(bill.cost);

    if (bill.currency === "VND") {
      costInUSD = costInUSD / USD_TO_VND_RATE;
    }

    const category = serviceMapping[bill.service] || "Other";

    if (!aggregatedCosts[category]) {
      aggregatedCosts[category] = 0;
    }

    aggregatedCosts[category] += costInUSD;
  });

  return aggregatedCosts;
};

const transformToXYFormat = (aggregatedCosts) => {
  return Object.entries(aggregatedCosts).map(([key, value]) => ({
    x: key,
    y: value,
  }));
};

const getLegend = (aggregatedCosts) => {
  return Object.keys(aggregatedCosts).map((key) => ({ name: key }));
};

// const aggregatedCosts = aggregateCostsByCategory(costs);
// console.log(aggregatedCosts);
