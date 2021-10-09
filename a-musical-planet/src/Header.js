import React, { useContext, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

import { UserContext } from "./App.js";
import "./Header.scss";

const Header = () => {
  const userData = useContext(UserContext);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  let menu = document.getElementById("menu");

  const location = useLocation();

  const openMenu = () => {
    if (!menu) menu = document.getElementById("menu");
    if (hamburgerOpen) {
      menu.style.visibility = "hidden";
      menu.style.opacity = "0";
    } else {
      menu.style.visibility = "visible";
      menu.style.opacity = "1";
    }
    setHamburgerOpen(!hamburgerOpen);
  };

  // if (location.pathname === "/") return null;
  return (
    <>
      <div className="header">
        <Link id="logoDesktop" to="/">
          A Musical Planet
        </Link>
        <Link id="logoMobile" to="/">
          AMP
        </Link>
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
            activeStyle={{ color: "#0081AF" }}
          >
            Maps
            {location.pathname === "/maps" ? (
              <div className="activeUnderline"></div>
            ) : null}
          </NavLink>
          <NavLink
            className="linkButton"
            to="/about"
            activeStyle={{ color: "#0081AF" }}
          >
            About
            {location.pathname === "/about" ? (
              <div className="activeUnderline"></div>
            ) : null}
          </NavLink>
          <NavLink
            className="linkButton"
            to="/leaderboard"
            activeStyle={{ color: "#0081AF" }}
          >
            Leaderboard
            {location.pathname === "/leaderboard" ? (
              <div className="activeUnderline"></div>
            ) : null}
          </NavLink>
          {userData && userData.displayName ? (
            <NavLink className="userLink" to={`/user/${userData.userName}`}>
              <img
                src={
                  userData.profilePicture !== "NONE"
                    ? userData.profilePicture
                    : "/defaultavatar.png"
                }
                alt=""
                onError={e => {
                  e.target.onerror = null;
                  e.target.src="/defaultavatar.png";
                }}
              />
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
