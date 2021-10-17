import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./App.js";
import RecordPlayer from "./RecordPlayer.js";

const MapItem = ({ map, handleMapChosen }) => {
  const userData = useContext(UserContext);
  let isHovering = false;

  const formattedMapName =
    map.name[0].toLowerCase() + map.name.slice(1).replace(/ /g, "");


    const playRecord = () => {
      document.querySelector(`#${formattedMapName}Arm`).classList.add("playing");
      setTimeout(() => isHovering ? document.querySelector(`#${formattedMapName}MapDisc`).classList.add("playing") : null, 250);
      isHovering = true;
      // document.querySelector(`#${formattedMapName}MapDisc`).classList.add("playing");
    }
  
    const stopRecord = () => {
      document.querySelector(`#${formattedMapName}Arm`).classList.remove("playing");
      document.querySelector(`#${formattedMapName}MapDisc`).classList.remove("playing");
      isHovering = false;
      // document.querySelector(`#${formattedMapName}MapDisc`).style.animationPlayState='paused';
    }

  const maxScore =
    userData &&
    userData.stats &&
    userData.stats.maxScores &&
    userData.stats.maxScores[formattedMapName]
      ? userData.stats.maxScores[formattedMapName]
      : 0;
  return (
    <div className="MapItem" onMouseEnter={playRecord} onMouseLeave={stopRecord}>
      {/* <img src={"/mapimages/" + formattedMapName + ".png"} alt={map.name} /> */}
      <RecordPlayer map={formattedMapName} />
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
