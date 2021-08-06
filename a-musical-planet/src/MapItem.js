import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";

const MapItem = ({ map, handleMapChosen }) => {
  return (
    <div className="MapItem">
      <img src={"/mapimages/" + map.image} alt={map.name} />
      <h1>{map.name}</h1>
      <p>{map.description}</p>
      <Link to="/play" onClick={() => handleMapChosen(map.name)} replace>
        Play
      </Link>
    </div>
  );
};

export default MapItem;
