import React from "react";
import { BrowserRouter as Router, NavLink } from "react-router-dom";

import "./Header.css";

const Header = ({ userData, setRedirect, checkToken }) => {
  if (userData.username === "") {
    checkToken();
  }
  return (
    <>
      <div className="header">
        <div className="logo">
          <h1>A Musical Planet</h1>
        </div>
        <div className="navbar">
          <NavLink
            className="linkButton"
            to="/maps"
            activeStyle={{ backgroundColor: "white" }}
          >
            Maps
          </NavLink>
          <NavLink
            className="linkButton"
            to="/about"
            activeStyle={{ backgroundColor: "white" }}
          >
            About
          </NavLink>
          <NavLink
            className="linkButton"
            to="/leaderboard"
            activeStyle={{ backgroundColor: "white" }}
          >
            Leaderboard
          </NavLink>
          {userData.username ? (
            <NavLink
              className="linkButton"
              to="/userplaceholder"
              activeStyle={{ backgroundColor: "white" }}
            >
              {userData.username}
            </NavLink>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
