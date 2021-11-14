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
import World from "./World";
import dotenv from "dotenv";
import getCookie from "./GetCookie";

dotenv.config();

//logged in user information
export const UserContext = React.createContext({
  displayName: "",
  userName: "",
  maxScores: {},
  profilePicture: "",
  country: "",
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

  //world is default map
  const [currMap, setCurrMap] = useState("world");

  //whether to show the spinning globe (set to false in /play)
  const [showGlobe, setShowGlobe] = useState(true);

  //sending score to server
  //would be good to send country guess
  //and have server calculate score,
  //but would put extra stress on the server
  //as it would have to make all the Spotify
  //requests itself
  const sendScoreToServer = (newScore) => {
    axios(
      `${process.env.REACT_APP_BACKEND_URI}/newScore/${userData.userName}/${currMap}/${newScore}`,
      {
        method: "POST",
      }
    )
      .then(({ data }) => {
        setUserData(data);
      })
      .catch((err) => {
        console.log("ERROR SENDING SCORE TO SERVER", err);
      });
  };

  //Get the access token from a cookie
  //if it still exists (expires after 1 hour)
  const setTokenFromCookie = () => {
    const accessTokenCookie = getCookie("accessToken");
    if (accessTokenCookie !== "") {
      setAccessToken(accessTokenCookie);
      return true;
    } else {
      return false;
    }
  };

  //If user refreshes a page other than the homepage,
  //such as play, and the cookie has expired, automatically
  //relogin rather than making the user click login again
  useEffect(() => {
    if (!setTokenFromCookie() && !(window.location.pathname === "/"))
      return setRedirect("login");
  }, []);

  //this is to ensure the userData is set even if on first
  //render the accessToken isn't set
  useEffect(() => {
    if (accessToken !== "" && accessToken !== null) {
      setUser();
    }
  }, [accessToken]);

  //Get user's information from Spotify
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

  //Set map to whatever MapItem is chosen from ChooseMap
  //Reformatting: North America -> northAmerica
  const handleMapChosen = (mapName) => {
    setCurrMap(mapName[0].toLowerCase() + mapName.slice(1).replace(/ /g, ""));
  };

  //When login button is clicked, redirect to server
  //We do it this way so the server can redirect to
  //the Spotify authentication page for new users
  const handleLogin = () => {
    window.location.replace(`${process.env.REACT_APP_BACKEND_URI}/login`);
  };

  //On logout we remove all cookies, clear user data, and redirect to home
  const handleLogout = () => {
    document.cookie =
      "accessToken=-1;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    setAccessToken("");
    setUserData({
      displayName: "",
      userName: "",
      maxScores: {},
      profilePicture: "",
      country: "",
    });
    setRedirect("/");
  };

  //Set access token and the access token cookie
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

  //When redirected from the server, we set the access token
  //and redirect to /maps
  const handleAuth = () => {
    const URLAccessToken = new URLSearchParams(window.location.search).get(
      "access_token"
    );
    setAccessTokenHandler(URLAccessToken);
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
          {showGlobe ? <World /> : null}
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
                <Login handleLogin={handleLogin} setShowGlobe={setShowGlobe} />
              )}
            </Route>
            <Route path="/maps">
              <ChooseMap
                handleMapChosen={handleMapChosen}
                setShowGlobe={setShowGlobe}
              />
            </Route>
            <Route path="/about">
              <About setShowGlobe={setShowGlobe} />
            </Route>
            <Route path="/leaderboard">
              <Leaderboard setShowGlobe={setShowGlobe} />
            </Route>
            <Route path="/user/:userName">
              <PersonalPage
                handleLogout={handleLogout}
                setShowGlobe={setShowGlobe}
              />
            </Route>
            <Route path="/play">
              <Play
                accessToken={accessToken}
                token={accessToken}
                currMap={currMap}
                setAccessTokenHandler={setAccessTokenHandler}
                setTokenFromCookie={setTokenFromCookie}
                sendScoreToServer={sendScoreToServer}
                setShowGlobe={setShowGlobe}
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
