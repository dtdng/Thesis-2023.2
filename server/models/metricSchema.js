const mongoose = require("mongoose");

const metricSchema = new mongoose.Schema({
  metric_type: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const Metric = mongoose.model("Metric", metricSchema);
module.exports = Metric;
