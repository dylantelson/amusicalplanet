import React, { useState, useEffect } from "react";

import "./Login.scss";

var start,
  tick = 0;

const countryGenres = {
  Zimbabwe: ["Chimurenga", "Sungura", "Imbubwe"],
  Algeria: ["Chaabi", "Raï", "Gharnati"],
  Argentina: ["Tango", "Zamba", "Chamamé", "Milonga", "Chacarera"],
  Brazil: ["Bossa Nova", "Samba", "Capoeira", "Choro"],
  Colombia: ["Cumbia", "Bambuco", "Salsa", "Vallenato"],
  Peru: ["Marinera", "Huayno", "Cueca"],
  Australia: ["Bunggul", "Manikay", "Wangga"],
  Cambodia: ["Pinpeat", "Mahori", "Rock"],
  Spain: ["Flamenco", "Jota", "Sardana"],
  Japan: ["Min'yō", "Shima-uta", "Ryūkōka"],
};

const Login = ({ handleLogin }) => {
  const [prevGenre, setPrevGenre] = useState(["Candombe", "Uruguay"]);
  const [currGenre, setCurrGenre] = useState(["Salsa", "Puerto Rico"]);

  const setNewGenre = (type) => {
    const listOfCountries = Object.keys(countryGenres);
    let country =
      listOfCountries[Math.floor(Math.random() * listOfCountries.length)];
    const genre =
      countryGenres[country][
        Math.floor(Math.random() * countryGenres[country].length)
      ];
    type === "curr"
      ? setCurrGenre([genre, country])
      : setPrevGenre([genre, country]);
  };

  const newCountryGenre1 = () => {
    if (!start) start = new Date().getTime();
    var now = new Date().getTime();
    if (now < start + tick * 3000) {
      setTimeout(newCountryGenre1, 0);
    } else {
      tick++;
      setNewGenre("curr");
      setTimeout(newCountryGenre1, 5990);
    }
  };

  var newCountryGenre2 = () => {
    if (!start) start = new Date().getTime();
    var now = new Date().getTime();
    if (now < start + tick * 3000) {
      setTimeout(newCountryGenre2, 0);
    } else {
      tick++;
      setNewGenre("prev");
      setTimeout(newCountryGenre2, 5990);
    }
  };

  useEffect(() => {
    setNewGenre("curr");
    setNewGenre("prev");
    setTimeout(newCountryGenre1, 2990);
    setTimeout(newCountryGenre2, 4450);
    // const setNewGenreInterval = setInterval(() => {
    //   let country = currGenre[1];
    //   const listOfCountries = Object.keys(countryGenres);
    //   while (country === currGenre[1]) {
    //     country =
    //       listOfCountries[Math.floor(Math.random() * listOfCountries.length)];
    //   }
    //   const genre =
    //     countryGenres[country][
    //       Math.floor(Math.random() * countryGenres[country].length)
    //     ];
    //   setPrevGenre(currGenre);
    //   setCurrGenre([genre, country]);
    // }, 3000);
    // return () => clearInterval(setNewGenreInterval);
  }, []);

  return (
    <div className="login">
      {/* <img src="/a-musical-planet.jpg" alt="musical planet" /> */}
      <div className="genreDivs">
        <h1 className="item genreName prev">{prevGenre[0]}</h1>
        <h1 className="item genreName curr">{currGenre[0]}</h1>
        <h1 style={{ fontSize: "37px" }}> From </h1>
        <h1 className="item countryName curr">{currGenre[1]}</h1>
        <h1 className="item countryName prev">{prevGenre[1]}</h1>
      </div>
      <div id="caption">
        <p>
          Guess music from over 80 countries around the world. Login with a free
          or premium Spotify account.
        </p>
      </div>
      <button type="submit" id="loginButton" onClick={handleLogin}>
        <img id="spotifyIcon" src="/spotifyIcon.png" alt="Spotify icon" />
        Login
      </button>
      {/* <button type="submit" onClick={handleLogin}>
        Login With Spotify
      </button> */}
    </div>
  );
};

export default Login;
