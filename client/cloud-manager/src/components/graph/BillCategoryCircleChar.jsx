import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
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
  {
    name: "VM_instance",
    value: 170,
  },
  { name: "Cluster", value: 11 },
];

const BillCategoryCircleChart = ({ billingData }) => {
  const [displayData, setDisplayData] = useState(templateData);

  useEffect(() => {
    if (billingData.length == 0) return;
    // console.log(billingData);
    const { aggregatedCosts, totalCost } =
      aggregateCostsByCategory(billingData);
    const transformedData = transformToXYFormat({ aggregatedCosts, totalCost });
    // console.log(transformedData);
    setDisplayData(transformedData);
  }, [billingData]);

  if (billingData.length == 0)
    return (
      <div className="projectListPage w-max align-middle justify-center">
        <h3 className="text-xl font-bold">Billing Category Overall</h3>
        Has no data to display
      </div>
    );

  return (
    <div className="bg-white p-3 m-3 shadow rounded-md border-gray-900 border">
      <h3 className="text-xl font-bold">Billing Category Overall (%)</h3>
      <ResponsiveContainer width={300} height={350}>
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            data={displayData}
            startAngle={90}
            endAngle={450}
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

export default BillCategoryCircleChart;

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
  // VPC: "Networking",
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

const USD_TO_VND_RATE = 24000; // Example conversion rate

const aggregateCostsByCategory = (costs) => {
  const aggregatedCosts = {};
  let totalCost = 0;

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
    totalCost += costInUSD;
  });

  return { aggregatedCosts, totalCost };
};

const transformToXYFormat = ({ aggregatedCosts, totalCost }) => {
  return Object.entries(aggregatedCosts).map(([key, value]) => ({
    name: key,
    value: Math.round((value / totalCost) * 100 * 100) / 100,
  }));
};
