import React from "react";

const MapItem = ({ map, handleMapChosen }) => {
  return (
    <div className="MapItem">
      <img src={"/mapimages/" + map.image} alt={map.name} />
      <h1>{map.name}</h1>
      <p>{map.description}</p>
      <button onClick={() => handleMapChosen(map.name)}>Play</button>
    </div>
  );
};

export default MapItem;
