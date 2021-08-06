import React from "react";
import MapItem from "./MapItem";
import "./ChooseMap.css";

const Maps = [
  {
    name: "World",
    description: "Guess from the music of over 100 countries!",
    difficulty: 5,
    image: "/world.png",
  },
  {
    name: "North America",
    description: "Guess from the music of North America!",
    difficulty: 3,
    image: "/na.png",
  },
  {
    name: "South America",
    description: "Guess from the music of South America!",
    difficulty: 3,
    image: "/sa.png",
  },
  {
    name: "Africa",
    description: "Guess from the music of Africa!",
    difficulty: 4,
    image: "/africa.png",
  },
  {
    name: "Europe",
    description: "Guess from the music of Europe!",
    difficulty: 2,
    image: "/europe.png",
  },
  {
    name: "Asia",
    description: "Guess from the music of Asia!",
    difficulty: 3,
    image: "/asia.png",
  },
  {
    name: "Oceania",
    description: "Guess from the music of Oceania!",
    difficulty: 3,
    image: "/oceania.png",
  },
];

const ChooseMap = ({ handleMapChosen }) => {
  return (
    <div className="ChooseMapContainer">
      <div className="MapHead">
        <h1>Official Maps</h1>
      </div>
      <div className="MapItems">
        {Maps.map((currMap) => (
          <MapItem
            key={currMap.name}
            map={currMap}
            handleMapChosen={handleMapChosen}
          />
        ))}
      </div>
    </div>
  );
};

export default ChooseMap;
