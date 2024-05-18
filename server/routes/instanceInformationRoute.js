const express = require("express");
const InstanceInformation = require("../models/instanceInformationSchema");

const router = express.Router();

const getInstanceInformation = async (req, res, next) => {
  let instanceInfo;
  try {
    instanceInfo = await InstanceInformation.findById(req.params.id);
    if (instanceInfo == null) {
      return res
        .status(404)
        .json({ message: "Cannot find instance information" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.instanceInfo = instanceInfo;
  next();
};

// Create a new instance information
router.post("/instance", async (req, res) => {
  try {
    const instanceInfo = new InstanceInformation(req.body);
    await instanceInfo.save();
    res.status(201).json(instanceInfo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all instance information
router.get("/instance", async (req, res) => {
  try {
    const instanceInfo = await InstanceInformation.find();
    res.json(instanceInfo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific instance information
router.get("/instance/:id", getInstanceInformation, (req, res) => {
  res.json(res.instanceInfo);
});

// Update a specific instance information
router.patch("/instance/:id", getInstanceInformation, async (req, res) => {
  if (req.body.name != null) {
    res.instanceInfo.name = req.body.name;
  }
  if (req.body.description != null) {
    res.instanceInfo.description = req.body.description;
  }
  try {
    const updatedInstanceInfo = await res.instanceInfo.save();
    res.json(updatedInstanceInfo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a specific instance information
router.delete("/instance/:id", getInstanceInformation, async (req, res) => {
  try {
    await res.instanceInfo.remove();
    res.json({ message: "Instance information deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
