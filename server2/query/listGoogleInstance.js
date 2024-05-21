const projectId = "bustling-dynamo-420507";
const compute = require("@google-cloud/compute");
const monitoring = require("@google-cloud/monitoring");

// List all instances in the specified project.
async function listAllInstances(project_id) {
  const instancesClient = new compute.InstancesClient();

  //Use the `maxResults` parameter to limit the number of results that the API returns per response page.
  const aggListRequest = instancesClient.aggregatedListAsync({
    project: project_id,
    maxResults: 5,
  });

  console.log("Instances found:");

  for await (const [zone, instancesObject] of aggListRequest) {
    const instances = instancesObject.instances;
    // console.log(instances);
    if (instances && instances.length > 0) {
      console.log(` ${zone}`);
      for (const instance of instances) {
        console.log(instance);
        console.log(` - ${instance.name}`);
        console.log(` \t ID:  ${instance.id}`);
        console.log(` \t Region:${instance.zone}`);
        console.log(` \t Status:${instance.status}`);
        console.log(` \t Type:${instance.kind}`);
      }
    }
  }
}

async function getInstanceCPUMetricList(project_id, instance_id) {
  // Creates a client
  const monitoringClient = new monitoring.MetricServiceClient();

  let request = {};
  if (instance_id == 0) {
    request = {
      name: monitoringClient.projectPath(project_id),
      filter:
        'metric.type="compute.googleapis.com/instance/cpu/utilization" AND resource.type="gce_instance"',
      interval: {
        startTime: {
          seconds: Math.floor(Date.now() / 1000) - 60 * 5, // Limit results to the last 20 minutes
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
      name: monitoringClient.projectPath(project_id),
      filter:
        'metric.type="compute.googleapis.com/instance/cpu/utilization" AND resource.type="gce_instance" AND metric.labels.instance_name="' +
        instance_id +
        '"',
      interval: {
        startTime: {
          seconds: Math.floor(Date.now() / 1000) - 60 * 5, // Limit results to the last 20 minutes
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

  try {
    // Writes time series data
    const [timeSeries] = await monitoringClient.listTimeSeries(request);

    console.log("CPU utilization:");
    timeSeries.forEach((data) => {
      console.log(`Instance: ${data.metric.labels.instance_name}`);
      data.points.forEach((point, index) => {
        const timeAgo = Math.round(
          (Date.now() / 1000 - point.interval.endTime.seconds) / 60
        );
        console.log(
          `  ${timeAgo} min ago: ${Math.round(point.value.doubleValue * 100)}%`
        );
      });
      console.log("=====");
    });
  } catch (err) {
    console.error("Error fetching time series data:", err);
  }
}

async function main() {
  // listAllInstances(projectId).then(() =>
  //   readTimeSeriesAggregate(projectId, "instance-20240517-070922")
  // );
  listAllInstances(projectId);
  // getInstanceCPUMetricList(projectId, 0);
}

main().catch(console.error);
