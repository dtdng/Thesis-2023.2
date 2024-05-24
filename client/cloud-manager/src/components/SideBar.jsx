import React from "react";
import "./style.scss";
import SideBarOption from "./SideBarOption";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import logout from "../assets/logout.svg";

const SideBar = ({ setMenuChoose }) => {
  return (
    <div className="SideBar">
      <SideBarOption text="Dashboard" setMenuChoose={setMenuChoose} />
      <div>
        <SideBarOption text="Profile" setMenuChoose={setMenuChoose} />
        <SideBarOption text="Setting" setMenuChoose={setMenuChoose} />
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
