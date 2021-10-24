import React, { useState, useEffect } from "react";

import "./Login.scss";

const countryGenres = {
  Zimbabwe: ["Chimurenga", "Sungura", "Imbubwe", "Mbira"],
  Algeria: ["Chaabi", "Raï", "Gharnati"],
  Argentina: ["Tango", "Zamba", "Chamamé", "Milonga", "Chacarera"],
  Brazil: ["Samba", "Capoeira", "Choro"],
  Colombia: ["Cumbia", "Bambuco", "Salsa", "Vallenato"],
  Peru: ["Marinera", "Huayno", "Cueca"],
  Australia: ["Bunggul", "Manikay", "Wangga", "Didgeridoo"],
  Cambodia: ["Pinpeat", "Mahori", "Rock"],
  Spain: ["Flamenco", "Jota", "Sardana"],
  Japan: ["Min'yō", "Shima-uta", "Ryūkōka"],
  Ecuador: ["Pasillo", "Pascalle", "Yaraví", "Capischa", "Tonada"],
  Venezuela: ["Joropo", "Gaita", "Aguinaldo"],
  Indonesia: ["Gamelan", "Jaipongan", "Campursari"],
  Kazakhstan: ["Dombra", "Kuy", "Kobyz"],
  Vietnam: ["Xẩm", "Quan họ", "Ca trù", "Nhã nhạc"],
  Cuba: ["Son", "Songo", "Trova", "Guaracha", "Charanga", "Bolero", "Mambo"],
  Panama: ["Tamborito", "Pindín", "Saloma"],
  "DR Congo": ["Soukous", "Mbuti", "Cavacha"],
  Cameroon: ["Baka", "Bikutsi", "Makossa", "Assiko"],
  Bulgaria: ["Choir", "Gaida", "Gadulka"],
  Italy: ["Ciaramedda", "Siciliana", "Saltarello", "Opera"],
  Bosnia: ["Ganga", "Sevdalinka", "Ilahije"],
  Madagascar: ["Valiha", "Ba-gasy", "Salegy", "Tsapika", "Basesa", "Kilalaky", "Mangaliba"]
};

const Login = ({ handleLogin, setShowGlobe }) => {

  const [startCurr, setStartCurr] = useState(false);

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

  useEffect(() => {
    setShowGlobe(true);

    setNewGenre("curr");
    setNewGenre("prev");
    setTimeout(() => setStartCurr(true), 3000);
    const prevInterval = setInterval(() => {
      setNewGenre("prev");
    }, 6000);
    // setTimeoutsList([...timeoutsList, setTimeout(newCountryGenre1, 2990)]);
    // setTimeoutsList([...timeoutsList, setTimeout(newCountryGenre2, 4450)]);
    return () => {
      clearInterval(prevInterval);
    };
  }, []);

  useEffect(() => {
    if(!startCurr) return;
    setNewGenre("curr");
    const currInterval = setInterval(() => {
      setNewGenre("curr");
    }, 6000);
    return () => {
      clearInterval(currInterval);
    }
  }, [startCurr]);

  return (
    <div className="login">
      {/* <img src="/a-musical-planet.jpg" alt="musical planet" /> */}
      <div className="genreDivs">
        <h1 className="genreName prev">{prevGenre[0]}</h1>
        <h1 className="item genreName curr">{currGenre[0]}</h1>
        <h1 style={{ fontSize: "30px" }}> Music of </h1>
        <h1 className="countryName curr">{currGenre[1]}</h1>
        <h1 className="countryName prev">{prevGenre[1]}</h1>
      </div>
      <div id="caption">
        <p>
        Test your music knowledge and discover songs from over 100 countries around the world.
        Login with a free or premium Spotify account.
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
