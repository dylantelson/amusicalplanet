import React, { useState } from "react";
import "./Play.css";

const AudioPlayer = ({ audioRef, trackURL }) => {
  const [paused, setPaused] = useState(true);
  const [currTime, setCurrTime] = useState(true);
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

  const onSeek = (newTime) => {
    audioRef.current.currentTime = newTime;
    setCurrTime(newTime);
  };

  //uncomment this if you want audio to autoplay
  //after the user finishes seeking a paused track
  //note: will also need to uncomment the onMouseEnd
  //that is found in the Seeker HTML range input
  // const onSeekEnd = () => {
  //   if (paused) {
  //     audioRef.current.play();
  //     setPaused(false);
  //   }
  // };

  return (
    <>
      <audio
        id="audioPlayer"
        controls
        ref={audioRef}
        onTimeUpdate={() => setCurrTime(audioRef.current.currentTime)}
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
          <p>{paused ? "0:00" : formatTime(currTime)}</p>
          <input
            type="range"
            value={currTime}
            min="0"
            max={
              audioRef.current && audioRef.current.duration
                ? audioRef.current.duration
                : 30
            }
            className="audioSeeker"
            onChange={(e) => onSeek(e.target.value)}
            // onMouseUp={onSeekEnd}
          />
          <p>
            {!audioRef.current || !audioRef.current.duration
              ? "0:30"
              : formatTime(audioRef.current.duration)}
          </p>
        </div>
      </div>
    </>
  );
};

export default AudioPlayer;
