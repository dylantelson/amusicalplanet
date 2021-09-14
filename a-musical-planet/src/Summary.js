import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import SummaryItem from "./SummaryItem";

const Summary = ({ sessionInfo, sessionScore, summaryExit, show, setRedirect }) => {
  const [roundSelected, setRoundSelected] = useState(0);
  return (
    <div className={"popup-container" + (!show ? " hidden" : "")}>
      <div className={"summary"}>
        <h1>SUMMARY</h1>
        <h3 id="score">Score: {sessionScore}</h3>
        <div className="summary-songs-desktop">
          {sessionInfo.map((countryInfo, index) => {
            return (
              <SummaryItem
                countryInfo={countryInfo}
                index={index}
                show={true}
              />
            );
          })}
        </div>
        <div className="summary-songs-mobile">
          {sessionInfo.length > 0 ? (
            <>
              <img
                src="/nextwhite.png"
                id="leftArrow"
                alt="Previous arrow"
                className={roundSelected <= 0 ? "disabledArrow" : ""}
                onClick={() =>
                  roundSelected > 0 ? setRoundSelected(roundSelected - 1) : null
                }
              />
              {sessionInfo.map((countryInfo, index) => {
                return (
                  <SummaryItem
                    countryInfo={countryInfo}
                    index={index}
                    show={index === roundSelected}
                  />
                );
              })}
              <img
                src="/nextwhite.png"
                id="rightArrow"
                alt="Next arrow"
                className={roundSelected >= 4 ? "disabledArrow" : ""}
                onClick={() =>
                  roundSelected < 4 ? setRoundSelected(roundSelected + 1) : null
                }
              />
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="popup-buttons">
        <button className="summary-button" onClick={() => setRedirect("maps")}>
            MAPS
          </button>
          <button className="summary-button" onClick={summaryExit}>
            NEW GAME
          </button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
