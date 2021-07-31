import React from "react";

import "./Header.css";

const Header = ({ userData }) => {
  console.log("Rendering Header");
  return (
    <>
      <div className="header">
        <div className="logo">
          <h1>A Musical Planet</h1>
        </div>
        <div className="navbar">
          <button>Home</button>
          <button>About</button>
          <button>Leaderboard</button>
          {userData.username ? <button>{userData.username}</button> : <></>}
        </div>
      </div>
    </>
  );
};

export default Header;
