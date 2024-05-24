import React, { useState } from "react";

import logo from "../assets/platform_logo.png";
import searchIcon from "../assets/icons_search.png";
import avatar from "../assets/sample_avatar.png";
import notiIcon from "../assets/noti_icon.png";
import nonNotiIcon from "../assets/non_noti_icon.png";
import { useAuth } from "../contexts/authContext/index";
import "./style.scss";
import { Link } from "react-router-dom";
const TopPage = () => {
  const [notification, setNotification] = useState(true);
  // const { currentUser } = useAuth();
  // console.log(currentUser);
  const { currentUserData } = useAuth();
  // console.log("currentUserData at top page:", currentUserData);

  const userInfo = {
    username: "test1",
    email: "test1@gmail.com",
    linkAvatar: null,
    role: "Admin",
  };
  return (
    <div className="topPage">
      <Link to="/">
      <img src={logo} alt="logo" />
      </Link>
      <div className="searchBar">
        <img src={searchIcon} alt="search" />
        <input type="text" placeholder="Search..." />
      </div>
      <div className="groupUserNoti">
        <div className="userInfo">
          <img
            src={userInfo.linkAvatar ? userInfo.linkAvatar : avatar}
            alt="userAvatar"
          />
          <div className="basicInfo">
            <p
              className="userName"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title={currentUserData ? currentUserData.email : null}
            >
              {currentUserData ? currentUserData.username : null}
            </p>

            <p className="role">{userInfo.role}</p>
          </div>
        </div>
        <div className="notification">
          <img
            src={notification ? notiIcon : nonNotiIcon}
            alt="notification"
            onClick={() => setNotification(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default TopPage;
