import React from "react";
import { Link } from "react-router-dom";

const LeaderboardUser = ({ userData, map, rank }) => {
  return (
    <div className="leaderboardUser">
      <h1 className="rank">{rank}</h1>
      <img src={userData.profilePicture !== "NONE" ? userData.profilePicture : "/defaultavatar.png"} alt="User" onError={e => {e.target.onerror = null; e.target.src="/defaultavatar.png"}} />
      <div className="names">
        <Link to={`/user/${userData.userName}`}>{userData.displayName}</Link>
      </div>
      <div className="highScore">
        <h1>{userData.stats.maxScores[map] ? userData.stats.maxScores[map] : 0}</h1>
        <p>Score</p>
      </div>
    </div>
  );
};

export default LeaderboardUser;
