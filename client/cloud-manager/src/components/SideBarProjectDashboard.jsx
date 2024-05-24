import React from "react";
import { useState, useEffect, useContext } from "react";
import SideBarOption from "./SideBarOption";

import "./style.scss";

const SideBarProjectDashboard = ({ project, setMenuChoose }) => {
  return (
    <div className="SideBar">
      <div>
        {project && (
          <div className="projectName">
            <p>{project.projectName}</p>
          </div>
        )}
        <SideBarOption text="Overview" setMenuChoose={setMenuChoose}/>
        <SideBarOption text="Instances" setMenuChoose={setMenuChoose}/>
        <SideBarOption text="Billing" setMenuChoose={setMenuChoose}/>
        <SideBarOption text="Setting" setMenuChoose={setMenuChoose}/>
      </div>
    </div>
  );
};

export default SideBarProjectDashboard;
