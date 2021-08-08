import React from "react";
import MapItem from "./MapItem";
import "./ChooseMap.css";
import MapData from "./MapData.json";

const ChooseMap = ({ handleMapChosen }) => {
  return (
    <div className="ChooseMapContainer">
      <div className="MapHead">
        <h1>Official Maps</h1>
      </div>
      <div className="MapItems">
        {MapData.map((currMap) => (
          <MapItem
            key={currMap.name}
            map={currMap}
            handleMapChosen={handleMapChosen}
          />
        ))}
      </div>
    </div>
  );
};

export default ChooseMap;
