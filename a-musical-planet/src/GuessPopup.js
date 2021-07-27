import React from "react";

const GuessPopup = ({ currChosen, currTrack, nextTrack }) => {
  let correct = false;
  if (currChosen === currTrack.country) correct = true;

  return (
    <div className="popup-container">
      <div
        className={"guess-popup" + (!correct ? " incorrect-background" : "")}
      >
        {correct ? (
          <div className="popupText">
            <h1>Good job!</h1>
            <h3>You correctly guessed {currChosen}</h3>
            <h3 id="score">Score: 372 (+100)</h3>
          </div>
        ) : (
          <div className="popupText">
            <h1>Whoops!</h1>
            <h3>The answer was {currTrack.country}</h3>
            <h3 id="score">Score: 372 (+100)</h3>
          </div>
        )}
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
