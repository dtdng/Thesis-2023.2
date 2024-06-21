const express = require("express");
const projectSchema = require("../models/projectSchema");
const app = express();

app.post("/project", async (request, response) => {
  const project = new projectSchema(request.body);

  try {
    await project.save();
    response.send(project);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/projects", async (request, response) => {
  const projects = await projectSchema.find({});

  try {
    response.send(projects);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/project/:id", async (request, response) => {
  const project = await projectSchema.findById(request.params.id);

  try {
    response.send(project);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/project/user/:userID", async (request, response) => {
  try {
    const projects = await projectSchema.find({
      projectMembers: { $elemMatch: { uid: request.params.userID } },
    });
    response.send(projects);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.patch("/project/:id", async (request, response) => {
  console.log("request.body: ", request.body);

  try {
    console.log(
      await projectSchema.findByIdAndUpdate(request.params.id, request.body)
    );
    console.log(await projectSchema.save());

    // response.send(project);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.put("/project/:id", async (request, response) => {
  try {
    console.log("request.body: ", request.body);
    const project = await projectSchema.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true }
    );
    await project.save();
    response.send(project);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = app;
