import React from "react";
import { Link } from "react-router-dom";

const LeaderboardUser = ({ userData, map, rank }) => {
  return (
    <div className="leaderboardUser">
      <h1 className="rank">{rank}</h1>
      <img src={userData.profilePicture !== "NONE" ? userData.profilePicture : "/defaultavatar.png"} alt="User" />
      <div className="names">
        <Link to={`/user/${userData.userName}`}>{userData.displayName}</Link>
        <p>{userData.userName}</p>
      </div>
      <div className="highScore">
        <p>Score</p>
        <h3>{userData.stats.maxScores[map] ? userData.stats.maxScores[map] : 0}</h3>
      </div>
    </div>
  );
};

export default LeaderboardUser;
