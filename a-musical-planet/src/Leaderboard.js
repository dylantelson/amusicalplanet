import React, { useState, useEffect } from "react";
import axios from "axios";
import MapData from "./MapData.json";
import LeaderboardUser from "./LeaderboardUser";
import "./Leaderboard.scss";

const Leaderboard = ({ setShowGlobe }) => {
  const [leaderboardStats, setLeaderboardStats] = useState([]);
  const [chosenMap, setChosenMap] = useState("worldEasy");
  const [currPage, setCurrPage] = useState(0);

  useEffect(() => {
    setShowGlobe(true);
    
    //get leaderboard data from the server
    axios(`${process.env.REACT_APP_BACKEND_URI}/getLeaderboard`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    }).then((leaderboardData) => {
      setLeaderboardStats(leaderboardData.data);
    });
  }, []);

  return (
    <div className="leaderboardContainer">
      <div className="leaderboardHead">
        <h1>Leaderboard</h1>
        <select
          id="maplist"
          onChange={(e) => {
            setChosenMap(
              e.target.value[0].toLowerCase() +
                e.target.value.slice(1).replace(/ /g, "")
            );
            setCurrPage(0);
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
        <div className="leaderboardUsers">
          {leaderboardStats[chosenMap] ? (
            leaderboardStats[chosenMap]
              .map((userData, rank) => (
                <LeaderboardUser
                  key={
                    userData.userName + chosenMap + (currPage * 5 + rank + 1)
                  }
                  rank={currPage * 5 + rank + 1}
                  userData={userData}
                  map={chosenMap}
                />
              ))
          ) : (
            <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
