import React from "react";
import { useState, useEffect, useContext } from "react";
import SideBarOption from "./SideBarOption";

import "./style.scss";

const SideBarInstanceDashboard = ({ instance, setMenuChoose }) => {
  return (
    <div className="SideBar">
      <div>
        {instance && (
          <div className="instanceName">
            <p>{}</p>
            <p>{instance.name}/</p>
          </div>
        )}
        <SideBarOption text="Overview" setMenuChoose={setMenuChoose} />
      </div>
    </div>
  );
};

export default SideBarInstanceDashboard;
