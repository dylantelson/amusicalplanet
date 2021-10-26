import React, { useState, useEffect } from "react";
import MapItem from "./MapItem";
import "./ChooseMap.scss";
import MapData from "./MapData.json";

const ChooseMap = ({ handleMapChosen, setShowGlobe }) => {
  const [chosenMap, setChosenMap] = useState("World Easy");
  const [chosenMapCategory, setChosenMapCategory] = useState("World");
  const chosenMapData = MapData.find((map) => map.name === chosenMap);

  const mapCategories = ["World", "Continent"];

  useEffect(() => {
    setShowGlobe(true);
  }, []);

  return (
    <div className="ChooseMapContainer">
      <div className="MapHead">
        <h1>Maps</h1>
      </div>
      <div className="MapBodyDesktop">
        <label className="Switch">
          <input type="checkbox" onChange={(e) => {
            e.target.checked ? setChosenMapCategory("Continent") : setChosenMapCategory("World");
          }}/>
          <div>
              <span></span>
          </div>
          <div id="SwitchText">
            <p className={chosenMapCategory==="World" ? "active" : ""}>World</p>
            <p className={chosenMapCategory==="Continent" ? "active" : ""}>Continents</p>
          </div>
        </label>
        <div className="MapItemsDesktop">
          {MapData.map((currMap) =>
            currMap.category === chosenMapCategory ? (
              <MapItem
                key={"desktopitem" + currMap.name}
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
          {MapData.map((map, i) => (
            <option value={map.name}>
              {map.name}
            </option>
          ))}
        </select>
        <MapItem
          key={"mobileitem" + chosenMapData.name}
          map={chosenMapData}
          handleMapChosen={handleMapChosen}
        />
      </div>
    </div>
  );
};

export default ChooseMap;
