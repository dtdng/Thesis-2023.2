import React from "react";
import { useState, useEffect, useContext } from "react";
import { gapi } from "gapi-script";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const colors = [
  "#0000ff", // Blue
  "#0099ff", // Sky Blue
  "#ff00ff", // Magenta
  "#00ffff", // Cyan
  "#00ff00", // Green
  "#ffff00", // Yellow
  "#ff0000", // Red
  "#ff9900", // Orange
  "#9900ff", // Purple
  "#00ff99", // Teal
];

const getColor = (index) => colors[index % colors.length];

const GraphMemory = (idCluster) => {
  //if idCluster: 0 = All
  // idCluster = "5614359816245636442";
  idCluster = 0;
  const projectID = "bustling-dynamo-420507";

  const api_key = import.meta.env.VITE_GOOGLE_API_KEY;
  const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [data, setData] = useState([]);
  const [clusterInfo, setClusterInfo] = useState([]);
  const [checkLoad, setCheckLoad] = useState(false);
  const [processedData, setProcessedData] = useState([]);
  const [numberOfVMS, setNumberOfVMS] = useState(0);

  
  const authenticate = () => {
    return gapi.auth2.getAuthInstance().signIn({
      scope:
        "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/monitoring https://www.googleapis.com/auth/monitoring.read",
    });
  };

  const loadClient = () => {
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
  };

  const roundToNearestMinute = (dateString) => {
    const date = new Date(dateString);
    const seconds = date.getSeconds();
    if (seconds > 15) {
      date.setMinutes(date.getMinutes() + 1);
    }
    date.setSeconds(0, 0); // Set seconds and milliseconds to zero
    return date;
  };

  const execute = () => {
    const startTime = new Date(Date.now() - 360000); // 1 hour ago
    const endTime = new Date(Date.now()); // Now
    let request = {};

    if (idCluster == 0 || idCluster == undefined) {
      request = {
        name: "projects/" + projectID,
        filter:
          'metric.type = "agent.googleapis.com/memory/percent_used" AND resource.type = "gce_instance"  AND metric.labels.state= "used"',
        "interval.endTime": endTime.toISOString(),
        "interval.startTime": startTime.toISOString(),
        pageSize: 100,
      };
    } else {
      // "filter": "metric.type = \"agent.googleapis.com/memory/percent_used\" AND resource.type: \"gce_instance\" AND resource.labels.instance_id = \"5614359816245636442\" ",
      request = {
        name: "projects/" + projectID,
        filter:
          'metric.type = "agent.googleapis.com/memory/percent_used" AND resource.type = "gce_instance"  AND metric.labels.state= "used" AND resource.labels.instance_id = "' +
          idCluster +
          '"',
        "interval.endTime": endTime.toISOString(),
        "interval.startTime": startTime.toISOString(),
        pageSize: 100,
      };
    }

    return gapi.client.monitoring.projects.timeSeries.list(request).then(
      function (response) {
        const numberOfVMs = response.result.timeSeries.length;
        setNumberOfVMS(numberOfVMs);
        // console.log("Number of VMs", numberOfVMs);

        // Initialize arrays to collect data and cluster info
        const newData = [];
        const newClusterInfo = [];

        for (let i = 0; i < numberOfVMs; i++) {
          newData.push(response.result.timeSeries[i].points);
          newClusterInfo.push(response.result.timeSeries[i].resource.labels);
        }
        setData(newData); // Update state once with the collected data
        setClusterInfo(newClusterInfo);

        // console.log("Data", data);
        // console.log("Cluster Info", clusterInfo);
      },
      function (err) {
        console.error("Execute error", err);
      }
    );
  };

  useEffect(() => {
    const initializeGapiClient = async () => {
      try {
        await gapi.load("client:auth2", async () => {
          await gapi.client.init({
            apiKey: api_key,
            clientId: client_id,
            discoveryDocs: [
              "https://monitoring.googleapis.com/$discovery/rest?version=v3",
            ],
            scope:
              "https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/monitoring https://www.googleapis.com/auth/monitoring.read",
          });

          const authInstance = gapi.auth2.getAuthInstance();
          if (authInstance.isSignedIn.get()) {
            // User is already signed in
            await loadClient();
            execute();
          } else {
            // User is not signed in, proceed with authentication
            authenticate()
              .then(() => loadClient())
              .then(() => execute())
              .catch((error) => {
                console.error(
                  "Error during authentication or client loading",
                  error
                );
              });
          }
        });
      } catch (error) {
        console.error("Error during client initialization", error);
      }
    };

    initializeGapiClient();
  }, []);

  useEffect(() => {
    const temp = [];
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    // Iterate over each array in the data
    data.forEach((dataArray, index) => {
      dataArray.forEach((item) => {
        const date = roundToNearestMinute(item.interval.startTime);
        const formattedDate = date.toLocaleDateString("en-US", options);
        let existingEntry = temp.find((entry) => entry.time === formattedDate);

        if (existingEntry) {
          existingEntry[`cluster${index + 1}`] = item.value.doubleValue;
        } else {
          temp.push({
            time: formattedDate,
            [`cluster${index + 1}`]: item.value.doubleValue,
          });
        }
      });
    });

    setProcessedData(temp);
  }, [data]);

  useEffect(() => {
    console.log("Processed Data", processedData);
  }, [processedData]);

  // useEffect(() => {
  //   setInterval(() => {
  //     execute();
  //   }, 60000);
  // });

  return (
    <div>
      <AreaChart width={400} height={200} data={processedData}>
        <YAxis />
        <XAxis dataKey="time" />
        <CartesianGrid strokeDasharray="5 5" />
        <Tooltip />
        <Legend />
        {Array.from({ length: numberOfVMS }).map((_, i) => (
          <Area
            key={i} // Add a unique key for each component
            type="monotone"
            fill="none"
            stroke={getColor(i)}
            dataKey={`cluster${i + 1}`}
          />
        ))}
      </AreaChart>
    </div>
  );
};

export default GraphMemory;
