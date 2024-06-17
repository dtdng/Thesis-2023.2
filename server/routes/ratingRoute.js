const express = require("express");
const app = express();

const MongoClient = require("mongodb").MongoClient; //

const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const uri = process.env.MONGODB_URI;

app.get("/rating", async (req, res) => {
  filter = {};
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const coll = client.db("data").collection("reviewCollection");
  const cursor = coll.find(filter);
  const result = await cursor.toArray();
  res.send(result);

  await client.close();
});

app.post("/rating", async (req, res) => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const coll = client.db("data").collection("reviewCollection");
  const result = await coll.insertOne(req.body);
  res.send(result);

  await client.close();
});

app.get("/rating/overview", async (req, res) => {
  const agg = [
    {
      $group: {
        _id: {
          product: "$product",
          region: "$region",
          cloud_provider: "$cloud_provider",
        },
        average_rating: {
          $avg: {
            $toDouble: "$overall_rating",
          },
        },
      },
    },
  ];
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const coll = client.db("data").collection("reviewCollection");
  const cursor = coll.aggregate(agg);
  const result = await cursor.toArray();
  res.send(result);

  await client.close();
});

module.exports = app;
