import React from "react";

const LeaderboardUser = ({ userData, map }) => {
  console.log(userData);
  return (
    <div className="leaderboardUser">
      <p>{userData.displayName}</p>
      <p>{`Score: ${userData.maxScores[map]}`}</p>
    </div>
  );
};

export default LeaderboardUser;
