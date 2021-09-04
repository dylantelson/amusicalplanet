import React, { memo } from "react";
import MapChart from "./MapChart";
import "./Map.css";

const mapProps = require("./MapProps.json");

const MapPage = ({ handleNewChosen, currMap }) => {
  return (
    <>
      <div className="map">
        <MapChart
          handleNewChosen={handleNewChosen}
          currMap={currMap}
          mapProps={
            currMap.slice(0, 5) === "world" ? mapProps.world : mapProps[currMap]
          }
        />
      </div>
    </>
  );
};

export default MapPage;
