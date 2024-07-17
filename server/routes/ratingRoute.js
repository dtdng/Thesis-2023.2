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

app.get("/rating/:region/:provider/:product", async (req, res) => {
  var { region, provider, product } = req.params;
  //convert Kubernetes%20Engine => Kubernetes Engine
  product = product.replace(/%20/g, " ");
  console.log(product, region, provider);

  const filter = {
    cloud_provider: provider,
    product: product,
    region: region,
  };
  const projection = {};
  const client = await MongoClient.connect(
    "mongodb+srv://dangdatcao2002:datpro2812@cluster0.yxpvmbt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  const coll = client.db("data").collection("reviewCollection");
  const cursor = coll.find(filter, { projection });
  const result = await cursor.toArray();
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
          overall_rating: "$overall_rating",
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $group: {
        _id: {
          product: "$_id.product",
          region: "$_id.region",
          cloud_provider: "$_id.cloud_provider",
        },
        ratings: {
          $push: {
            rating: "$_id.overall_rating",
            count: "$count",
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
