//import "./App.css";
import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import "./App.css";
import axios from "axios";
import Play from "./Play";
import Header from "./Header";
import Login from "./Login";
import ChooseMap from "./ChooseMap";
import About from "./About";
import Leaderboard from "./Leaderboard";
import PersonalPage from "./PersonalPage";
import dotenv from "dotenv";
import getCookie from "./GetCookie";

dotenv.config();

export const UserContext = React.createContext({
  userName: "user",
  displayName: "user",
  stats: {
    maxScores: {},
    averageScores: {},
    completedGames: 0,
  },
});

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [redirect, setRedirect] = useState("");
  const [userData, setUserData] = useState({
    displayName: "",
    userName: "",
    maxScores: {},
    profilePicture: "",
    country: "",
  });

  //default world as map
  const [currMap, setCurrMap] = useState("world");

  const sendScoreToServer = (newScore) => {
    console.log("Sending score to server", newScore);
    axios(
      `${process.env.REACT_APP_BACKEND_URI}/newScore/${userData.userName}/${currMap}/${newScore}`,
      {
        method: "POST",
      }
    )
      .then(({ data }) => {
        console.log("Score sent to server!");
        console.log(data);
        setUserData(data);
      })
      .catch((err) => {
        console.log("ERROR SENDING SCORE TO SERVER", err);
      });
  };

  const setTokenFromCookie = () => {
    const accessTokenCookie = getCookie("accessToken");
    console.log("myCookie", accessTokenCookie);
    if (accessTokenCookie !== "") {
      console.log("GOT COOKIE!", accessTokenCookie);
      setAccessToken(accessTokenCookie);
      return true;
    } else {
      console.log("Could not find cookie");
      return false;
    }
  };

  useEffect(() => {
    console.log(accessToken);
    if (accessToken !== "" && accessToken !== null) {
      console.log("UseEffect setting user with accesstoken", accessToken);
      setUser();
    } else {
      console.log("No access token with which to set user");
    }
  }, [accessToken]);

  const setUser = async () => {
    console.log("SETTING USER");
    return axios("https://api.spotify.com/v1/me", {
      headers: {
        Accept: "application/json",
        // "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      method: "GET",
    })
      .then((spotifyData) => {
        axios(
          `${process.env.REACT_APP_BACKEND_URI}/userData/${spotifyData.data.id}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "GET",
          }
        ).then(({ data }) => {
          setUserData(data);
        });
      })
      .catch((err) => {
        console.log("ERROR GETTING SPOTIFY USER DATA", err);
        if (err.response.status >= 400) {
          console.log("ERROR 400+, REFRESHING TOKEN");
          window.location.replace(
            `${process.env.REACT_APP_BACKEND_URI}/getNewToken`
          );
        }
      });
  };

  const handleMapChosen = (mapName) => {
    if (accessToken === null || accessToken === "") {
      if (!setTokenFromCookie()) return setRedirect("login");
    }
    console.log("HANDLING MAP CHOSEN");
    setCurrMap(mapName[0].toLowerCase() + mapName.slice(1).replaceAll(" ", ""));
    // setRedirect("play");
  };

  const checkToken = () => {
    if (!setTokenFromCookie()) {
      setRedirect("login");
    }
  };

  const handleLogin = () => {
    window.location.replace(`${process.env.REACT_APP_BACKEND_URI}/login`);
  };

  const setAccessTokenHandler = (newAccessToken) => {
    let accessTokenExpireDate = new Date();
    accessTokenExpireDate.setTime(
      accessTokenExpireDate.getTime() + 3600 * 1000
    );

    let refreshTokenExpireDate = new Date();
    refreshTokenExpireDate.setTime(
      refreshTokenExpireDate.getTime() + 3600 * 1000 * 24 * 365
    );

    document.cookie =
      "accessToken=" +
      newAccessToken +
      ";expires=" +
      accessTokenExpireDate.toUTCString() +
      ";path=/";

    setAccessToken(newAccessToken);
  };

  const handleAuth = () => {
    // console.log(accessToken === "");
    // if (accessToken !== "" && accessToken !== null) {
    //   console.log("have access token", accessToken);
    //   return setRedirect("maps");
    // }
    // if (setTokenFromCookie()) {
    //   console.log("gettin from cookie");
    //   return setRedirect("maps");
    // }
    console.count("Handling AUTH");
    const URLAccessToken = new URLSearchParams(window.location.search).get(
      "access_token"
    );
    const URLRefreshToken = new URLSearchParams(window.location.search).get(
      "refresh_token"
    );
    setAccessTokenHandler(URLAccessToken);
    // return <Redirect to="/maps" />;
    setRedirect("maps");
  };

  return (
    <div className="app">
      <Router>
        {redirect === "play" && window.location.pathname === "/maps" ? (
          <Redirect to="play" replace />
        ) : null}
        {redirect === "maps" ? <Redirect to="/maps" /> : null}
        {redirect === "login" ? <Redirect to="/login" /> : null}
        <UserContext.Provider value={userData}>
          <Header
            // userData={userData}
            checkToken={checkToken}
            setRedirect={setRedirect}
          />
          <Switch>
            <Route path="/auth" render={() => handleAuth()} />
            <Route
              path="/login"
              render={() =>
                setTokenFromCookie() ? <Redirect to="/maps" /> : handleLogin()
              }
            />
            <Route exact path="/">
              {document.cookie === "" ? (
                <Login handleLogin={handleLogin} />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route path="/maps">
              <ChooseMap handleMapChosen={handleMapChosen} />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/leaderboard">
              <Leaderboard />
            </Route>
            <Route path="/user/:userName" children={<PersonalPage />} />
            <Route path="/play">
              <Play
                accessToken={accessToken}
                token={accessToken}
                currMap={currMap}
                setAccessTokenHandler={setAccessTokenHandler}
                setTokenFromCookie={setTokenFromCookie}
                sendScoreToServer={sendScoreToServer}
              />
            </Route>
            <Route path="/error">
              <h1>Error! Check console</h1>
            </Route>
            <Route path="*">
              <h1>Not Found!</h1>
            </Route>
          </Switch>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
