import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./style.scss";
import TopPage from "../components/TopPage";
import SideBarInstanceDashboard from "../components/SideBarInstanceDashboard";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import OverviewInstance from "../components/OverviewInstance";
import Setting from "../components/subPage/Setting";

const InstanceDashboard = () => {
  const { instanceId } = useParams();
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [menuChoose, setMenuChoose] = useState("Overview");

  const fetchInstanceData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/cluster/${instanceId}`
      );
      setInstance(response.data);
      console.log("response", response.data);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInstanceData();
  }, []);

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
        <SideBarInstanceDashboard
          setMenuChoose={setMenuChoose}
          instance={instance}
        />
        <div className="midPageContent">
          {menuChoose === "Overview" && (
            <OverviewInstance instance={instance} />
          )}
          {menuChoose === "Setting" && <Setting type="instance" />}
        </div>
      </div>
    </div>
  );
};

export default InstanceDashboard;
