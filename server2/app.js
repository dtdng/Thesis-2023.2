const express = require("express");
const axios = require("axios");
const { google } = require("googleapis");
const monitoring = require("@google-cloud/monitoring");
// const { gapi } = "gapi-script";
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000; // Different port from the CRUD server

process.env.GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS;

console.log(
  "GOOGLE_APPLICATION_CREDENTIALS:",
  process.env.GOOGLE_APPLICATION_CREDENTIALS
);

const instanceData = {
  name: "instance-20240419-020819",
  instanceID: "5614359816245636442",
  provider: "google",
  status: "Running",
  zone: "us-west4-b",
  projectID: "6641d5aeaf32b009c40f7700",
  VITE_GOOGLE_CLIENT_ID:
    "892836665451-dg3esfo1ikujvi1dph9is5revs0or02b.apps.googleusercontent.com",
  VITE_GOOGLE_API_KEY: "AIzaSyDShO7pYsUCCmJPSrGhG5k9TRX_jb0QcEM",
  _id: "6645d0629f79387a4270460f",
  __v: 0,
};

const authenticate = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: [
      "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/monitoring https://www.googleapis.com/auth/monitoring.read",
    ],
  });
  const authClient = await auth.getClient();
  google.options({ auth: authClient });
  console.log("Auth client:", authClient);
  return authClient;
};

const queryMetrics = async () => {
  try {
    const authClient = await authenticate();

    const monitoring = google.monitoring({
      version: "v3",
      auth: authClient,
    });

    const projectId = instanceData.projectID;

    const request = {
      name: `projects/${projectId}`,
      filter: `metric.type="compute.googleapis.com/instance/cpu/utilization"`,
      "interval.startTime": "2024-05-08T03:14:51Z",
      "interval.endTime": "2024-05-08T03:15:51Z",
    };

    const response = await monitoring.projects.timeSeries.list(request);
    console.log("Metrics data:", response.data);
  } catch (error) {
    console.error("Error querying metrics:", error);
  }
};

// const queryMetrics = async () => {
//   const client = new monitoring.MetricServiceClient();
//   const projectId = instanceData.projectID;

//   const dataPoint = {
//     interval: {
//       endTime: {
//         seconds: Date.now() / 1000,
//       },
//       startTime: {
//         seconds: Date.now() / 1000 - 60,
//       },
//     },
//     value: {
//       doubleValue: 0.12,
//     },
//   };
//   const request = {
//     name: client.projectPath(projectId),
//     timeSeries: [
//       {
//         // Ties the data point to a custom metric
//         metric: {
//           type: "compute.googleapis.com/instance/cpu/utilization",
//         },
//         resource: {
//           type: "global",
//           labels: {
//             project_id: projectId,
//           },
//         },
//         points: [dataPoint],
//       },
//     ],
//   };

//   const [result] = await client.createTimeSeries(request);
//   console.log("Done writing time series data.", result);
// };

setInterval(queryMetrics, 30000);

queryMetrics();

app.get("/", (req, res) => {
  res.send("Metric Query Server is running");
});

app.listen(port, () => {
  console.log(`Metric server is listening on http://localhost:${port}`);
});
