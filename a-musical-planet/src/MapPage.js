import React from "react";
import MapChart from "./MapChart";

import "./Map.css";

const MapPage = ({ setCurrChosen, currChosen, currMap }) => {
  const mapProps = {
    world: {
      scale: 170,
      center: [40, 40],
      rotate: [-10, 0, 0],
      coordinates: [0, 0],
      translateExtent: [
        [-100, -50],
        [860, 600],
      ],
      minZoom: 1,
      maxZoom: 6,
    },
    europe: {
      scale: 170,
      center: [40, 80],
      rotate: [-10, 0, 0],
      coordinates: [13.5, 50],
      //translateExtent goes:
      //[left, up],
      //[right,down]
      translateExtent: [
        [280, 380],
        [460, 570],
      ],
      minZoom: 4.5,
      maxZoom: 8,
    },
    southAmerica: {
      scale: 170,
      center: [40, 40],
      rotate: [-10, 0, 0],
      coordinates: [-60, -20],
      //translateExtent goes:
      //[left, up],
      //[right,down]
      translateExtent: [
        [0, 290],
        [350, 600],
      ],
      minZoom: 2,
      maxZoom: 6,
    },
    northAmerica: {
      scale: 170,
      center: [40, 75],
      rotate: [-10, 0, 0],
      coordinates: [-78, 45],
      //translateExtent goes:
      //[left, up],
      //[right,down]
      translateExtent: [
        [-100, 290],
        [300, 615],
      ],
      minZoom: 2,
      maxZoom: 8,
    },
    africa: {
      scale: 170,
      center: [40, 40],
      rotate: [-10, 0, 0],
      coordinates: [20, 3],
      //translateExtent goes:
      //[left, up],
      //[right,down]
      translateExtent: [
        [200, 230],
        [580, 530],
      ],
      minZoom: 2.2,
      maxZoom: 6,
    },
    asia: {
      scale: 170,
      center: [40, 80],
      rotate: [-10, 0, 0],
      coordinates: [90, 28],
      //translateExtent goes:
      //[left, up],
      //[right,down]
      translateExtent: [
        [400, 430],
        [780, 730],
      ],
      minZoom: 2.2,
      maxZoom: 9,
    },
    oceania: {
      scale: 170,
      center: [40, 80],
      rotate: [-10, 0, 0],
      coordinates: [150, -26],
      //translateExtent goes:
      //[left, up],
      //[right,down]
      translateExtent: [
        [620, 650],
        [940, 840],
      ],
      minZoom: 3.3,
      maxZoom: 9,
    },
  };

  return (
    <>
      <div className="map">
        <MapChart
          setCurrChosen={setCurrChosen}
          currChosen={currChosen}
          currMap={currMap}
          mapProps={currMap.slice(0,5) === "world" ? mapProps.world : mapProps[currMap]}
          // currLocation={props.currLocation}
        />
      </div>
    </>
  );
};

export default MapPage;
