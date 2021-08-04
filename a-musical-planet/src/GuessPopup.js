import React from "react";

const GuessPopup = ({
  currChosen,
  currTrack,
  nextTrack,
  roundScore,
  sessionScore,
  newGame,
}) => {
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

  return (
    <div className="popup-container">
      <div
        className={"guess-popup" + (!correct ? " incorrect-background" : "")}
      >
        <h3 className="indexText">{currTrack.round}/5</h3>
        <div className="popupText">
          {correct ? correctText : incorrectText}
          <h3 id="score">
            Score: {sessionScore} (+{roundScore})
          </h3>
        </div>
        <div className="song-info">
          <img
            src={currTrack.image}
            alt="Song Album"
            width="300"
            height="300"
          ></img>
          <div className="text-div">
            <h3>{currTrack.name}</h3>
            <h4>{currTrack.artist}</h4>
            <h4>{currTrack.album}</h4>
          </div>
        </div>
        <div className={"popup-buttons" + (!correct ? " incorrect-text" : "")}>
          <button>LIKE</button>
          <button>PLAY</button>
          {currTrack.round < 5 ? (
            <button onClick={nextTrack}>NEXT</button>
          ) : (
            <button onClick={newGame}>New Game</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuessPopup;
