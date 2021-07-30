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
import haversine from "haversine-distance";

const maxScore = 5000;

const Playlists = require("./Playlists.json");
const countries = require("./countriesInfo.json");

const Play = (props) => {
  console.log("Cookies", document.cookie);
  const [currTrack, setCurrTrack] = useState({});
  const [redirect, setRedirect] = useState("");

  const [mapContent, setMapContent] = useState("");
  const [currChosen, setCurrChosen] = useState("");
  //first value is a bool on whether to show popup,
  //second is the score to show
  const [popup, setPopup] = useState({
    show: false,
    roundScore: 0,
    sessionScore: 0,
  });

  const audioRef = useRef(null);

  const nextTrack = () => {
    setPopup({ ...popup, show: false, roundScore: 0 });
    setCurrChosen("");
    if (props.accessToken === null || props.accessToken === "") {
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
        let track = "";
        let trackIndex = 0;
        while (track === "") {
          trackIndex = Math.floor(Math.random() * data.tracks.items.length);
          track = data.tracks.items[trackIndex].track;
        }
        console.log(track);
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
      })
      .catch((err) => {
        console.log("ERROR LOADING TRACK");
        console.log(err);
        window.location.replace("http://localhost:8888/getNewToken");
      });
  };

  const guessGiven = () => {
    if (currChosen === currTrack.country) {
      setPopup({
        sessionScore: popup.sessionScore + maxScore,
        show: true,
        roundScore: maxScore,
      });
      return;
    }
    const chosenCountryCoords = countries.filter(function (country) {
      return country.name === currChosen;
    })[0].latlng;

    const currTrackCountryCoords = countries.filter(function (country) {
      return country.name === currTrack.country;
    })[0].latlng;
    console.log("Chosen Country Coords for", currChosen, chosenCountryCoords);
    console.log(
      "Correct Country Coords",
      currTrack.country,
      currTrackCountryCoords
    );

    let score =
      maxScore -
      Math.ceil(
        haversine(chosenCountryCoords, currTrackCountryCoords) / 1000 / 2
      );

    if (score < 0) score = 0;
    console.log("Setting score:", score);

    setPopup({
      show: true,
      roundScore: score,
      sessionScore: popup.sessionScore + score,
    });
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
        {popup.show && (
          <GuessPopup
            currTrack={currTrack}
            currChosen={currChosen}
            nextTrack={nextTrack}
            roundScore={popup.roundScore}
            sessionScore={popup.sessionScore}
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
