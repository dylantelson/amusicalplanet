import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";

const LeaderboardUser = ({ userData, map, rank }) => {
  return (
    <div className="leaderboardUser">
      <h1 className="rank">{rank}</h1>
      <img src={userData.profilePicture} alt="User" />
      <div className="names">
        <Link to={`/user/${userData.userName}`}>{userData.displayName}</Link>
        <p>{userData.userName}</p>
      </div>
      <div className="highScore">
        <p>Score</p>
        <h3>{userData.maxScores[map]}</h3>
      </div>
    </div>
  );
};

export default LeaderboardUser;
