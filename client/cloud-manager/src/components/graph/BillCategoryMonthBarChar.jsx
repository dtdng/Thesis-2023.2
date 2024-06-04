import React from "react";
import { useState, useEffect } from "react";
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
    month: "03-2024",
    VM_instance: 0,
    Cluster: 0,
  },
  {
    month: "04-2024",
    VM_instance: 0,
    Cluster: 0,
  },
  {
    month: "05-2024",
    VM_instance: 0,
    Cluster: 0,
  },
];

const templateLegend = [{ name: "VM_instance" }, { name: "Cluster" }];

const BillCategoryMonthBarChart = ({ billingData }) => {
  const [displayData, setDisplayData] = useState(templateData);
  const [legendData, setLegendData] = useState(templateLegend);

  useEffect(() => {
    if (billingData.length == 0) return;
    const aggregatedCosts = aggregateCostByCategoryAndMonth(billingData);
    const legendData = getLegend(aggregatedCosts);
    setDisplayData(aggregatedCosts);
    setLegendData(legendData);
  }, [billingData]);

  if (billingData.length == 0)
    return (
      <div className="projectListPage w-max align-middle justify-center">
        <h3 className="text-xl font-bold">Billing Category By Month</h3>
        Has no data to display
      </div>
    );

  return (
    <div className="projectListPage w-max">
      <h3 className="text-xl font-bold">Billing Category By Month (USD)</h3>
      <ResponsiveContainer width={450} height={300}>
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
          {legendData.map((category, index) => (
            <Bar
              key={category.name}
              dataKey={category.name}
              stackId="a"
              fill={arrayColor[index]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BillCategoryMonthBarChart;

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

const aggregateCostByCategoryAndMonth = (billingData) => {
  const aggregatedData = {};

  billingData.forEach((bill) => {
    const month = new Date(bill.startDate).toISOString().substring(0, 7);
    const service = bill.service;
    const category = serviceMapping[service] || "Other";
    let costInUSD = parseFloat(bill.cost);

    if (bill.currency === "VND") {
      costInUSD = costInUSD / 24000;
    }

    if (!aggregatedData[month]) {
      aggregatedData[month] = { month: month };
      // Initialize all known categories with 0
      Object.keys(serviceMapping).forEach((key) => {
        aggregatedData[month][serviceMapping[key]] = 0;
      });
      aggregatedData[month]["Other"] = 0; // Initialize 'Other' category
    }

    if (aggregatedData[month][category] === undefined) {
      aggregatedData[month][category] = 0; // Ensure category is initialized
    }

    aggregatedData[month][category] += costInUSD;
  });

  return Object.values(aggregatedData);
};

const getLegend = (aggregatedData) => {
  // Get the keys of the first data entry (excluding 'month') to determine the categories
  const categories = Object.keys(aggregatedData[0]).filter(
    (key) => key !== "month"
  );
  // Create the legend array
  const legend = categories.map((category) => ({ name: category }));
  return legend;
};
