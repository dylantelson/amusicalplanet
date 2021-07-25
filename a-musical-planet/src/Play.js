import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

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
  console.log("acctok: ", props.accessToken);
  const [currArtist, setCurrArtist] = useState("");
  const [currCountry, setCurrCountry] = useState("");
  const [currTrack, setCurrTrack] = useState("");
  const [currImage, setCurrImage] = useState("");
  const [redirect, setRedirect] = useState(false);

  const audioRef = useRef(null);
  //const imageRef = useRef(null);
  //props.spotifyApi.setAccessToken(props.token);
  console.log("tok: ", props.accessToken);

  const getNewArtist = () => {
    console.log("mylittleboy: ", props.accessToken);
    if (props.accessToken === null || props.accessToken === "") {
      console.log("REDIRECTING");
      setRedirect(true);
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

  useEffect(() => {
    getNewArtist();
  }, []);

  if (redirect) return <Redirect to="/login" />;
  return (
    <>
      <div>
        <h1>Artist: {currArtist}</h1>
        <h1>Country: {currCountry}</h1>
      </div>
      <div>
        <img src={currImage} alt="Album image" width="300" height="300"></img>
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
      <div>
        <button onClick={getNewArtist}>New Song</button>
      </div>
    </>
  );
};

export default Play;
