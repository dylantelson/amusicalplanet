import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import ReactTooltip from "react-tooltip";

import MapPage from "./MapPage";

const Playlists = [
  "6m36M8JSof1zJr7T0dAUF0",
  "4RABU5Lx4c6u6Q28k74K6n",
  "34TPiPoIKgqXCwKcQm36yR",
  "7qQiRPJJuVmK2IfuBUEgG7",
  "3ToF3Jc1dps69OxQvZxX0r",
  "2oDF3FzMIhTPap9h8BIwre",
  "4oVqu9orWVe2EWm26fhpz1",
];

const Play = (props) => {
  const [currArtist, setCurrArtist] = useState("");
  const [currCountry, setCurrCountry] = useState("");
  const [currTrack, setCurrTrack] = useState("");
  const [currImage, setCurrImage] = useState("");
  const [redirect, setRedirect] = useState("");

  const [mapContent, setMapContent] = useState("");
  const [currChosen, setCurrChosen] = useState("");

  const audioRef = useRef(null);
  //const imageRef = useRef(null);
  //props.spotifyApi.setAccessToken(props.token);

  const getNewArtist = () => {
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
        let track = "";
        let artist = "";
        let country = "";
        while (track === "") {
          const chosenIndex = Math.floor(
            Math.random() * data.tracks.items.length
          );
          const possibleTrack = data.tracks.items[chosenIndex].track;
          if (possibleTrack != null) {
            track = possibleTrack;
            artist = data.tracks.items[chosenIndex].track.artists[0].name;
            country = data.name;
          }
        }
        setCurrArtist(artist);
        setCurrTrack(track.preview_url);
        setCurrCountry(country);
        setCurrImage(track.album.images[0].url);
        audioRef.current.load();
        audioRef.current.play();
      });
  };

  const guessGiven = () => {
    if (currCountry === currChosen) {
      alert(`${currChosen} is correct!`);
    } else {
      alert(`You guessed ${currChosen} but the answer was ${currCountry}!`);
    }
    getNewArtist();
  };

  const goToMap = () => {
    setRedirect("map");
  };

  useEffect(() => {
    getNewArtist();
  }, []);

  if (redirect === "login") return <Redirect to="/login" />;
  else if (redirect === "map") return <Redirect to="/map" />;
  return (
    <>
      <div>
        <span>
          <h2>Artist: {currArtist}</h2>
          <h2>Country: {currCountry}</h2>
        </span>
        <span>
          <img src={currImage} alt="Album image" width="300" height="300"></img>
        </span>
      </div>
      <div>
        <audio controls id="music" ref={audioRef}>
          <source
            volume="2"
            allow="autoplay"
            src={currTrack}
            type="audio/mpeg"
          ></source>
          {/* Your browser does not support the audio element. */}
        </audio>
      </div>
      <MapPage
        {...props}
        setTooltipContent={setMapContent}
        setCurrChosen={setCurrChosen}
      />
      <ReactTooltip>{mapContent}</ReactTooltip>
      <div>
        <h2>Curr Guess: {currChosen}</h2>
      </div>
      <div>
        <button onClick={guessGiven}>Submit Guess</button>
      </div>
      <div>
        <button onClick={getNewArtist}>New Song</button>
      </div>
      <div>
        <button onClick={goToMap}>Map</button>
      </div>
    </>
  );
};

export default Play;
