import React from "react";
import "./Play.css";
const countries = require("./WorldInfo.json");

const CountryGuessInfo = ({ currChosen, guessGiven }) => {
  if (currChosen === "") return <></>;
  const countryCode = countries.filter(function (country) {
    return country.name.common === currChosen;
  })[0].cca2;
  return (
    <div className="countryGuessInfo">
      <h2>{currChosen}</h2>
      <img
        src={"/flags/" + countryCode.toLowerCase() + ".svg"}
        alt={currChosen + " flag"}
      />
      <button onClick={guessGiven}>Guess</button>
    </div>
  );
};

export default CountryGuessInfo;
