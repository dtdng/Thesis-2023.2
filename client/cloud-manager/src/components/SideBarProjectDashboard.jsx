import React from "react";
import { useState, useEffect, useContext } from "react";
import SideBarOption from "./SideBarOption";

import "./style.scss";

const SideBarProjectDashboard = ({ project }) => {
  return (
    <div className="SideBar">
      <div>
        {project && (
          <div className="projectName">
            <p>{project.projectName}</p>
          </div>
        )}
        <SideBarOption text="Overview" />
        <SideBarOption text="Billing" />
        <SideBarOption text="Setting" />
      </div>
    </div>
  );
};

export default SideBarProjectDashboard;
