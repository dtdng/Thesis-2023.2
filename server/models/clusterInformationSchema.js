const mongoose = require("mongoose");

const clusterInformation = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  region: {
    type: String,
    required: true,
  },
  projectID: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  zone: {
    type: Array,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  VITE_GOOGLE_CLIENT_ID: {
    type: String,
    required: false,
  },
  VITE_GOOGLE_API_KEY: {
    type: String,
    required: false,
  },
});

const ClusterInformation = mongoose.model(
  "CLUSTERINFORMATION",
  clusterInformation
);
module.exports = ClusterInformation;
