import React from "react";
import profileIcon from "../assets/profile.svg";
import dashboardIcon from "../assets/dashboard.svg";
import settingIcon from "../assets/setting.svg";
import graphIcon from "../assets/graph.svg";
import listIcon from "../assets/list.svg";
import projectIcon from "../assets/project.svg";
import "./style.scss";

const SideBarOption = ({ text, setMenuChoose }) => {
  const handleClick = () => {
    setMenuChoose(text);
  };

  return (
    <div className="sideBarOption" onClick={handleClick}>
      {(text === "Dashboard" || text == "Overview") && (
        <img src={dashboardIcon} alt="dashboard" />
      )}
      {text === "Profile" && <img src={profileIcon} alt="profile" />}
      {text === "Setting" && <img src={settingIcon} alt="setting" />}
      {text === "Billing" && <img src={graphIcon} alt="billing" />}
      {text === "Resources" && <img src={listIcon} alt="resources" />}
      {text === "Cloud Projects" && (
        <img src={projectIcon} alt="cloud projects" />
      )}
      <p>{text}</p>
    </div>
  );
};

export default SideBarOption;
