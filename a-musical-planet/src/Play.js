import React, { useState, useEffect, useRef, useCallback } from "react";
import { Redirect } from "react-router-dom";

import MapChart from "./MapChart";
import GuessPopup from "./GuessPopup";
import CountryGuessInfo from "./CountryGuessInfo.js";
import "./Play.scss";
import haversine from "haversine-distance";

const maxScore = 5000;

const Playlists = require("./Playlists.json");
const countries = require("./WorldInfo.json");
const colors = require("./colors.json");

const Play = ({
  accessToken,
  setAccessTokenHandler,
  currMap,
  sendScoreToServer,
  setShowGlobe
}) => {
  const [currTrack, setCurrTrack] = useState({ round: 0 });
  const [redirect, setRedirect] = useState("");

  const [currChosen, setCurrChosen] = useState("");

  const [startTime, setStartTime] = useState(0);

  const [loading, setLoading] = useState(true);

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
        setCurrTrack({
          url: track.preview_url,
          artist: data.tracks.items[trackIndex].track.artists[0].name,
          album: data.tracks.items[trackIndex].track.album.name,
          image: data.tracks.items[trackIndex].track.album.images[0].url,
          location: data.name,
          name: data.tracks.items[trackIndex].track.name,
          round: currTrack.round < 5 ? currTrack.round + 1 : 1,
          id: data.tracks.items[trackIndex].track.id,
          startTime: Date.now()
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
        if (err.status === 400)
          return window.location.replace(
            `${process.env.REACT_APP_BACKEND_URI}/getNewToken`
          );
        if (err.status === 401) {
          return refreshToken();
        }
        if (err.status === 404) return nextTrack();
        //this is only really for error 401, meaning
        return setRedirect("maps");
      });
  };

  const likeTrack = (liked) => {
    fetch(`https://api.spotify.com/v1/me/tracks?ids=${currTrack.id}`, {
      method: liked ? "DELETE" : "PUT",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }).then((response) => {
      if (response.status >= 400) throw response;
      return;
    });
  };

  const refreshToken = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URI}/refreshToken`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((newAccessToken) => newAccessToken.json())
      .then((data) => {
        if (data && data.access_token) {
          setAccessTokenHandler(data.access_token);
          return nextTrack();
        }
        return window.location.replace(
          `${process.env.REACT_APP_BACKEND_URI}/getNewToken`
        );
      });
  };

  const guessGiven = () => {
    audioRef.current.pause();
    const currChosenCountryDOM = document.querySelector(
      `#${currChosen[0].toLowerCase() + currChosen.slice(1).replace(/ /g, "")}`
    );

    //check how many seconds have passed since round started
    let scoreTimedRemoval = Math.round((Date.now() - currTrack.startTime) / 1000);
    //
    scoreTimedRemoval < 20 ? scoreTimedRemoval = 0 : scoreTimedRemoval *= 10;

    console.log("REMOVING", scoreTimedRemoval, "POINTS FOR TIME");
    if (currChosenCountryDOM) {
      currChosenCountryDOM.classList.remove("pressed");
      currChosenCountryDOM.style.fill =
        colors[currChosenCountryDOM.getAttribute("continent")];
    }
    const currTrackCountry = countries.filter(function (country) {
      return country.name.common === currTrack.location;
    })[0];
    if (currChosen === currTrack.location) {
      console.log("Score removed to time: ")
      const score = Math.max(0, 5000 - scoreTimedRemoval);
      setPopup({
        sessionScore: popup.sessionScore + score,
        show: true,
        roundScore: score,
        sessionInfo: [
          ...popup.sessionInfo,
          {
            country: currTrack.location,
            songId: currTrack.id,
            correct: true,
            score: score,
            code: currTrackCountry.cca2.toLowerCase(),
          },
        ],
      });
      return;
    }

    const currTrackCountryCoords =
      currTrackCountry.name.common !== "Russia"
        ? currTrackCountry.latlng
        : currTrackCountry.latlngAlt;

    const chosenCountry = countries.filter(function (country) {
      return country.name.common === currChosen;
    })[0];

    const chosenCountryCoords =
      chosenCountry.name.common !== "Russia"
        ? chosenCountry.latlng
        : chosenCountry.latlngAlt;

    let scoreDeduction = Math.ceil(
      haversine(chosenCountryCoords, currTrackCountryCoords) / 1000 / 2
    );

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

    let score = Math.max(0, maxScore - scoreDeduction - scoreTimedRemoval);

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
    if (accessToken === null || accessToken === "") return setRedirect("login");
    setShowGlobe(false);
    if (!loading) newGame();
  }, [loading]);

  if (redirect !== "") {
    return <Redirect to={`/${redirect}`} />;
  }
  // if (redirect === "login") {
  //   return <Redirect to="/login" />;
  // }
  return (
    <>
      <div className="play-section">
        {true ? (
          <div className="overlay">
            <CountryGuessInfo
              currChosen={currChosen}
              guessGiven={guessGiven}
              audioRef={audioRef}
              trackURL={currTrack.url}
              loading={loading}
            />
          </div>
        ) : (
          <></>
        )}
        <div className="map-div">
          <MapChart
            handleNewChosen={handleNewChosen}
            setPlayLoading={setLoading}
            currMap={currMap}
          />
        </div>
        <GuessPopup
          show={popup.show}
          currTrack={currTrack}
          currChosen={currChosen}
          nextTrack={nextTrack}
          roundScore={popup.roundScore}
          sessionScore={popup.sessionScore}
          sessionInfo={popup.sessionInfo}
          sendScoreToServer={sendScoreToServer}
          newGame={newGame}
          likeTrack={likeTrack}
          setRedirect={setRedirect}
        />
      </div>
    </>
  );
};

export default Play;
