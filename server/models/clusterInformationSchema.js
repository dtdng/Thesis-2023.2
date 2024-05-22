const mongoose = require("mongoose");

const clusterInformation = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  id: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
  cloudProjectID: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  selfLink: {
    type: String,
    required: true,
  },
});

const ClusterInformation = mongoose.model(
  "CLUSTERINFORMATION",
  clusterInformation
);
module.exports = ClusterInformation;
