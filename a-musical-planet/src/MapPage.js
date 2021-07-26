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
        />
      </div>
    </>
  );
};

export default MapPage;
