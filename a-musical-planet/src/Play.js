import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

import MapPage from "./MapPage";
import GuessPopup from "./GuessPopup";
import "./Play.css";

const Playlists = require("./Playlists.json");
const Play = (props) => {
  console.log("render");
  const [currTrack, setCurrTrack] = useState({});
  const [redirect, setRedirect] = useState("");

  const [mapContent, setMapContent] = useState("");
  const [currChosen, setCurrChosen] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);

  const audioRef = useRef(null);

  const nextTrack = () => {
    setPopupOpen(false);
    setCurrChosen("");
    if (props.accessToken === null || props.accessToken === "") {
      console.log("REDIRECTING");
      setRedirect("login");
      return;
    }

    const currPlaylistIndex = Math.floor(Math.random() * Playlists.length);
    fetch(
      `https://api.spotify.com/v1/playlists/${Playlists[currPlaylistIndex]}`,
      {
        headers: { Authorization: "Bearer " + props.accessToken },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let track = "";
        let trackIndex = 0;
        while (track === "") {
          trackIndex = Math.floor(Math.random() * data.tracks.items.length);
          track = data.tracks.items[trackIndex].track;
        }
        setCurrTrack({
          url: track.preview_url,
          artist: data.tracks.items[trackIndex].track.artists[0].name,
          album: data.tracks.items[trackIndex].track.album.name,
          image: data.tracks.items[trackIndex].track.album.images[0].url,
          country: data.name,
          name: data.tracks.items[trackIndex].track.name,
        });
        audioRef.current.load();
        audioRef.current.play();
      });
  };

  const guessGiven = () => {
    setPopupOpen(true);
    // if (currTrack.country === currChosen) {
    //   //alert(`${currChosen} is correct!`);
    // } else {
    //   //alert(  `You guessed ${currChosen} but the answer was ${currTrack.country}!`);
    // }
    // getNewArtist();
  };

  const goToMap = () => {
    setRedirect("map");
  };

  useEffect(() => {
    nextTrack();
  }, []);

  if (redirect === "login") return <Redirect to="/login" />;
  else if (redirect === "map") return <Redirect to="/map" />;
  return (
    <>
      {/* <h2>Country: {currTrack.country}</h2> */}
      {/* <div>
        <span>
          <h2>Artist: {currTrack.artist}</h2>
          <h2>Country: {currTrack.country}</h2>
        </span>
        <span>
          <img src={currTrack.image} alt="Album image" width="300" height="300"></img>
        </span>
      </div> */}
      <div className="play-section">
        <audio controls id="music" ref={audioRef}>
          <source
            volume="2"
            allow="autoplay"
            src={currTrack.url}
            type="audio/mpeg"
          ></source>
          {/* Your browser does not support the audio element. */}
        </audio>
        <div className="map-div">
          <MapPage
            {...props}
            setCurrChosen={setCurrChosen}
            currChosen={currChosen}
          />
        </div>
        <div>
          <h2>Curr Guess: {currChosen}</h2>
        </div>
        <div>
          <button onClick={guessGiven}>Submit Guess</button>
        </div>
        {popupOpen && (
          <GuessPopup
            currTrack={currTrack}
            currChosen={currChosen}
            nextTrack={nextTrack}
          />
        )}
        {/* <div>
        <button onClick={getNewArtist}>New Song</button>
      </div>
      <div>
        <button onClick={goToMap}>Map</button>
      </div> */}
      </div>
    </>
  );
};

export default Play;
