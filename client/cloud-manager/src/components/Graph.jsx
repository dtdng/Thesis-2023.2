import React from "react";
import { useState, useEffect, useContext } from "react";
import { gapi } from "gapi-script";

const Graph = () => {
  const [data, setData] = useState([]);
  const [clusterInfo, setClusterInfo] = useState([]);
  const api_key = import.meta.env.VITE_GOOGLE_API_KEY;
  const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [checkLoad, setCheckLoad] = useState(false);
  function authenticate() {
    console.log("Authenticating...");
    return gapi.auth2
      .getAuthInstance()
      .signIn({
        scope:
          "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/monitoring https://www.googleapis.com/auth/monitoring.read",
      })
      .then(
        function () {
          console.log("Sign-in successful");
        },
        function (err) {
          console.error("Error signing in", err);
        }
      );
  }
  function loadClient() {
    console.log("Loading client...");
    gapi.client.setApiKey(api_key);
    return gapi.client
      .load("https://monitoring.googleapis.com/$discovery/rest?version=v3")
      .then(
        function () {
          console.log("GAPI client loaded for API");
        },
        function (err) {
          console.error("Error loading GAPI client for API", err);
        }
      );
  }
  function execute() {
    console.log("Executing...");
    return gapi.client.monitoring.projects.timeSeries
      .list({
        name: "projects/bustling-dynamo-420507",
        filter:
          'metric.type = "compute.googleapis.com/instance/cpu/utilization"',
        "interval.endTime": "2024-05-07T03:14:51Z",
        "interval.startTime": "2024-05-07T03:00:51Z",
        pageSize: 100,
      })
      .then(
        function (response) {
          // Handle the results here (response.result has the parsed body).
          setData(response.result.timeSeries[0].points);
          setClusterInfo(response.result.timeSeries[0].resource.labels);
          console.log("Response", response);
          console.log("Data", data);
          console.log("Cluster Info", clusterInfo);
        },
        function (err) {
          console.error("Execute error", err);
        }
      );
  }

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.client.init({
        apiKey: api_key,
        clientId: client_id,
        discoveryDocs: [
          "https://monitoring.googleapis.com/$discovery/rest?version=v3",
        ],
        scope:
          "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/monitoring https://www.googleapis.com/auth/monitoring.read",
      }).then(() => {
        authenticate().then(() => {
          loadClient().then(() => {
            execute();
          });
        });
      });
    });
  }, []);

  return (
    <div>
      <h1>Cluster Info</h1>
      <p>{clusterInfo.zone}</p>
      <p>{clusterInfo.projects_id}</p>
      <p>{clusterInfo.instance_id}</p>

      <h1>Data</h1>
      {data.map((point) => (
        <p>
          {point.interval.startTime}:{" "}
          {point.value.doubleValue}
        </p>
      ))}
    </div>
  );
};

export default Graph;
