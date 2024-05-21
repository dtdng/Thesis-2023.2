const express = require("express");
const app = express();
const compute = require("@google-cloud/compute");
const monitoring = require("@google-cloud/monitoring");
const { ClusterManagerClient } = require("@google-cloud/container").v1;
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
            zone: instance.zone,
            status: instance.status,
            selfLink: instance.selfLink,
            type: instance.kind,
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
      };
      clustersList.push(object);
    }
  } catch (error) {
    console.log(error);
    return null;
  }
  return clustersList;
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
      console.log("Result:", result);

      if (result.length > 0) {
        response.status(200).send(result);
      } else {
        response.status(404).send("No instances or clusters found");
      }
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
