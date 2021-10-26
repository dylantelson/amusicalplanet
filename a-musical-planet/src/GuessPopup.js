import React, { useState } from "react";
// import { UserContext } from "./App.js";

import Summary from "./Summary";
import CustomiFrame from "./CustomiFrame";
import getMixedColor from "./GetMixedColor";

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
  likeTrack,
  setRedirect,
}) => {
  const [gameFinished, setGameFinished] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    likeTrack(liked);
    setLiked(!liked);
  };

  const handleNext = () => {
    setLiked(false);
    nextTrack();
  };

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
    setGameFinished(false);
    newGame();
  };

  //NOTE: We have summary always rendering, even when not visible,
  //because otherwise the iFrames take too much time to load.
  //Same reason why this GuessPopup is always rendered even
  //while not showing. Can be changed if a way to
  //preload iFrames efficiently is found.
  return (
    <>
      <Summary
        show={showSummary}
        sessionScore={sessionScore}
        sessionInfo={sessionInfo}
        summaryExit={summaryExit}
        setRedirect={setRedirect}
      />
      <div
        className={"popup-container" + (!show || showSummary ? " hidden" : "")}
      >
        <div
          className={"guess-popup"}
          style={{ background: `#${getMixedColor(roundScore / 5000)}` }}
        >
          <h3 className="indexText">{currTrack.round}/5</h3>
          <div className="popupText">
            {correct ? correctText : incorrectText}
            <h3 id="score">
              Score: {sessionScore} (+{roundScore})
            </h3>
          </div>
          <div className="song-info">
            <CustomiFrame
              trackId={currTrack.id}
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
            <button id="likeButton" onClick={handleLike}>
              <img
                className="spotifyIcon"
                src="/spotifyIcon.png"
                alt="Spotify icon"
              />
              {liked ? "UNLIKE" : "LIKE"}
            </button>
            {currTrack.round < 5 ? (
              <button
                style={{ color: `#${getMixedColor(roundScore / 5000)}` }}
                onClick={handleNext}
              >
                NEXT
              </button>
            ) : (
              <button
                style={{ color: `#${getMixedColor(roundScore / 5000)}` }}
                onClick={() => setShowSummary(true)}
              >
                SUMMARY
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GuessPopup;
