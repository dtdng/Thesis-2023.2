const mongoose = require("mongoose");

const cloudProject = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  tag: {
    type: String,
    required: false,
  },
  provider: {
    type: String,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
  billingTableId: {
    type: String,
    required: false,
  },
});

const CloudProject = mongoose.model("CLOUDPROJECT", cloudProject);
module.exports = CloudProject;
