import React from "react";
// import "./Play.scss";
import AudioPlayer from "./AudioPlayer";

const countries = require("./WorldInfo.json");

const CountryGuessInfo = ({ currChosen, guessGiven, audioRef, trackURL, loading }) => {
  const countryCode = currChosen !== "" ? countries.filter(function (country) {
    return country.name.common === currChosen;
  })[0].cca2 : "";
  return (
    <>
      {currChosen !== "" ? 
        <div className="countryGuessInfo">
          <h2>{currChosen}</h2>
          <img
            src={"/flags/" + countryCode.toLowerCase() + ".svg"}
            alt={currChosen + " flag"}
          />
          <button onClick={guessGiven}>Guess</button>
        </div>
      : <></>}
      <AudioPlayer audioRef={audioRef} trackURL={trackURL} loading={loading} />
    </>
  );
};

export default CountryGuessInfo;
