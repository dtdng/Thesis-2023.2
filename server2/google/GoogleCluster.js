const monitoring = require("@google-cloud/monitoring");

const getClusterInformationInProject = function (project_id) {
  const parent = `projects/${project_id}/locations/-`;

  // Imports the Container library
  const { ClusterManagerClient } = require("@google-cloud/container").v1;

  // Instantiates a client
  const containerClient = new ClusterManagerClient();

  async function callListClusters() {
    // Construct request
    const request = {
      parent,
    };

    console.log("Clusters found:");
    const response = await containerClient.listClusters(request);

    const data = response[0].clusters;
    for (let i = 0; i < data.length; i++) {
      console.log(data[i]);
      console.log("\t" + data[i].status);
      console.log("\t" + data[i].locations);
      console.log("\t" + data[i].location);
      console.log("\t" + data[i].zone);
      console.log("\t" + data[i].selfLink);
    }
  }

  callListClusters();
};

const getClusterCPUMetricList = async function (project_id, cluster_id) {
  // Creates a client
  const monitoringClient = new monitoring.MetricServiceClient();

  let request = {};
  if (cluster_id == 0) {
    request = {
      name: monitoringClient.projectPath(project_id),
      filter:
        'metric.type="kubernetes.io/container/cpu/core_usage_time" AND resource.type="k8s_container" AND resource.labels.cluster_name="autopilot-cluster-1"',
      interval: {
        startTime: {
          seconds: Math.floor(Date.now() / 1000) - 60 * 5, // Limit results to the last 5 minutes
        },
        endTime: {
          seconds: Math.floor(Date.now() / 1000),
        },
      },
    };
  } else {
  }
  // console.log(request);

  try {
    // Writes time series data
    const [timeSeries] = await monitoringClient.listTimeSeries(request);
    // console.log(timeSeries);
    console.log("CPU utilization:");

    timeSeries.forEach((data) => {
      console.log(data.resource.labels.container_name);

      data.points.forEach((point) => {
        console.log(
          point.interval.startTime.seconds +
            "-" +
            point.interval.endTime.seconds +
            ": " +
            point.value.doubleValue
        );
      });
    });
  } catch (err) {
    console.error("Error fetching time series data:", err);
  }
};

const getClusterMemoryMetricList = async function (project_id, cluster_id) {};

// getClusterInformationInProject("bustling-dynamo-420507");
// getClusterCPUMetricList("bustling-dynamo-420507", 0);

module.exports = {
  getClusterInformationInProject,
  getClusterCPUMetricList,
  getClusterMemoryMetricList,
};
