import React from "react";
import MapChart from "./MapChart";

import "./Map.css";

const MapPage = (props) => {
  return (
    <>
      <div className="map">
        <MapChart
          setTooltipContent={props.setTooltipContent}
          setCurrChosen={props.setCurrChosen}
          currChosen={props.currChosen}
        />
      </div>
    </>
  );
};

export default MapPage;
