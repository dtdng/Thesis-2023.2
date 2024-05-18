const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
dotenv.config({ path: "./.env" });

const accountRoute = require("./routes/accountRoute.js");
const projectRoute = require("./routes/projectRoute.js");
const ClusterInformationRoute = require("./routes/clusterInformationRoute.js");
const instanceInformationRoute = require("./routes/instanceInformationRoute.js");

const app = express();
const PORT = 3000;
const uri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(accountRoute);
app.use(projectRoute);
app.use(ClusterInformationRoute);
app.use(instanceInformationRoute);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
