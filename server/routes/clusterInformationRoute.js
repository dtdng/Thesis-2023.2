const express = require("express");
const ClusterInformation = require("../models/clusterInformationSchema");
const app = express();

app.post("/cluster", async (request, response) => {
  console.log("request.body", request.body);
  const cluster = new ClusterInformation(request.body);
  try {
    await cluster.save();
    response.send(cluster);
  } catch (error) {
    console.log("error", error);
    response.status(500).send(error);
  }
});

app.get("/clusters", async (request, response) => {
  const clusters = await ClusterInformation.find({});

  try {
    response.send(clusters);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/clusters/:projectId", async (request, response) => {
  const projectId = request.params.projectId;
  const clusters = await ClusterInformation.find({ projectId: projectId });
  try {
    response.send(clusters);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/cluster/:id", async (request, response) => {
  const cluster = await ClusterInformation.findById(request.params.id);

  try {
    response.send(cluster);
  } catch (error) {
    response.status(500).send(error);
  }
});

// app.put("/cluster/:id", async (request, response) => {
//   console.log("request.body", request.body);
//   try {
//     await ClusterInformation.findByIdAndUpdate(request.params.id, request.body);
//     await ClusterInformation.save();
//   } catch (error) {
//     response.status(500).send(error);
//   }
// });

app.put("/cluster/:id", async (request, response) => {
  try {
    const cluster = await ClusterInformation.findByIdAndUpdate(
      request.params.id,
      request.body
    );
    await cluster.save();
    response.send(cluster);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.delete("/cluster/:id", async (request, response) => {
  try {
    const cluster = await ClusterInformation.findByIdAndDelete(
      request.params.id
    );

    if (!cluster) response.status(404).send("No item found");
    response.status(200).send();
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = app;
