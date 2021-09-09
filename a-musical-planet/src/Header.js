import React, { useContext, useState } from "react";
import { BrowserRouter as Router, NavLink } from "react-router-dom";

import { UserContext } from "./App.js";
import "./Header.scss";

const Header = ({ setRedirect, checkToken }) => {
  const userData = useContext(UserContext);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const menu = document.getElementById("menu");
  console.log("Checking if I should check token");
  if (
    !(window.location.pathname === "/") &&
    userData &&
    userData.userName === ""
  ) {
    checkToken();
  }

  const openMenu = () => {
    console.log("openin!");
    if (hamburgerOpen) {
      menu.style.left = "100vw";
      menu.style.visibility = "hidden";
    } else {
      menu.style.left = "0px";
      menu.style.visibility = "visible";
    }
    setHamburgerOpen(!hamburgerOpen);
  };

  return (
    <>
      <div className="header">
        <div className="logo">
          <h1>A Musical Planet</h1>
        </div>
        <div
          className={"hamburger" + (hamburgerOpen ? " open" : "")}
          onClick={openMenu}
        >
          <span></span>
          <span></span>
          <span></span>
          <span></span>
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
          {userData && userData.displayName ? (
            <NavLink className="userLink" to={`/user/${userData.userName}`}>
              <img src={userData.profilePicture} alt="" />
            </NavLink>
          ) : (
            <></>
          )}
        </div>
      </div>
      <ul
        id="menu"
        className={!hamburgerOpen ? " hidden" : ""}
        onClick={openMenu}
      >
        <NavLink
          className="linkButton"
          to="/maps"
          activeStyle={{ backgroundColor: "#333", color: "#fff" }}
        >
          Maps
        </NavLink>
        <NavLink
          className="linkButton"
          to="/about"
          activeStyle={{ backgroundColor: "#333", color: "#fff" }}
        >
          About
        </NavLink>
        <NavLink
          className="linkButton"
          to="/leaderboard"
          activeStyle={{ backgroundColor: "#333", color: "#fff" }}
        >
          Leaderboard
        </NavLink>
        {userData && userData.displayName ? (
          <NavLink
            className="linkButton"
            to={`/user/${userData.userName}`}
            activeStyle={{ backgroundColor: "#333", color: "#fff" }}
          >
            {userData.displayName}
          </NavLink>
        ) : (
          <></>
        )}
      </ul>
    </>
  );
};

export default Header;
