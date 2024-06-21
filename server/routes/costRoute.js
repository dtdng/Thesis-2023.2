const express = require("express");

const MongoClient = require("mongodb").MongoClient;
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

app.get("/costs/total/:projectID", async (request, response) => {
  const agg = [
    {
      $match: {
        currency: "VND",
      },
    },
    {
      $addFields: {
        costInUSD: {
          $convert: {
            input: "$cost",
            to: "double",
            onError: 0,
            onNull: 0,
          },
        },
      },
    },
    {
      $addFields: {
        costInUSD: {
          $divide: ["$costInUSD", 24000],
        },
      },
    },
    {
      $group: {
        _id: "$cloudProjectID",
        totalCostUSD: {
          $sum: "$costInUSD",
        },
      },
    },
  ];

  try {
    const client = await MongoClient.connect(
      "mongodb+srv://dangdatcao2002:datpro2812@cluster0.yxpvmbt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    const coll = client.db("test").collection("costs");
    const cursor = coll.aggregate(agg);
    const result = await cursor.toArray();
    await client.close();
    response.status(200).send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});
module.exports = app;
