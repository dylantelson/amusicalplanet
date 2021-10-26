import React, { useState, useEffect } from "react";

import "./Login.scss";

const countryGenres = {
  Zimbabwe: ["Chimurenga", "Sungura", "Imbubwe", "Mbira"],
  Algeria: ["Chaabi", "Raï", "Gharnati"],
  "DR Congo": ["Soukous", "Mbuti", "Cavacha"],
  Cameroon: ["Baka", "Bikutsi", "Makossa", "Assiko"],
  Madagascar: ["Valiha", "Ba-gasy", "Salegy", "Tsapika", "Basesa", "Kilalaky", "Mangaliba"],
  Ethiopia: ["Masenqo", "Tizita", "Bolel"],
  Egypt: ["Shaabi", "Baladi", "Al Jeel"],
  Mali: ["Kora", "Griot", "Bamana", "Mandinka"],
  Uganda: ["Baganda", "Amadinda", "Bakisimba", "Kidandali"],

  Argentina: ["Tango", "Zamba", "Chamamé", "Milonga", "Chacarera"],
  Brazil: ["Samba", "Capoeira", "Choro"],
  Colombia: ["Cumbia", "Bambuco", "Salsa", "Vallenato"],
  Peru: ["Marinera", "Huayno", "Cueca"],
  Ecuador: ["Pasillo", "Pascalle", "Yaraví", "Capischa", "Tonada"],
  Venezuela: ["Joropo", "Gaita", "Aguinaldo"],
  Bolivia: ["Morenada", "Caporales", "Tobas"],
  Paraguay: ["Morenada", "Caporales", "Tobas"],

  Australia: ["Bunggul", "Manikay", "Wangga", "Didgeridoo"],

  Cambodia: ["Pinpeat", "Mahori", "Rock"],
  Japan: ["Min'yō", "Shima-uta", "Ryūkōka"],
  Indonesia: ["Gamelan", "Jaipongan", "Campursari"],
  Kazakhstan: ["Dombra", "Kuy", "Kobyz"],
  Vietnam: ["Xẩm", "Quan họ", "Ca trù", "Nhã nhạc"],
  Thailand: ["Piphat", "Mor Lam", "Sueng"],

  Spain: ["Flamenco", "Jota", "Sardana"],
  Bulgaria: ["Choir", "Gaida", "Gadulka"],
  Italy: ["Ciaramedda", "Siciliana", "Saltarello", "Opera"],
  Bosnia: ["Ganga", "Sevdalinka", "Ilahije"],

  Cuba: ["Son", "Songo", "Trova", "Guaracha", "Charanga", "Bolero", "Mambo"],
  Panama: ["Tamborito", "Pindín", "Saloma"],
  Haiti: ["Kadans", "Rara", "Twoubadou", "Compas"],
  Jamaica: ["Reggae", "Mento", "Rocksteady"],
  Mexico: ["Corrido", "Mariachi", "Tamborazo", "Duranguense"],

};

const Login = ({ handleLogin, setShowGlobe }) => {

  const [startCurr, setStartCurr] = useState(false);

  //we have 2 variables so that one h1 can fade out while the other enters
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

  //After setting new genre, we initially wait
  //only 3 seconds to change it as the website
  //starts off in the middle of the animation.
  //After that, we change the genre every 6 seconds
  useEffect(() => {
    setShowGlobe(true);

    setNewGenre("curr");
    setNewGenre("prev");
    setTimeout(() => setStartCurr(true), 3000);
    const prevInterval = setInterval(() => {
      setNewGenre("prev");
    }, 6000);
    return () => {
      clearInterval(prevInterval);
    };
  }, []);

  //We use this useEffect so a 3 second delay occurs
  //before the setInterval() is set to 6 second delays
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
