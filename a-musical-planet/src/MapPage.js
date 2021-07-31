import React from "react";
import MapChart from "./MapChart";

import "./Map.css";

const MapPage = (props) => {
  return (
    <>
      <div className="map">
        <MapChart
          setCurrChosen={props.setCurrChosen}
          currChosen={props.currChosen}
          currCountry={props.currCountry}
        />
      </div>
    </>
  );
};

export default MapPage;
