import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import "./style.scss";
import TopPage from "../components/TopPage";
import SideBarCloudProjectDashboard from "../components/SideBarCloudProjectDashboard";
import OverviewProject from "../components/OverviewCloudProject";
import Setting from "../components/subPage/Setting";

const CloudProjectDashboard = () => {
  const { cloudProjectId } = useParams();

  const [loading, setLoading] = useState(false);
  const [cloudProject, setCloudProject] = useState({});
  const [listInstances, setListInstances] = useState([]);
  const [billing, setBilling] = useState([]);
  const [menuChoose, setMenuChoose] = useState("Overview");

  const fetchData = async () => {
    setLoading(true);
    try {
      const cloudProjectResponse = await axios.get(
        `http://localhost:3000/cloudProject/${cloudProjectId}`
      );
      const cloudProjectData = cloudProjectResponse.data;
      setCloudProject(cloudProjectData);

      const clusterResponse = await axios.patch(
        `http://localhost:3000/cluster/cloudProject/`,
        {
          cloudProjectID: cloudProjectData.id,
        }
      );
      setListInstances(clusterResponse.data);

      const billingResponse = await axios.patch(
        `http://localhost:3000/costs/cloudProject/`,
        {
          cloudProjectID: cloudProjectData.id,
        }
      );

      setBilling(billingResponse.data);
      console.log("billing", billingResponse.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [cloudProjectId]);

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

  return (
    <div className="homePage">
      <TopPage />
      <div className="midPage">
        <SideBarCloudProjectDashboard
          setMenuChoose={setMenuChoose}
          cloudProject={cloudProject}
        />
        <div className="midPageContent">
          {menuChoose === "Overview" && (
            <OverviewProject
              cloudProject={cloudProject}
              listInstances={listInstances}
              billing={billing}
              setMenuChoose={setMenuChoose}
            />
          )}
          {menuChoose === "Setting" && (
            <Setting
              type="cloudProject"
              cloudProject={cloudProject}
              listInstances={listInstances}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudProjectDashboard;
