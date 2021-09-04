import React, { useContext } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { UserContext } from "./App.js";

const MapItem = ({ map, handleMapChosen }) => {
  const userData = useContext(UserContext);

  const formattedMapName =
    map.name[0].toLowerCase() + map.name.slice(1).replaceAll(" ", "");
  const maxScore =
    userData &&
    userData.stats &&
    userData.stats.maxScores &&
    userData.stats.maxScores[formattedMapName]
      ? userData.stats.maxScores[formattedMapName]
      : 0;
  return (
    <div className="MapItem">
      <img src={"/mapimages/" + map.image} alt={map.name} />
      <h1>{map.name}</h1>
      <p>{map.description}</p>
      <p>{`Max Score: ${maxScore}`}</p>
      <Link to="/play" onClick={() => handleMapChosen(map.name)} replace>
        Play
      </Link>
    </div>
  );
};

export default MapItem;
