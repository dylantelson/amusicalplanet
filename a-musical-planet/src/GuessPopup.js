import React, { useState, useContext, useEffect } from "react";
// import { UserContext } from "./App.js";

import Summary from "./Summary";
import CustomiFrame from "./CustomiFrame";

const GuessPopup = ({
  show,
  currChosen,
  currTrack,
  nextTrack,
  roundScore,
  sessionScore,
  sessionInfo,
  newGame,
  sendScoreToServer,
  currMap,
}) => {
  // const userData = useContext(UserContext);
  // console.log("USER DATA");
  // console.log(userData);

  const [gameFinished, setGameFinished] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const correctText = (
    <div>
      <h1>Good job!</h1>
      <h3>You correctly guessed {currChosen}</h3>
    </div>
  );
  const incorrectText = (
    <div>
      <h1>Whoops!</h1>
      <h3>The answer was {currTrack.location}</h3>
    </div>
  );

  let correct = false;
  if (currChosen === currTrack.location) correct = true;

  if (show && !gameFinished && currTrack.round === 5) {
    setGameFinished(true);
    sendScoreToServer(sessionScore);
  }

  const summaryExit = () => {
    setShowSummary(false);
    newGame();
  };

  return (
    <>
      <Summary
        show={showSummary}
        sessionScore={sessionScore}
        sessionInfo={sessionInfo}
        summaryExit={summaryExit}
      />
      <div
        className={"popup-container" + (!show || showSummary ? " hidden" : "")}
      >
        <div
          className={"guess-popup" + (!correct ? " incorrect-background" : "")}
        >
          <h3 className="indexText">{currTrack.round}/5</h3>
          <div className="popupText">
            {correct ? correctText : incorrectText}
            <h3 id="score">
              Score: {sessionScore} (+{roundScore} {gameFinished})
            </h3>
          </div>
          <div className="song-info">
            <CustomiFrame
              src={`https://open.spotify.com/embed/track/${currTrack.id}`}
              width="80%"
              height="300"
            />
            {/* <img
            src={currTrack.image}
            alt="Song Album"
            width="300"
            height="300"
          ></img>
          <div className="text-div">
            <h3>{currTrack.name}</h3>
            <h4>{currTrack.artist}</h4>
            <h4>{currTrack.album}</h4>
          </div> */}
          </div>
          <div
            className={"popup-buttons" + (!correct ? " incorrect-text" : "")}
          >
            {/* <button>LIKE</button> */}
            {/* <button>PLAY</button> */}
            {currTrack.round < 5 ? (
              <button onClick={nextTrack}>NEXT</button>
            ) : (
              <button onClick={() => setShowSummary(true)}>SUMMARY</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GuessPopup;
