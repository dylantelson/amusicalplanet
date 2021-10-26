import React, { useState, useEffect } from "react";
// import "./Play.scss";

const AudioPlayer = ({ audioRef, trackURL, loading }) => {
  const [paused, setPaused] = useState(true);
  const [currTime, setCurrTime] = useState(0);
  const [currVolume, setCurrVolume] = useState(1);

  //set Volume to 1 on load
  //necessary to get the slider gradient
  //to update to the correct value
  useEffect(() => {
    inputChangeHandler(1, "volume");
  }, [])

  const togglePause = () => {
    if (paused === true) audioRef.current.play();
    else audioRef.current.pause();
    setPaused(!paused);
  };

  const formatTime = (timeInSeconds) => {
    // const totalSeconds = Math.floor(time);
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    if (seconds < 10) return `${minutes}:0${seconds}`;
    return `${minutes}:${seconds}`;
  };

  //Set the gradient to the correct value,
  //then update the slider's value and volume/time
  const inputChangeHandler = (newValue, type) => {
    const slider = type==="volume" ? document.querySelector("#volumeslider") : document.querySelector("#timeslider");
    var gradientValue = (newValue-slider.min)/(slider.max-slider.min)*100;
    slider.style.background = 'linear-gradient(to right, #0db8bb 0%, #0db8bb ' + gradientValue + '%, #fff ' + gradientValue + '%, white 100%)';
   
    if(type === "volume") {
      audioRef.current.volume = newValue;
      setCurrVolume(newValue);
    }
    else if(type === "timeUpdated") {
      audioRef.current.currentTime = newValue;
      setCurrTime(newValue);
    }
    else if(type === "timePlayed") {
      console.log("UPDATING CURRTIME");
      setCurrTime(newValue);
    }
  }

  return (
    <div className={loading ? "hidden" : ""}>
      <audio
        id="audioPlayer"
        controls
        ref={audioRef}
        onTimeUpdate={() => inputChangeHandler(audioRef.current.currentTime, "timePlayed")}
        onPlay={() => (paused ? setPaused(false) : null)}
        onPause={() => (!paused ? setPaused(true) : null)}
      >
        <source
          volume="2"
          allow="autoplay"
          src={trackURL}
          type="audio/mpeg"
        ></source>
      </audio>
      <div className="playButtonContainer">
        <div
          className={paused ? "audioButton" : "audioButton paused"}
          onClick={() => togglePause()}
        ></div>
        <div className="timeControls">
          <p>{formatTime(currTime)}</p>
          <input
            type="range"
            id="timeslider"
            step="0.1"
            value={currTime}
            min="0"
            // step="0.1"
            max={
              audioRef.current && audioRef.current.duration
                ? audioRef.current.duration
                : 30
            }
            className="audioSeeker"
            onChange={(e) => inputChangeHandler(e.target.value, "timeUpdated")}
            // onMouseUp={onSeekEnd}
          />
          <p>
            {!audioRef.current || !audioRef.current.duration
              ? "0:30"
              : formatTime(audioRef.current.duration)}
          </p>
        </div>
        <div className="volumeControls">
          <img src="/audiomute.png" alt="audio empty" onClick={() => inputChangeHandler(0, "volume")}/>
          <input
              type="range"
              id="volumeslider"
              value={currVolume}
              min="0"
              max="1"
              step="0.01"
              className="volumeSeeker"
              onChange={(e) => inputChangeHandler(e.target.value, "volume")}
              // onInput={(e) => sliderInputHandler(e.target)}
              // onMouseUp={onSeekEnd}
          />
          <img src="/audiofull.png" alt="audio full" onClick={() => inputChangeHandler(1, "volume")}/>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
