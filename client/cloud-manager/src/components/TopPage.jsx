import React, { useState } from "react";

import logo from "../assets/platform_logo.png";
import searchIcon from "../assets/icons_search.png";
import avatar from "../assets/sample_avatar.png";
import notiIcon from "../assets/noti_icon.png";
import nonNotiIcon from "../assets/non_noti_icon.png";
import "./style.scss";
const TopPage = () => {
  const [notification, setNotification] = useState(true);
  const userInfo = {
    userName: "test1",
    email: "test1@gmail.com",
    linkAvatar: null,
    role: "Admin",
  };
  return (
    <div className="topPage">
      <img src={logo} alt="logo" />
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
            <p className="userName">{userInfo.userName}</p>
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
