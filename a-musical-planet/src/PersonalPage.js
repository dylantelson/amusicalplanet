import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import "./PersonalPage.scss";

import MapData from "./MapData.json";
import { UserContext } from "./App.js";

const PersonalPage = ({ handleLogout, setShowGlobe }) => {
  const loggedInUser = useContext(UserContext);
  const { userName } = useParams();

  const [userData, setUserData] = useState(null);

  const [chosenMap, setChosenMap] = useState("overall");

  useEffect(() => {
    setChosenMap("overall");
    axios(`${process.env.REACT_APP_BACKEND_URI}/userData/${userName}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    }).then(({ data }) => setUserData(data));
  }, [userName]);

  useEffect(() => {
    setShowGlobe(true);
  }, []);

  return (
    <div className="userPageContainer">
      {userData ? (
        <div className="userPage">
          <div className="userHead">
            <img
              src={
                userData.profilePicture !== "NONE"
                  ? userData.profilePicture
                  : "/defaultavatar.png"
              }
              alt="User"
              onError={e => {
                e.target.onerror = null;
                e.target.src="/defaultavatar.png";
              }}
            />
            <div className="userName">
              <h1>{userData.displayName}</h1>
              <img
                src={
                  "/flags/" +
                  (userData.country.length === 2
                    ? userData.country.toLowerCase()
                    : userData.country.substring(0, 2).toLowerCase()) +
                  ".svg"
                }
                alt=""
              />
            </div>
          </div>
          <div className="stats">
            <div className="statsHead">
              <h2>Game Statistics</h2>
              <select
                id="maplist"
                value={chosenMap}
                onChange={(e) => {
                  setChosenMap(e.target.value);
                }}
              >
                <option key="overall" value="overall">
                  Overall
                </option>
                {MapData.map((map) => (
                  <option
                    key={map.name}
                    value={
                      map.name[0].toLowerCase() +
                      map.name.slice(1).replace(/ /g, "")
                    }
                  >
                    {map.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="statsBody">
              <div>
                <p>Completed Games</p>
                <h3>
                  {userData.stats.completedGames[chosenMap]
                    ? userData.stats.completedGames[chosenMap]
                    : 0}
                </h3>
              </div>
              <div className={chosenMap === "overall" ? "bestOverall" : ""}>
                <p>Best Game</p>
                {chosenMap === "overall" ? (
                  <h3 className="overallMaxScore">
                    {userData.stats.maxScores.overall.score &&
                    userData.stats.maxScores.overall.score !== 0
                      ? `${userData.stats.maxScores.overall.score} \n (${
                          userData.stats.maxScores.overall.map[0].toUpperCase() +
                          userData.stats.maxScores.overall.map
                            .slice(1)
                            .replace(/[A-Z]/, (letter) => " " + letter)
                        })`
                      : 0}
                  </h3>
                ) : (
                  <h3>
                    {userData.stats.maxScores[chosenMap]
                      ? userData.stats.maxScores[chosenMap]
                      : 0}
                  </h3>
                )}
              </div>
              <div>
                <p>Average Game</p>
                <h3>
                  {userData.stats.averageScores[chosenMap]
                    ? userData.stats.averageScores[chosenMap]
                    : 0}
                </h3>
              </div>
            </div>
          </div>
          {loggedInUser.userName === userName ? (
            <button type="submit" id="logoutButton" onClick={handleLogout}>
              <img id="spotifyIcon" src="/spotifyIcon.png" alt="Spotify icon" />
              Log Out
            </button>
          ) : null}
        </div>
      ) : (
        <h3>LOADING...</h3>
      )}
    </div>
  );
};

export default PersonalPage;
