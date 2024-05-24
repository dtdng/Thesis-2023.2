const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
dotenv.config({ path: "./.env" });

const googleInstance = require("./query/GoogleInstance.js");

const app = express();
const PORT = 3001;
const uri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// googleInstance.listAllInstances("bustling-dynamo-420507");

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
