import React from "react";
import "./style.scss";
import SideBarOption from "./sideBarOption";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import logout from "../assets/logout.svg";

const SideBar = () => {
  return (
    <div className="SideBar">
      <SideBarOption text="Dashboard" />
      <div>
        <SideBarOption text="Profile" />
        <SideBarOption text="Setting" />
        <button
          onClick={() => {
            signOut(auth);
          }}
        >
          <img src={logout} alt="" srcset="" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideBar;
