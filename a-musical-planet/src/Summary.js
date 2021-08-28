import React, { useState, useContext } from "react";
import SummaryItem from "./SummaryItem";

const Summary = ({ sessionInfo, sessionScore, summaryExit, show }) => {
  return (
    <div className={"popup-container" + (!show ? " hidden" : "")}>
      <div className={"summary"}>
        <h1>SUMMARY</h1>
        <h3 id="score">Score: {sessionScore}</h3>
        <div className="summary-songs">
          {sessionInfo.map((countryInfo, index) => {
            return <SummaryItem countryInfo={countryInfo} index={index} />;
          })}
        </div>
        <div className={"popup-buttons"}>
          <button onClick={summaryExit}>NEW GAME</button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
