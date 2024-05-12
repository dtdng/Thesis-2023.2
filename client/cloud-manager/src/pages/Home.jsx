import React from "react";
import { useState, useEffect, useContext } from "react";
import TopPage from "../components/TopPage";
import SideBar from "../components/SideBar";
import ProjectsList from "../components/projectsList";
import Profile from "../components/Profile";
import Setting from "../components/Setting";
import "./style.scss";

const Home = () => {
  const [menuChoose, setMenuChoose] = useState("Dashboard");

  return (
    <div className="homePage">
      <TopPage />
      <div className="midPage">
        <SideBar />
        <div className="midPageContent">
          {menuChoose == "Dashboard" && <ProjectsList />}
          {menuChoose == "Profile" && <Profile />}
          {menuChoose == "Setting" && <Setting />}
        </div>
      </div>
    </div>
  );
};

export default Home;
