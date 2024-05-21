import React from "react";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import { useAuth } from "../contexts/authContext/index";
import "./style.scss";
import axios from "axios";

import addProjectIcon from "../assets/add-project.svg";
import CreateProjectForm from "./CreateProjectForm";
import refreshIcon from "../assets/refresh.svg";

const ProjectsList = () => {
  const { currentUserData } = useAuth();
  const [projectsList, setProjectsList] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddProjectButton = async () => {
    setButtonPopup(true);
  };

  const fetchData = async () => {
    try {
      setLoading(false);
      const projectsResponse = await axios.get(
        `http://localhost:3000/project/user/${currentUserData._id}`
      );
      setProjectsList(projectsResponse.data);
      // console.log(projectsList);
      setLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefreshButton = () => {
    fetchData();
  };

  return (
    <div className="projectListPage">
      <div className="projectHeader">
        <h3>Project List</h3>
        <CreateProjectForm
          trigger={buttonPopup}
          setTrigger={setButtonPopup}
        ></CreateProjectForm>
        <div>
          <button
            type="button"
            onClick={handleRefreshButton}
            className="refresh-btn"
          >
            <img src={refreshIcon} alt="refresh" />
          </button>
          <button type="button" onClick={handleAddProjectButton}>
            <img src={addProjectIcon} alt="add project" />
            Add Project
          </button>
        </div>
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
            {loading == false && (
              <div className="loading">Loading List Project Data....</div>
            )}
            {projectsList.map((project) => (
              <tr key={project._id}>
                <td>
                  <Link to={`/project/${project._id}`}>
                    {project.projectName}
                  </Link>
                </td>
                <td>{project.projectDescription}</td>
                <td>{project.numberOfVMs}</td>
                <td>{project.totalBill} $</td>
                <td>
                  {project.projectStatus == "running" && (
                    <p className="running status">{project.projectStatus}</p>
                  )}
                  {project.projectStatus == "stopped" && (
                    <p className="stopped status">{project.projectStatus}</p>
                  )}
                  {project.projectStatus == "close" && (
                    <p className="close status">{project.projectStatus}</p>
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
