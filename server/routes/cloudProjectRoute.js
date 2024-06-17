const express = require("express");
const app = express();
const compute = require("@google-cloud/compute");
const monitoring = require("@google-cloud/monitoring");
const CloudProject = require("../models/cloudProjectSchema");
const { ClusterManagerClient } = require("@google-cloud/container").v1;
const ClusterInformation = require("../models/clusterInformationSchema");
const functions = require("../../server2/function.js");
const {
  CloudWatchClient,
  GetMetricStatisticsCommand,
} = require("@aws-sdk/client-cloudwatch");
const { EC2Client, DescribeInstancesCommand } = require("@aws-sdk/client-ec2");

const REGION = "ap-southeast-2";
const ec2Client = new EC2Client({ region: REGION });

function extractZoneInfo(url) {
  // Use URL object for easy parsing

  const urlObj = new URL(url);
  // Split path removing leading "/"
  const pathParts = urlObj.pathname.split("/").slice(5);
  // Zone information is the second element (index 1)
  return pathParts[1];
}

function extractMachineType(url) {
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split("/");
  return pathParts[pathParts.length - 1];
}

function extractAWSRegionInfo(availabilityZone) {
  // Find the position of the last character (e.g., 'b' in 'ap-southeast-2b')
  const lastCharPosition = availabilityZone.length - 1;
  // Extract the region part (e.g., 'ap-southeast-2' from 'ap-southeast-2b')
  const region = availabilityZone.substring(0, lastCharPosition);
  return region;
}

// List all instances in the specified project.
async function listAllGoogleCloudProjectInstances(project_id) {
  const instancesClient = new compute.InstancesClient();

  //Use the `maxResults` parameter to limit the number of results that the API returns per response page.
  const aggListRequest = instancesClient.aggregatedListAsync({
    project: project_id,
    maxResults: 5,
  });

  var instancesList = [];
  try {
    for await (const [zone, instancesObject] of aggListRequest) {
      const instances = instancesObject.instances;
      if (instances && instances.length > 0) {
        for (const instance of instances) {
          // console.log(instance);
          const object = {
            name: instance.name,
            id: instance.id,
            zone: extractZoneInfo(instance.zone),
            status: instance.status,
            selfLink: instance.selfLink,
            type: instance.kind,
            plan: extractMachineType(instance.machineType),
            existed: false,
          };
          instancesList.push(object);
        }
      }
    }
  } catch (error) {
    console.log(error);
    return null;
  }
  console.log(instancesList);
  return instancesList;
}
async function listAllGoogleCloudProjectCluster(project_id) {
  const parent = `projects/${project_id}/locations/-`;
  const containerClient = new ClusterManagerClient();

  const request = {
    parent,
  };

  var clustersList = [];
  try {
    const response = await containerClient.listClusters(request);
    const data = response[0].clusters;
    for (let i = 0; i < data.length; i++) {
      const object = {
        name: data[i].name,
        id: data[i].id,
        zone: data[i].zone,
        status: data[i].status,
        selfLink: data[i].selfLink,
        type: "k8s_cluster",
        existed: false,
      };
      clustersList.push(object);
    }
  } catch (error) {
    console.log(error);
    return null;
  }
  return clustersList;
}

const listAllAWSInstance = async (tagApplicationValue) => {
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
          console.log(instance);
          let instanceObject = {
            name: instance.Tags.find((tag) => tag.Key === "Name").Value,
            id: instance.InstanceId,
            zone: extractAWSRegionInfo(instance.Placement.AvailabilityZone),
            status: instance.State.Name == "running" ? "RUNNING" : "TERMINATED",
            selfLink: instance.InstanceId,
            type: instance.InstanceType,
            plan: instance.InstanceType, // Not sure what to put here
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
  console.log(instanceList);
  return instanceList;
};

async function checkClusterExistence(result) {
  for (const element of result) {
    try {
      const check = await ClusterInformation.findOne({ name: element.name });
      // console.log("Check:", check);
      element.existed = !!check;
    } catch (error) {
      console.error("Error checking cluster existence:", error);
      element.existed = false; // Default to false if there's an error
    }
  }
  return result;
}

app.patch("/cloudProject/:provider", async (request, response) => {
  const provider = request.params.provider;
  const { cloudProjectID } = request.body;
  // console.log("Project ID:", cloudProjectID);
  // console.log("Provider:", provider);
  if (provider === "google") {
    try {
      const instances =
        (await listAllGoogleCloudProjectInstances(cloudProjectID)) || [];
      const clusters =
        (await listAllGoogleCloudProjectCluster(cloudProjectID)) || [];
      const result = [...instances, ...clusters];
      checkClusterExistence(result).then((updatedResult) => {
        console.log("Updated Result:", updatedResult);
        if (updatedResult.length > 0) {
          response.status(200).send(updatedResult);
        } else {
          response.status(404).send("No instances or clusters found");
        }
        // Do something with the updated result
      });
    } catch (error) {
      console.error("Error:", error);
      response.status(500).send("Internal server error");
    }
  } else if (provider === "aws") {
    try {
      const instances = await listAllAWSInstance(cloudProjectID);
      checkClusterExistence(instances).then((updatedResult) => {
        console.log("Updated Result:", updatedResult);
        if (updatedResult.length > 0) {
          response.status(200).send(updatedResult);
        } else {
          response.status(404).send("No instances found");
        }
        // Do something with the updated result
      });
    } catch (error) {
      console.error("Error:", error);
      response.status(500).send("Internal server error");
    }
  } else {
    response.status(500).send("Provider not supported");
  }
});

app.post("/cloudProject", async (request, response) => {
  const cloudProject = new CloudProject(request.body);

  try {
    const result = await cloudProject.save();
    functions.updateNewBill();
    response.status(201).send(result);
  } catch (error) {
    response.status(400).send(error);
  }
});

app.get("/cloudProject", async (request, response) => {
  try {
    const result = await CloudProject.find();
    response.status(200).send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/cloudProject/:id", async (request, response) => {
  const id = request.params.id;

  try {
    const result = await CloudProject.findById(id);
    response.status(200).send(result);
  } catch (error) {
    response.status(404).send("Cloud Application not found");
  }
});

app.get("/cloudProject/project/:projectID", async (request, response) => {
  const projectID = request.params.projectID;

  try {
    const result = await CloudProject.find({ projectId: projectID });
    response.status(200).send(result);
  } catch (error) {
    response.status(404).send("Cloud Application not found");
  }
});

app.put("/cloudProject/:id", async (request, response) => {
  const id = request.params.id;

  try {
    const cloudProject = await CloudProject.findByIdAndUpdate(
      id,
      request.body,
      { new: true, runValidators: true }
    );
    response.status(200).send(cloudProject);
    functions.updateNewBill();
  } catch (error) {
    response.status(404).send("Cloud Application not found");
  }
});

module.exports = app;
