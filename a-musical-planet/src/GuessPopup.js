import React from "react";

const GuessPopup = ({
  currChosen,
  currTrack,
  nextTrack,
  roundScore,
  sessionScore,
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
      <h3>The answer was {currTrack.country}</h3>
    </div>
  );

  let correct = false;
  if (currChosen === currTrack.country) correct = true;

  return (
    <div className="popup-container">
      <div
        className={"guess-popup" + (!correct ? " incorrect-background" : "")}
      >
        <div className="popupText">
          {correct ? correctText : incorrectText}
          <h3 id="score">
            Score: {sessionScore} (+{roundScore})
          </h3>
        </div>
        <div className="song-info">
          <img
            src={currTrack.image}
            alt="Album image"
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
          <button onClick={nextTrack}>NEXT</button>
        </div>
      </div>
    </div>
  );
};

export default GuessPopup;
