import React from "react";
import { useState, useEffect, useContext } from "react";
import addProjectIcon from "../assets/add-project.svg";
import { Table } from "react-bootstrap";
import "./style.scss";

const ProjectsList = () => {
  const projects = [
    {
      projectName: "Project 1",
      projectDescription: "This is project 1",
      numberOfVMs: 3,
      Billing: 100,
      Status: "Running",
    },
    {
      projectName: "Project 2",
      projectDescription: "This is project 2",
      numberOfVMs: 5,
      Billing: 200,
      Status: "Stopped",
    },
    {
      projectName: "Project 3",
      projectDescription: "This is project 3",
      numberOfVMs: 2,
      Billing: 50,
      Status: "Close",
    },
  ];

  return (
    <div className="projectListPage">
      <div className="projectHeader">
        <h3>Project List</h3>
        <button>
          <img src={addProjectIcon} alt="" srcset="" />
          Add Project
        </button>
      </div>
      <div className="projectListTable">
        <Table className="mt-4" hover size="sm">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Project Description</th>
              <th>Number of VMs</th>
              <th>Billing</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr>
                <td>{project.projectName}</td>
                <td>{project.projectDescription}</td>
                <td>{project.numberOfVMs}</td>
                <td>{project.Billing} $</td>
                <td>
                  {project.Status == "Running" && (
                    <p className="running status">{project.Status}</p>
                  )}
                  {project.Status == "Stopped" && (
                    <p className="stopped status">{project.Status}</p>
                  )}
                  {project.Status == "Close" && (
                    <p className="close status">{project.Status}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ProjectsList;
