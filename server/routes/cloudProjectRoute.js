const express = require("express");
const app = express();
const compute = require("@google-cloud/compute");
const monitoring = require("@google-cloud/monitoring");
const { ClusterManagerClient } = require("@google-cloud/container").v1;
const ClusterInformation = require("../models/clusterInformationSchema");

function extractZoneInfo(url) {
  // Use URL object for easy parsing
  const urlObj = new URL(url);
  // Split path removing leading "/"
  const pathParts = urlObj.pathname.split("/").slice(5);
  // Zone information is the second element (index 1)
  return pathParts[1];
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
          const object = {
            name: instance.name,
            id: instance.id,
            zone: extractZoneInfo(instance.zone),
            status: instance.status,
            selfLink: instance.selfLink,
            type: instance.kind,
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

app.get("/cloudProject/:id/:provider", async (request, response) => {
  const projectID = request.params.id;
  const provider = request.params.provider;

  if (provider === "google") {
    try {
      const instances =
        (await listAllGoogleCloudProjectInstances(projectID)) || [];
      const clusters =
        (await listAllGoogleCloudProjectCluster(projectID)) || [];
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
    response.status(500).send("Provider not supported");
  } else {
    response.status(500).send("Provider not supported");
  }
});

module.exports = app;
