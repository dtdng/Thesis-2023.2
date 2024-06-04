const express = require("express");
const Cost = require("../models/costSchema");
const app = express();

app.post("/cost", async (request, response) => {
  const cost = new Cost(request.body);
  try {
    await cost.save();
    response.send(cost);
  } catch (error) {
    console.log("error", error);
    response.status(500).send(error);
  }
});

app.get("/costs", async (request, response) => {
  const costs = await Cost.find({});
  try {
    response.send(costs);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/costs/project/:projectId", async (request, response) => {
  const projectId = request.params.projectId;
  const costs = await Cost.find({ projectId: projectId });
  try {
    response.send(costs);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/costs/cloudProject/:cloudProjectID", async (request, response) => {
  const cloudProjectId = request.params.cloudProjectID;
  const costs = await Cost.find({ cloudProjectID: cloudProjectId });
  try {
    response.send(costs);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.patch("/costs/cloudProject/", async (request, response) => {
  console.log("request", request.body);
  const cloudProjectId = request.body.cloudProjectID;
  const costs = await Cost.find({ cloudProjectID: cloudProjectId });
  try {
    response.send(costs);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.delete("/costs", async (request, response) => {
  try {
    await Cost.deleteMany({});
    response.send("All costs deleted successfully");
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = app;
