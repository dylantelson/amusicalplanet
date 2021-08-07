import React, { useContext } from "react";
import { BrowserRouter as Router, NavLink } from "react-router-dom";

import { UserContext } from "./App.js";
import "./Header.css";

const Header = ({ setRedirect, checkToken }) => {
  const userData = useContext(UserContext);
  if (userData.userName === "") {
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
          {userData.displayName ? (
            <NavLink
              className="linkButton"
              to="/userplaceholder"
              activeStyle={{ backgroundColor: "white" }}
            >
              {userData.displayName}
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
