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

const GraphCPU = (idCluster) => {
  //if idCluster: 0 = All
  const api_key = import.meta.env.VITE_GOOGLE_API_KEY;
  const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [data, setData] = useState([]);
  const [clusterInfo, setClusterInfo] = useState([]);
  const [checkLoad, setCheckLoad] = useState(false);
  const [processedData, setProcessedData] = useState([]);
  const [numberOfVMS, setNumberOfVMS] = useState(0);

  const projectID = "bustling-dynamo-420507";
  // idCluster = "5614359816245636442";
  idCluster = 0;

  const roundToNearestMinute = (dateString) => {
    const date = new Date(dateString);
    const seconds = date.getSeconds();
    if (seconds > 15) {
      date.setMinutes(date.getMinutes() + 1);
    }
    date.setSeconds(0, 0); // Set seconds and milliseconds to zero
    return date;
  };

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

  const execute = () => {
    const startTime = new Date(Date.now() - 1200000); // 1 hour ago
    const endTime = new Date(Date.now()); // Now
    let request = {};
    if (idCluster == 0 || idCluster == undefined) {
      request = {
        name: "projects/" + projectID,
        filter:
          'metric.type = "compute.googleapis.com/instance/cpu/utilization" AND resource.type: "gce_instance"',
        "interval.endTime": endTime.toISOString(),
        "interval.startTime": startTime.toISOString(),
        pageSize: 100,
      };
    } else {
      request = {
        name: "projects/" + projectID,
        filter:
          'metric.type = "compute.googleapis.com/instance/cpu/utilization" AND resource.labels.instance_id = "' +
          idCluster +
          '"',
        "interval.endTime": endTime.toISOString(),
        "interval.startTime": startTime.toISOString(),
        pageSize: 100,
      };
    }

    return gapi.client.monitoring.projects.timeSeries.list(request).then(
      function (response) {
        // console.log("Request", request);
        // console.log("Response", response);

        const numberOfVMs = response.result.timeSeries.length;
        setNumberOfVMS(numberOfVMs);
        // console.log("Number of VMs", numberOfVMs);

        // Initialize arrays to collect data and cluster info
        const newData = [];
        const newClusterInfo = [];

        for (let i = 0; i < numberOfVMs; i++) {
          // console.log(response.result.timeSeries[i].points);
          // console.log(response.result.timeSeries[i].resource.labels);

          newData.push(response.result.timeSeries[i].points);
          newClusterInfo.push(response.result.timeSeries[i].resource.labels);
        }
        // Update state once with the collected data
        setData(newData);
        setClusterInfo(newClusterInfo);
        setCheckLoad(true);
        // console.log("Data", newData);
        // console.log("Cluster Info", newClusterInfo);
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
        // Find if the date already exists in the temp array
        let existingEntry = temp.find((entry) => entry.time === formattedDate);

        if (existingEntry) {
          // If entry exists, add the current instance's value to it
          existingEntry[`cluster${index + 1}`] = item.value.doubleValue;
        } else {
          // If entry does not exist, create a new one
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
    console.log("Data", data);
    console.log("Processed Data", processedData);
  }, [processedData]);

  // useEffect(() => {
  //   setInterval(() => {
  //     execute();
  //   }, 60000);
  // });

  if (checkLoad == false) {
    return <div className="loading">Loading CPU Data....</div>;
  }
  return (
    <div>
      <AreaChart width={400} height={200} data={processedData}>
        <YAxis />
        <XAxis dataKey="time" />
        <CartesianGrid strokeDasharray="5 5" />
        <Tooltip />
        <Legend />

        <Area
          key={0} // Add a unique key for each component
          type="monotone"
          fill="none"
          stroke={getColor(0)}
          dataKey={`cluster${0+1}`}
        />
        {/* {Array.from({ length: numberOfVMS }).map((_, i) => (
          <Area
            key={i} // Add a unique key for each component
            type="monotone"
            fill="none"
            stroke={getColor(i)}
            dataKey={`cluster${i + 1}`}
          />
        ))} */}
      </AreaChart>
    </div>
  );
};

export default GraphCPU;
