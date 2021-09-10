import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { UserContext } from "./App.js";
import "./Header.scss";

const Header = () => {
  const userData = useContext(UserContext);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  let menu = document.getElementById("menu");

  const openMenu = () => {
    if (!menu) menu = document.getElementById("menu");
    console.log("openin!");
    if (hamburgerOpen) {
      menu.style.display = "none";
    } else {
      menu.style.display = "flex";
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
