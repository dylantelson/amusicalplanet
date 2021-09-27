//import "./App.css";
import React, { useState, useEffect } from "react";
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
    if (accessTokenCookie !== "") {
      setAccessToken(accessTokenCookie);
      return true;
    } else {
      console.log("Could not find cookie");
      return false;
    }
  };

  useEffect(() => {
    if (!setTokenFromCookie() && !(window.location.pathname === "/"))
      return setRedirect("login");
  }, []);

  useEffect(() => {
    if (accessToken !== "" && accessToken !== null) {
      setUser();
    }
  }, [accessToken]);

  const setUser = async () => {
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
        window.location.replace(
          `${process.env.REACT_APP_BACKEND_URI}/getNewToken`
        );
      });
  };

  const handleMapChosen = (mapName) => {
    // if (accessToken === null || accessToken === "") {
    //   if (!setTokenFromCookie()) return setRedirect("login");
    // }
    console.log("HANDLING MAP CHOSEN");
    setCurrMap(mapName[0].toLowerCase() + mapName.slice(1).replace(/ /g, ""));
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

  const handleLogout = () => {
    document.cookie =
      "accessToken=-1;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    setAccessToken("");
    setRedirect("/");
  };

  const setAccessTokenHandler = (newAccessToken) => {
    let accessTokenExpireDate = new Date();
    accessTokenExpireDate.setTime(
      accessTokenExpireDate.getTime() + 60 * 60 * 1000
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
    setAccessTokenHandler(URLAccessToken);
    // return <Redirect to="/maps" />;
    setRedirect("maps");
  };

  return (
    <div className="app">
      <Router>
        {redirect === "play" && window.location.pathname === "/maps" ? (
          <Redirect push to="play" />
        ) : null}
        {redirect === "/" ? <Redirect push to="/" replace /> : null}
        {redirect === "maps" ? <Redirect push to="/maps" /> : null}
        {redirect === "login" ? <Redirect to="/login" /> : null}
        <UserContext.Provider value={userData}>
          <Header />
          <Switch>
            <Route path="/auth" render={() => handleAuth()} />
            <Route
              path="/login"
              render={() =>
                accessToken !== "" ? <Redirect to="/maps" /> : handleLogin()
              }
            />
            <Route exact path="/">
              {document.cookie.match(
                /^(.*;)?\s*accessToken\s*=\s*[^;]+(.*)?$/
              ) ? (
                <Redirect to="/login" />
              ) : (
                <Login handleLogin={handleLogin} />
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
            <Route path="/user/:userName">
              <PersonalPage handleLogout={handleLogout} />
            </Route>
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
