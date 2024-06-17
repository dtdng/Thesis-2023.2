import React from "react";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import { useAuth } from "../../contexts/authContext/index";
import "../style.scss";
import axios from "axios";

import addProjectIcon from "../../assets/add-project.svg";
import refreshIcon from "../../assets/refresh.svg";
import CreateProjectForm from "../form/CreateProjectForm";

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
    <div className="projectListPage overflow-auto shadow">
      <div className="projectHeader">
        <h3 className="text-2xl font-bold ">Project List</h3>
        <CreateProjectForm
          trigger={buttonPopup}
          setTrigger={setButtonPopup}
        ></CreateProjectForm>
        <div className="m-0 row-direction">
          <button
            type="button"
            onClick={handleRefreshButton}
            className="refresh-btn"
          >
            <img src={refreshIcon} alt="refresh" />
          </button>
          <button
            type="button"
            onClick={handleAddProjectButton}
            className="row-direction"
          >
            <img src={addProjectIcon} alt="add project" />
            Add Project
          </button>
        </div>
      </div>
      <div className="projectListTable">
        <table className="mt-4 w-full " hover size="sm">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Project Name
              </th>
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Project Description
              </th>
              {/* <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Number of VMs
              </th>
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Billing
              </th> */}
              <th className="p-3 font-semibold tracking-wide text-left whitespace-nowrap">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {loading == false && (
              <div className="loading">Loading List Project Data....</div>
            )}
            {projectsList.map((project) => (
              <tr key={project._id} className="hover:bg-slate-100">
                <td className="pl-3 text-blue-500 hover:underline whitespace-nowrap">
                  <Link to={`/project/${project._id}`}>
                    {project.projectName}
                  </Link>
                </td>
                <td className="pl-3 text-gray-700 whitespace-nowrap">
                  {project.projectDescription}
                </td>
                {/* <td className="pl-3 text-gray-700 whitespace-nowrap">
                  {project.numberOfVMs}
                </td>
                <td className="pl-3 text-gray-700 whitespace-nowrap">
                  {project.totalBill} $
                </td> */}
                <td className="pl-3whitespace-nowrap">
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
        </table>
      </div>
    </div>
  );
};

export default ProjectsList;
