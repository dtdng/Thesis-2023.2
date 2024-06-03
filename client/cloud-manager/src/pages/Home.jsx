import React from "react";
import { useState, useEffect, useContext } from "react";
import TopPage from "../components/TopPage";
import SideBar from "../components/SideBar";
import ProjectsList from "../components/subPage/projectsList";
import Profile from "../components/subPage/Profile";
import Setting from "../components/subPage/Setting";
import "./style.scss";

const Home = () => {
  const [menuChoose, setMenuChoose] = useState("Dashboard");

  return (
    <div className="homePage">
      <TopPage />
      <div className="midPage">
        <SideBar setMenuChoose={setMenuChoose} />
        <div className="midPageContent">
          {menuChoose == "Dashboard" && <ProjectsList />}
          {menuChoose == "Profile" && <Profile />}
          {menuChoose == "Setting" && <Setting type="account" />}
        </div>
      </div>
    </div>
  );
};

export default Home;
