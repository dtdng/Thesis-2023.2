const projectId = "bustling-dynamo-420507";
const axios = require("axios");
const compute = require("@google-cloud/compute");

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
        console.log(` - ${instance.name}`);
        console.log(` \t ID:  ${instance.id}`);
        console.log(` \t Region:${instance.zone}`);
        console.log(` \t Status:${instance.status}`);
        console.log(` \t Type:${instance.kind}`);
      }
    }
  }
}

async function main() {
  listAllInstances(projectId);
  // getInstanceInformation(projectId, "us-west4-b", "instance-20240517-070922");
}

main().catch(console.error);
