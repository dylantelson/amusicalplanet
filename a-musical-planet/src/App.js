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
import Leaderboard from "./Leaderboard";

import getCookie from "./GetCookie";

export const UserContext = React.createContext({
  userName: "user",
  displayName: "user",
  maxScores: {},
});

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [redirect, setRedirect] = useState("");
  const [userData, setUserData] = useState({
    displayName: "",
    userName: "",
    maxScores: {},
    currGameScore: 0,
  });

  //default world as map
  const [currMap, setCurrMap] = useState("World");

  const setUserMaxScore = (newScore) => {
    console.log("APP SETTING NEW MAXSCORE", newScore);
    axios(
      `http://localhost:8888/setMaxScore/${
        userData.userName
      }/${currMap.toLowerCase()}/${newScore}`,
      {
        method: "POST",
      }
    )
      .then(() => {
        console.log("POSTED NEW MAX SCORE OF", currMap, newScore);
        let newMaxScores = userData.maxScores;
        newMaxScores[currMap.toLowerCase()] = newScore;
        setUserData({ ...userData, maxScores: newMaxScores });
        console.log(userData);
      })
      .catch((err) => {
        console.log("ERROR SETTING NEW SCORE", err);
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
        axios(`http://localhost:8888/userData/${spotifyData.data.id}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "GET",
        }).then((dbUserData) => {
          setUserData({
            displayName: dbUserData.data.displayName,
            userName: dbUserData.data.userName,
            maxScores: dbUserData.data.maxScores,
            currGameScore: 0,
          });
        });
        // setUserData({
        //   username: userData.data.display_name,
        //   totalScore: 0,
        // });
      })
      .catch((err) => {
        console.log("ERROR GETTING SPOTIFY USER DATA", err);
        if (err.response.status >= 400) {
          console.log("ERROR 400+, REFRESHING TOKEN");
          window.location.replace("http://localhost:8888/getNewToken");
        }
      });
  };

  const handleMapChosen = (mapName) => {
    if (accessToken === null || accessToken === "") {
      if (!setTokenFromCookie()) return setRedirect("login");
    }
    console.log("HANDLING MAP CHOSEN");
    setCurrMap(mapName.replace(" ", ""));
    // setRedirect("play");
  };

  const checkToken = () => {
    if (!setTokenFromCookie()) {
      setRedirect("login");
    }
  };

  const handleLogin = () => {
    window.location.replace("http://localhost:8888/login");
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
    setAccessToken(URLAccessToken);

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
      URLAccessToken +
      ";expires=" +
      accessTokenExpireDate.toUTCString() +
      ";path=/";
    document.cookie =
      "refreshToken=" +
      URLRefreshToken +
      ";expires=" +
      refreshTokenExpireDate.toUTCString() +
      ";path=/";
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
            <Route path="/leaderboard">
              <Leaderboard />
            </Route>
            <Route path="/play">
              <Play
                accessToken={accessToken}
                token={accessToken}
                currMap={currMap}
                setAccessToken={setAccessToken}
                setUserMaxScore={setUserMaxScore}
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
