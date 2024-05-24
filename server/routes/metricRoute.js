const express = require("express");
const Metric = require("../models/metricSchema");
const app = express();

app.post("/metric", async (request, response) => {
  const metric = new Metric(request.body);
  console.log("request.body", request.body);
  try {
    await metric.save();
    response.send(metric);
  } catch (error) {
    console.log("error", error);
    response.status(500).send(error);
  }
});

app.post("/metrics", async (request, response) => {
  const metricList = request.body.map((metric) => new Metric(metric));
  try {
    const result = await Metric.insertMany(metricList);
    console.log("Documents inserted successfully:", result.insertedIds);
    response.send(result.insertedIds);
  } catch (error) {
    console.log("error", error);
    response.status(500).send(error);
  }
});

app.get("/metrics", async (request, response) => {
  const metrics = await Metric.find({});
  try {
    response.send(metrics);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/metric/:instanceId", async (request, response) => {
  const instanceId = request.params.instanceId;
  const metrics = await Metric.findOne({ id: instanceId });

  try {
    response.send(metrics);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get(
  "/metric/:instanceId/:timeStart/:timeEnd",
  async (request, response) => {
    const instanceId = request.params.instanceId;
    const timeStart = request.params.timeStart;
    const timeEnd = request.params.timeEnd;
    const metrics = await Metric.find({
      id: instanceId,
      time: { $gte: timeStart, $lte: timeEnd },
    });

    try {
      response.send(metrics);
    } catch (error) {
      response.status(500).send(error);
    }
  }
);

module.exports = app;
