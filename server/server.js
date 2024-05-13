const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
dotenv.config({ path: "./.env" });

const accountRoute = require("./routes/accountRoute.js");
const projectRoute = require("./routes/projectRoute.js");

const app = express();
const PORT = 3000;
const uri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(accountRoute);
app.use(projectRoute);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
