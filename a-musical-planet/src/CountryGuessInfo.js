import React from "react";
import "./Play.css";
const countries = require("./countriesInfo.json");

const CountryGuessInfo = ({ currChosen, guessGiven }) => {
  if (currChosen === "") return <></>;
  const countryCode = countries.filter(function (country) {
    return country.name === currChosen;
  })[0].country_code;
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
