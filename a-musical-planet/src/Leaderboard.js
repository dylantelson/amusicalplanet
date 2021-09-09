import React, { useState, useEffect } from "react";
import axios from "axios";
import MapData from "./MapData.json";
import LeaderboardUser from "./LeaderboardUser";
import "./Leaderboard.scss";

const Leaderboard = () => {
  const [leaderboardStats, setLeaderboardStats] = useState([]);
  const [chosenMap, setChosenMap] = useState("worldEasy");
  const [currPage, setCurrPage] = useState(0);

  useEffect(() => {
    axios(`${process.env.REACT_APP_BACKEND_URI}/getLeaderboard`, {
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
        <img
          src="/next.png"
          id="leftArrow"
          className={currPage <= 0 ? "disabledArrow" : ""}
          onClick={() => (currPage > 0 ? setCurrPage(currPage - 1) : null)}
        />
        <div className="leaderboardUsers">
          {leaderboardStats[chosenMap] ? (
            leaderboardStats[chosenMap]
              .slice(currPage * 5, currPage * 5 + 5)
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
            <h3>LOADING...</h3>
          )}
        </div>
        <img
          src="/next.png"
          id="rightArrow"
          className={currPage >= 4 ? "disabledArrow" : ""}
          onClick={() => (currPage < 4 ? setCurrPage(currPage + 1) : null)}
        />
      </div>
    </div>
  );
};

export default Leaderboard;
