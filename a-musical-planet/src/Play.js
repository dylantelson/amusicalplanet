import React, { useState, useEffect, useRef, useCallback } from "react";
import { Redirect } from "react-router-dom";

import MapPage from "./MapPage";
import GuessPopup from "./GuessPopup";
import CountryGuessInfo from "./CountryGuessInfo.js";
import "./Play.scss";
import haversine from "haversine-distance";

import getCookie from "./GetCookie";

const maxScore = 5000;

const Playlists = require("./Playlists.json");
const countries = require("./WorldInfo.json");
const mapProps = require("./MapProps.json");

const Play = ({ accessToken, setAccessToken, currMap, sendScoreToServer }) => {
  const [currTrack, setCurrTrack] = useState({ round: 0 });
  const [redirect, setRedirect] = useState("");

  const [currChosen, setCurrChosen] = useState("");

  const handleNewChosen = useCallback((newChosen) => {
    setCurrChosen(newChosen);
  }, []);

  //first value is a bool on whether to show popup,
  //second is the score to show
  const [popup, setPopup] = useState({
    show: false,
    roundScore: 0,
    sessionScore: 0,
    sessionInfo: [],
  });

  const audioRef = useRef(null);

  const newGame = () => {
    nextTrack();
    setPopup({
      show: false,
      roundScore: 0,
      sessionScore: 0,
      sessionInfo: [],
    });
  };

  const nextTrack = () => {
    setPopup({
      ...popup,
      show: false,
      roundScore: 0,
    });
    setCurrChosen("");
    if (accessToken === null || accessToken === "") {
      const accessTokenCookie = getCookie("accessToken");
      // const refreshTokenCookie = getCookie("refreshToken");
      if (accessTokenCookie !== "") {
        console.log("GOT COOKIE!", accessTokenCookie);
        setAccessToken(accessTokenCookie);
        return setRedirect("maps");
      }
      // if (refreshTokenCookie !== "") {
      //   refreshTokens(refreshTokenCookie);
      // }
      console.log("Could not find cookie");
      return setRedirect("login");
    }

    let relevantPlaylists = Playlists[currMap];
    if (currMap.slice(0, 5) === "world") {
      if (currMap.slice(5) === "Easy")
        relevantPlaylists = Playlists.world.filter(
          (country) => country.difficulty === "Easy"
        );
      else if (currMap.slice(5) === "Medium") {
        relevantPlaylists = Playlists.world.filter(
          (country) =>
            country.difficulty === "Easy" || country.difficulty === "Medium"
        );
      } else relevantPlaylists = Playlists.world;
    }

    let currPlaylistIndex = Math.floor(
      Math.random() * relevantPlaylists.length
    );

    if (relevantPlaylists[currPlaylistIndex].country === currTrack.location) {
      nextTrack();
      return;
      // if (currPlaylistIndex > 0) currPlaylistIndex--;
      // else currPlaylistIndex++;
    }
    fetch(
      `https://api.spotify.com/v1/playlists/${relevantPlaylists[currPlaylistIndex].playlistId}`,
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    )
      .then((response) => {
        console.log(response.status);
        if (response.status >= 400) throw response;
        return response.json();
      })
      .then((data) => {
        let track = "";
        let trackIndex = 0;
        while (track === "") {
          trackIndex = Math.floor(Math.random() * data.tracks.items.length);
          track = data.tracks.items[trackIndex].track;
          if (track.preview_url === null) {
            console.log(
              "Track",
              data.tracks.items[trackIndex].track.name,
              "in country",
              data.name,
              "has no preview url"
            );
            track = "";
          }
        }
        console.log(track);
        setCurrTrack({
          url: track.preview_url,
          artist: data.tracks.items[trackIndex].track.artists[0].name,
          album: data.tracks.items[trackIndex].track.album.name,
          image: data.tracks.items[trackIndex].track.album.images[0].url,
          location: data.name,
          name: data.tracks.items[trackIndex].track.name,
          round: currTrack.round < 5 ? currTrack.round + 1 : 1,
          id: data.tracks.items[trackIndex].track.id,
        });
        audioRef.current.load();
        audioRef.current.play();
      })
      .catch((err) => {
        console.log(
          "ERROR LOADING TRACK FROM COUNTRY",
          relevantPlaylists[currPlaylistIndex].country
        );
        console.log("err", err);
        console.log("err status", err.status);
        if (err.status === 400 || err.status === 401)
          return window.location.replace("http://localhost:8888/getNewToken");
        if (err.status === 404) return nextTrack();
        //this is only really for error 401, meaning
        return setRedirect("maps");
      });
  };

  const guessGiven = () => {
    audioRef.current.pause();
    const currTrackCountry = countries.filter(function (country) {
      return country.name.common === currTrack.location;
    })[0];
    if (currChosen === currTrack.location) {
      setPopup({
        sessionScore: popup.sessionScore + maxScore,
        show: true,
        roundScore: maxScore,
        sessionInfo: [
          ...popup.sessionInfo,
          {
            country: currTrack.location,
            songId: currTrack.id,
            correct: true,
            score: 5000,
            code: currTrackCountry.cca2.toLowerCase(),
          },
        ],
      });
      return;
    }

    const currTrackCountryCoords = currTrackCountry.latlng;

    const chosenCountryCoords = countries.filter(function (country) {
      return country.name.common === currChosen;
    })[0].latlng;

    let scoreDeduction = Math.ceil(
      haversine(chosenCountryCoords, currTrackCountryCoords) / 1000 / 2
    );

    console.log("Initial deduction", scoreDeduction);

    switch (currMap) {
      case "Europe":
        scoreDeduction *= 4;
        break;
      case "SouthAmerica":
        scoreDeduction *= 4;
        break;
      case "NorthAmerica":
        scoreDeduction *= 3;
        break;
      case "Asia":
        scoreDeduction *= 2;
        break;
      case "Oceania":
        scoreDeduction *= 2;
        break;
      case "Africa":
        scoreDeduction *= 2;
        break;
      default:
        break;
    }

    console.log("Final deduction", scoreDeduction);

    let score = maxScore - scoreDeduction;
    if (score < 0) score = 0;

    setPopup({
      show: true,
      roundScore: score,
      sessionScore: popup.sessionScore + score,
      sessionInfo: [
        ...popup.sessionInfo,
        {
          country: currTrack.location,
          songId: currTrack.id,
          correct: false,
          score: score,
          code: currTrackCountry.cca2.toLowerCase(),
        },
      ],
    });
    // if (currTrack.location === currChosen) {
    //   //alert(`${currChosen} is correct!`);
    // } else {
    //   //alert(  `You guessed ${currChosen} but the answer was ${currTrack.location}!`);
    // }
    // getNewArtist();
  };

  useEffect(() => {
    nextTrack();
  }, []);

  if (redirect !== "") {
    return <Redirect to={`/${redirect}`} />;
  }
  // if (redirect === "login") {
  //   return <Redirect to="/login" />;
  // }
  return (
    <>
      <div className="play-section">
        <div className="overlay">
          <CountryGuessInfo
            currChosen={currChosen}
            guessGiven={guessGiven}
            audioRef={audioRef}
            trackURL={currTrack.url}
          />
        </div>
        <div className="map-div">
          <MapPage handleNewChosen={handleNewChosen} currMap={currMap} />
        </div>
        <GuessPopup
          show={popup.show}
          currMap={currMap}
          currTrack={currTrack}
          currChosen={currChosen}
          nextTrack={nextTrack}
          roundScore={popup.roundScore}
          sessionScore={popup.sessionScore}
          sessionInfo={popup.sessionInfo}
          sendScoreToServer={sendScoreToServer}
          newGame={newGame}
        />
      </div>
    </>
  );
};

export default Play;
