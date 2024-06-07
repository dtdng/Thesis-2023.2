const axios = require("axios");

function extractZoneInfo(url) {
  // Use URL object for easy parsing
  const urlObj = new URL(url);
  // Split path removing leading "/"
  const pathParts = urlObj.pathname.split("/").slice(5);
  // Zone information is the second element (index 1)
  return pathParts[1];
}

// List all instances in the specified project.
async function listAllInstances(cloudProjectId) {
  const compute = require("@google-cloud/compute");
  const monitoring = require("@google-cloud/monitoring");
  const instancesClient = new compute.InstancesClient();

  //Use the `maxResults` parameter to limit the number of results that the API returns per response page.
  const aggListRequest = instancesClient.aggregatedListAsync({
    project: cloudProjectId,
    maxResults: 5,
  });

  console.log("Instances found:");

  for await (const [zone, instancesObject] of aggListRequest) {
    const instances = instancesObject.instances;
    // console.log(instances);
    if (instances && instances.length > 0) {
      console.log(` ${zone}`);
      for (const instance of instances) {
        // console.log(instance);
        console.log(` - ${instance.name}`);
        console.log(` \t ID:  ${instance.id}`);
        console.log(` \t Region:${instance.zone}`);
        console.log(` \t Status:${instance.status}`);
        console.log(` \t Type:${instance.kind}`);
      }
    }
  }
}

async function getInstanceCPUMetricList(cloudProjectId, instance_id) {
  // Creates a client
  const compute = require("@google-cloud/compute");
  const monitoring = require("@google-cloud/monitoring");
  const monitoringClient = new monitoring.MetricServiceClient();

  let request = {};
  if (instance_id == 0) {
    request = {
      name: monitoringClient.projectPath(cloudProjectId),
      filter:
        'metric.type="compute.googleapis.com/instance/cpu/utilization" AND resource.type="gce_instance"',
      interval: {
        startTime: {
          seconds: Math.floor(Date.now() / 1000) - 60 * 3, // Limit results to the last 20 minutes
        },
        endTime: {
          seconds: Math.floor(Date.now() / 1000),
        },
      },
      aggregation: {
        alignmentPeriod: {
          seconds: 60, // Aggregate results every 60 seconds
        },
        perSeriesAligner: "ALIGN_MEAN",
      },
    };
  } else {
    request = {
      name: monitoringClient.projectPath(cloudProjectId),
      filter:
        'metric.type="compute.googleapis.com/instance/cpu/utilization" AND resource.type="gce_instance" AND resource.labels.instance_id="' +
        instance_id +
        '"',
      interval: {
        startTime: {
          seconds: Math.floor(Date.now() / 1000) - 60 * 4, // Limit results to the last 20 minutes
        },
        endTime: {
          seconds: Math.floor(Date.now() / 1000),
        },
      },
      aggregation: {
        alignmentPeriod: {
          seconds: 60, // Aggregate results every 60 seconds
        },
        perSeriesAligner: "ALIGN_MEAN",
      },
    };
  }
  var result = {
    metric_type: "cpu_utilization",
    id: 0,
    time: 0,
    value: 0,
  };
  try {
    // Writes time series data
    console.log(request);
    const [timeSeries] = await monitoringClient.listTimeSeries(request);
    timeSeries.forEach((data) => {
      if (data.metric.labels.instance_name != null) {
        result.id = data.metric.labels.instance_name;
        result.time = data.points[0].interval.endTime.seconds;
        result.value = Math.round(data.points[0].value.doubleValue * 100);
      }
    });
  } catch (err) {
    console.error("Error fetching time series data:", err);
    return null;
  }
  return result;
}

async function getInstanceMemoryMetricList(cloudProjectId, instance_id) {
  // Creates a client
  const compute = require("@google-cloud/compute");
  const monitoring = require("@google-cloud/monitoring");
  const monitoringClient = new monitoring.MetricServiceClient();

  let request = {};
  if (instance_id == 0) {
    request = {
      name: monitoringClient.projectPath(cloudProjectId),
      filter:
        'metric.type="agent.googleapis.com/memory/percent_used" AND resource.type="gce_instance" AND metric.labels.state="used"',
      interval: {
        startTime: {
          seconds: Math.floor(Date.now() / 1000) - 60, // Limit results to the last 5 minutes
        },
        endTime: {
          seconds: Math.floor(Date.now() / 1000),
        },
      },
    };
  } else {
    request = {
      name: monitoringClient.projectPath(cloudProjectId),
      filter:
        'metric.type="agent.googleapis.com/memory/percent_used" AND resource.type="gce_instance" AND metric.labels.state="used" AND resource.labels.instance_id="' +
        instance_id +
        '"',
      interval: {
        startTime: {
          seconds: Math.floor(Date.now() / 1000) - 60, // Limit results to the last 5 minutes
        },
        endTime: {
          seconds: Math.floor(Date.now() / 1000),
        },
      },
    };
  }

  var result = {
    metric_type: "memory_utilization",
    id: 0,
    time: 0,
    value: 0,
  };

  try {
    // Writes time series data
    const [timeSeries] = await monitoringClient.listTimeSeries(request);

    // console.log("Memory utilization:");
    timeSeries.forEach((data) => {
      // console.log(`Instance: ${data.resource.labels.instance_id}`);
      if (data.resource.labels.instance_id != null) {
        result.id = data.resource.labels.instance_id;
        result.time = data.points[0].interval.endTime.seconds;
        result.value = Math.round(data.points[0].value.doubleValue);
      }
    });
  } catch (err) {
    console.error("Error fetching time series data:", err);
    return null;
  }
  return result;
}

async function getListProject() {
  const compute = require("@google-cloud/compute");
  const monitoring = require("@google-cloud/monitoring");
  var listProjectID = [];
  try {
    const response = await axios.get(`http://localhost:3000/projects`);
    const listProject = response.data;
    listProject.forEach((project) => {
      listProjectID.push(project._id);
    });
  } catch (error) {
    console.log(error);
    return null;
  }

  return listProjectID;
}

async function getListInstanceInMultiCloudProject(project_id) {
  const axios = require("axios");

  var listInstance = [];
  try {
    const response = await axios.get(
      `http://localhost:3000/clusters/${project_id}`
    );
    listInstance = response.data;
  } catch (error) {
    console.log(error);
    return null;
  }

  return listInstance;
}

async function main() {
  const result1 = await getInstanceCPUMetricList(
    "graduation-reasearch",
    "6216207772348936593"
  );
  const result2 = await getInstanceMemoryMetricList(
    "graduation-reasearch",
    "6216207772348936593"
  );
  console.log(result1);
  console.log(result2);
}

main();

module.exports = {
  listAllInstances,
  getListProject,
  getListInstanceInMultiCloudProject,
  getInstanceCPUMetricList,
  getInstanceMemoryMetricList,
};
