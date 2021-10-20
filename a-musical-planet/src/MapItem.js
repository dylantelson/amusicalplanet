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
      document.querySelectorAll(`#${formattedMapName}Arm`).forEach(arm => arm.classList.add("playing"));
      setTimeout(() => isHovering ? document.querySelectorAll(`#${formattedMapName}MapDisc`).forEach(disc => disc.classList.add("playing")) : null, 250);
      isHovering = true;
      // document.querySelector(`#${formattedMapName}MapDisc`).classList.add("playing");
    }
  
    const stopRecord = () => {
      document.querySelectorAll(`#${formattedMapName}Arm`).forEach(arm => arm.classList.remove("playing"));
      document.querySelectorAll(`#${formattedMapName}MapDisc`).forEach(disc => disc.classList.remove("playing"));
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
      {map.name === "World Easy" ? <div id="beginnerDiv"><p id="beginnerText">beginners start here!</p></div> : null}
      {/* <img src={"/mapimages/" + formattedMapName + ".png"} alt={map.name} /> */}
      <RecordPlayer map={formattedMapName} />
      <h1>{map.name}</h1>
      {map.difficultyCaption ? <h2 style={{ color: map.color }}>{map.difficultyCaption}</h2> : null}
      <p>{map.description}</p>
      <div id="scoreDiv">
        <h1 style={{ color: map.color }}>{maxScore}</h1>
        <p>Your Max Score</p>
      </div>
      <Link to="/play" style={{ backgroundColor: map.color }} onClick={() => handleMapChosen(map.name)} replace>
        Play
      </Link>
    </div>
  );
};

export default MapItem;
