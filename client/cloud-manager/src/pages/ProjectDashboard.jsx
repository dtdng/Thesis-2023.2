import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./style.scss";
import TopPage from "../components/TopPage";
import SideBarProjectDashboard from "../components/SideBarProjectDashboard";
import axios from "axios";
import Overview from "../components/subPage/Overview";
import ListInstances from "../components/subPage/ListInstances";
import Billing from "../components/subPage/Billing";
import ListCloudProject from "../components/subPage/ListCloudProject";
import { ClipLoader } from "react-spinners";
import Setting from "../components/subPage/Setting";
import Reviews from "../components/subPage/Reviews";

const ProjectDashboard = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuChoose, setMenuChoose] = useState("Overview");

  const fetchData = async () => {
    try {
      const projectResponse = await axios.get(
        `http://localhost:3000/project/${projectId}`
      );
      setProject(projectResponse.data); // Set project state with project data
      setLoading(false); // Set loading state to false
    } catch (error) {
      console.error("Error fetching project data:", error);
      setError(error.message); // Set error state
      setLoading(false); // Set loading state to false
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  if (loading) {
    return (
      <ClipLoader
        loading={loading}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );
  }

  if (error) {
    return <div>Error: {error}</div>; // Render error message
  }

  return (
    <div className="homePage">
      <TopPage />
      <div className="midPage">
        <SideBarProjectDashboard
          project={project}
          setMenuChoose={setMenuChoose}
        />
        <div className="midPageContent">
          {menuChoose == "Overview" && <Overview project={project} />}
          {menuChoose == "Resources" && <ListInstances project={project} />}
          {menuChoose == "Cloud Applications" && (
            <ListCloudProject project={project} />
          )}
          {menuChoose == "Billing" && <Billing project={project} />}
          {menuChoose == "Setting" && (
            <Setting type="project" project={project} />
          )}
          {menuChoose == "Reviews" && <Reviews project={project} />}
          {menuChoose == "Setting" && <Setting type="project" project={project} />}

        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
