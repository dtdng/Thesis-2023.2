const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
dotenv.config({ path: "./.env" });

const functions = require("./function.js");

const app = express();
const PORT = 3004;
const uri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

setInterval(() => {
  functions.collectMetric();
}, 90000); // 1 minute 30 seconds



setInterval(() => {
  functions.updateNewBill();
}, 1000 * 60 * 60 * 24); // 1 day

functions.updateNewBill();
functions.collectMetric();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
