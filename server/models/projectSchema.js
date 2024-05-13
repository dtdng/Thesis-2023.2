const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    unique: true,
  },
  projectDescription: {
    type: String,
    required: true,
  },
  projectAdmin: {
    type: String,
    required: true,
  },
  projectMembers: {
    type: Array,
    required: true,
  },
  projectStatus: { type: String, required: true },
  projectCreateDate: { type: String, default: Date.now },
  projectCloseDate: { type: String, required: false },
  budgetLimit: { type: Number, required: true },
  totalBill: { type: Number, required: true },
  numberOfVMs: { type: Number, required: true },
});

const Account = mongoose.model("PROJECT", projectSchema);
module.exports = Account;
