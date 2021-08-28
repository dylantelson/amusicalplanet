import React, { useState } from "react";
import MapItem from "./MapItem";
import "./ChooseMap.scss";
import MapData from "./MapData.json";

const ChooseMap = ({ handleMapChosen }) => {
  const [chosenMap, setChosenMap] = useState("World");
  const [chosenMapCategory, setChosenMapCategory] = useState("World");
  const chosenMapData = MapData.find((map) => map.name === chosenMap);

  const mapCategories = ["World", "Continent", "Other"];

  return (
    <div className="ChooseMapContainer">
      <div className="MapHead">
        <h1>Official Maps</h1>
      </div>
      <div className="MapBodyDesktop">
        <select
          id="maplistDesktop"
          onChange={(e) => {
            setChosenMapCategory(e.target.value);
          }}
        >
          {mapCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div className="MapItemsDesktop">
          {MapData.map((currMap) =>
            currMap.category === chosenMapCategory ? (
              <MapItem
                key={currMap.name}
                map={currMap}
                handleMapChosen={handleMapChosen}
              />
            ) : (
              <></>
            )
          )}
        </div>
      </div>
      <div className="MapItemsMobile">
        <select
          id="maplistMobile"
          onChange={(e) => {
            setChosenMap(e.target.value);
          }}
        >
          {MapData.map((map) => (
            <option key={map.name} value={map.name}>
              {map.name}
            </option>
          ))}
        </select>
        <MapItem
          key={chosenMapData.name}
          map={chosenMapData}
          handleMapChosen={handleMapChosen}
        />
      </div>
    </div>
  );
};

export default ChooseMap;
