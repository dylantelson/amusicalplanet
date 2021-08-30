import React from "react";
// import "./Play.scss";
import AudioPlayer from "./AudioPlayer";

const countries = require("./WorldInfo.json");

const CountryGuessInfo = ({ currChosen, guessGiven, audioRef, trackURL }) => {
  if (currChosen === "")
    return <AudioPlayer audioRef={audioRef} trackURL={trackURL} />;
  const countryCode = countries.filter(function (country) {
    return country.name.common === currChosen;
  })[0].cca2;
  return (
    <>
      <AudioPlayer audioRef={audioRef} trackURL={trackURL} />
      <div className="countryGuessInfo">
        <h2>{currChosen}</h2>
        <img
          src={"/flags/" + countryCode.toLowerCase() + ".svg"}
          alt={currChosen + " flag"}
        />
        <button onClick={guessGiven}>Guess</button>
      </div>
    </>
  );
};

export default CountryGuessInfo;
