import React from "react";
import MapChart from "./MapChart";
import "./Map.css";

const mapProps = require("./MapProps.json");

const MapPage = ({ handleNewChosen, currChosen, currMap, myCurrPos }) => {

  return (
    <>
      <div className="map">
        <MapChart
          handleNewChosen={handleNewChosen}
          currChosen={currChosen}
          currMap={currMap}
          mapProps={currMap.slice(0,5) === "world" ? mapProps.world : mapProps[currMap]}
          myCurrPos={myCurrPos}
          // currLocation={props.currLocation}
        />
      </div>
    </>
  );
};

export default MapPage;
