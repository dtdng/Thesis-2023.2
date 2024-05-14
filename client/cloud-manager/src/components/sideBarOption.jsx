import React from "react";
import profileIcon from "../assets/profile.svg";
import dashboardIcon from "../assets/dashboard.svg";
import settingIcon from "../assets/setting.svg";
import graphIcon from "../assets/graph.svg";
import "./style.scss";

const SideBarOption = ({ text }) => {
  return (
    <div className="sideBarOption">
      {(text === "Dashboard" || text == "Overview") && (
        <img src={dashboardIcon} alt="dashboard" />
      )}
      {text === "Profile" && <img src={profileIcon} alt="profile" />}
      {text === "Setting" && <img src={settingIcon} alt="setting" />}
      {text === "Billing" && <img src={graphIcon} alt="billing" />}
      <p>{text}</p>
    </div>
  );
};

export default SideBarOption;
