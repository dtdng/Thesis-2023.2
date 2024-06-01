const mongoose = require("mongoose");

const CostSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
  },
  cloudProjectID: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  cost: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
});

const Cost = mongoose.model("cost", CostSchema);
module.exports = Cost;
