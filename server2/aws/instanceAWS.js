const {
  CloudWatchClient,
  GetMetricStatisticsCommand,
} = require("@aws-sdk/client-cloudwatch");
const {
  ApplicationInsightsClient,
  ListApplicationsCommand,
} = require("@aws-sdk/client-application-insights");
const { EC2Client, DescribeInstancesCommand } = require("@aws-sdk/client-ec2");

const REGION = "ap-southeast-2"; // Replace with your AWS region
// const INSTANCE_ID = "i-0aa4249a0b2bee44c"; // Replace with your instance ID

const cloudwatchClient = new CloudWatchClient({ region: REGION });
const ec2Client = new EC2Client({ region: REGION });
// const rdsClient = new RDSClient({ region: REGION });

function convertToTimestamp(dateString) {
  const date = new Date(dateString); // Parse the ISO 8601 date string
  const timestamp = Math.floor(date.getTime() / 1000); // Convert to seconds and round down
  return timestamp;
}

const getListInstanceInProject = async (tagApplicationValue) => {
  var instanceList = [];
  try {
    const params = {
      Filters: [
        {
          Name: "tag:awsApplication",
          Values: [tagApplicationValue],
        },
      ],
    };

    const data = await ec2Client.send(new DescribeInstancesCommand(params));

    if (data.Reservations.length > 0) {
      data.Reservations.forEach((reservation) => {
        reservation.Instances.forEach((instance) => {
          // console.log(instance);
          let instanceObject = {
            name: instance.Tags.find((tag) => tag.Key === "Name").Value,
            id: instance.InstanceId,
            zone: instance.Placement.AvailabilityZone,
            status: instance.State.Name,
            selfLink: instance.InstanceId,
            type: instance.InstanceType,
            existed: false,
          };
          instanceList.push(instanceObject);
        });
      });
    } else {
      console.log("Instance not found");
    }
  } catch (err) {
    console.error("Error", err);
  }
  // console.log(instanceList);
  return instanceList;
};

const getCPUUsageInstanceAWS = async (instanceId) => {
  const params = {
    Namespace: "AWS/EC2",
    MetricName: "CPUUtilization",
    Dimensions: [
      {
        Name: "InstanceId",
        Value: instanceId,
      },
    ],
    StartTime: new Date(Date.now() - 60 * 10 * 1000), // 10 minutes ago
    EndTime: new Date(Date.now()),
    Period: 60, // 1 minutes
    Statistics: ["Average"],
  };

  var result = {
    metric_type: "cpu_utilization",
    id: 0,
    time: 0,
    value: 0,
  };

  try {
    const data = await cloudwatchClient.send(
      new GetMetricStatisticsCommand(params)
    );
    if (data.Datapoints.length > 0) {
      // console.log(data);
      result.id = instanceId;
      result.time = convertToTimestamp(
        data.Datapoints[data.Datapoints.length - 1].Timestamp
      );
      // console.log(data.Datapoints[data.Datapoints.length - 1].Timestamp);
      result.value =
        Math.round(data.Datapoints[data.Datapoints.length - 1].Average * 10) /
        10;
    } else {
      console.log("No data available");
    }
  } catch (err) {
    console.error("Error", err);
    return null;
  }
  // console.log(result);
  return result;
};

const getNetworkInInstanceAWS = async (instanceId) => {
  const params = {
    Namespace: "AWS/EC2",
    MetricName: "NetworkIn",
    Dimensions: [
      {
        Name: "InstanceId",
        Value: instanceId,
      },
    ],
    StartTime: new Date(Date.now() - 60 * 10 * 1000), // 10 minutes ago
    EndTime: new Date(Date.now()),
    Period: 60, // 1 minutes
    Statistics: ["Average"],
  };

  var result = {
    metric_type: "network_in",
    id: 0,
    time: 0,
    value: 0,
  };

  try {
    const data = await cloudwatchClient.send(
      new GetMetricStatisticsCommand(params)
    );
    if (data.Datapoints.length > 0) {
      // console.log(data);
      result.id = instanceId;
      result.time = convertToTimestamp(
        data.Datapoints[data.Datapoints.length - 1].Timestamp
      );
      // console.log(data.Datapoints[data.Datapoints.length - 1].Timestamp);
      result.value =
        Math.round(data.Datapoints[data.Datapoints.length - 1].Average * 10) /
        10;
    } else {
      console.log("No data available");
    }
  } catch (err) {
    console.error("Error", err);
    return null;
  }
  // console.log(result);
  return result;
};

const getNetworkOutInstanceAWS = async (instanceId) => {
  const params = {
    Namespace: "AWS/EC2",
    MetricName: "NetworkOut",
    Dimensions: [
      {
        Name: "InstanceId",
        Value: instanceId,
      },
    ],
    StartTime: new Date(Date.now() - 60 * 10 * 1000), // 10 minutes ago
    EndTime: new Date(Date.now()),
    Period: 60, // 1 minutes
    Statistics: ["Average"],
  };

  var result = {
    metric_type: "network_out",
    id: 0,
    time: 0,
    value: 0,
  };

  try {
    const data = await cloudwatchClient.send(
      new GetMetricStatisticsCommand(params)
    );
    if (data.Datapoints.length > 0) {
      // console.log(data);
      result.id = instanceId;
      result.time = convertToTimestamp(
        data.Datapoints[data.Datapoints.length - 1].Timestamp
      );
      // console.log(data.Datapoints[data.Datapoints.length - 1].Timestamp);
      result.value =
        Math.round(data.Datapoints[data.Datapoints.length - 1].Average * 10) /
        10;
    } else {
      console.log("No data available");
    }
  } catch (err) {
    console.error("Error", err);
    return null;
  }
  // console.log(result);
  return result;
};

module.exports = {
  getListInstanceInProject,
  getCPUUsageInstanceAWS,
  getNetworkInInstanceAWS,
  getNetworkOutInstanceAWS,
};
