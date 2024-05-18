const mongoose = require("mongoose");

const instanceInformationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  instanceID: {
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
  zone: {
    type: String,
    required: true,
  },
  projectID: {
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
  ipAddress: {
    type: String,
    required: false,
  },
  cpuCores: {
    type: Number,
    required: false,
  },

  memory: {
    type: Number,
    required: false,
  },
  storage: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model(
  "InstanceInformation",
  instanceInformationSchema
);
