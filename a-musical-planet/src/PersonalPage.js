import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import MapData from "./MapData.json";

const PersonalPage = () => {
  const { userName } = useParams();

  const [userData, setUserData] = useState(null);

  const [chosenMap, setChosenMap] = useState("overall");

  useEffect(() => {
    axios(`http://localhost:8888/userData/${userName}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    }).then(({ data }) => setUserData(data));
  }, []);

  return (
    <div>
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
        <option key="overall" value="overall">
          Overall
        </option>
        {MapData.map((map) => (
          <option key={map.name} value={map.name}>
            {map.name}
          </option>
        ))}
      </select>
      {userData ? (
        <div>
          <img src={userData.profilePicture} alt="User" />
          <h3>{userData.displayName}</h3>
          <div>
            <h3>
              {userData.stats.completedGames[chosenMap]
                ? userData.stats.completedGames[chosenMap]
                : 0}
            </h3>
            <p>Completed Games</p>
          </div>
          <div>
            <h3>
              {chosenMap === "overall"
                ? userData.stats.maxScores[chosenMap]
                  ? `${userData.stats.maxScores[chosenMap].score} (${userData.stats.maxScores[chosenMap].map})`
                  : 0
                : userData.stats.maxScores[chosenMap]
                ? userData.stats.maxScores[chosenMap]
                : 0}
            </h3>
            <p>Best Game</p>
          </div>
          <div>
            <h3>
              {userData.stats.averageScores[chosenMap]
                ? userData.stats.averageScores[chosenMap]
                : 0}
            </h3>
            <p>Average Game</p>
          </div>
        </div>
      ) : (
        <h3>LOADING...</h3>
      )}
    </div>
  );
};

export default PersonalPage;
