import React, { useState, useEffect } from "react";
import axios from "axios";
import MapData from "./MapData.json";
import LeaderboardUser from "./LeaderboardUser";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [leaderboardStats, setLeaderboardStats] = useState([]);
  const [chosenMap, setChosenMap] = useState("world");

  useEffect(() => {
    axios(`http://localhost:8888/getLeaderboard`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    }).then((leaderboardData) => {
      console.log("LEADERBOARD:");
      console.log(leaderboardData);
      setLeaderboardStats(leaderboardData.data);
    });
  }, []);

  return (
    <div>
      <div className="leaderboardHead">
        <h1>LEADERBOARD</h1>
        <select
          id="maplist"
          onChange={(e) => {
            console.log(
              "Changing value to",
              e.target.value.toLowerCase().replace(" ", "")
            );
            setChosenMap(e.target.value.toLowerCase().replace(" ", ""));
          }}
        >
          {MapData.map((map) => (
            <option key={map.name} value={map.name}>
              {map.name}
            </option>
          ))}
        </select>
      </div>
      <div className="leaderboard">
        {leaderboardStats[chosenMap] ? (
          leaderboardStats[chosenMap].map((userData) => (
            <LeaderboardUser
              key={userData.userName + chosenMap}
              userData={userData}
              map={chosenMap}
            />
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
