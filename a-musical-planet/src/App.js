//import "./App.css";
import React, { useState } from "react";
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

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [redirect, setRedirect] = useState("");
  const [userData, setUserData] = useState({ username: "", totalScore: 0 });

  //default europe as map
  const [currMap, setCurrMap] = useState("Europe");

  const handleMapChosen = (mapName) => {
    setCurrMap(mapName.replace(" ", ""));
    setRedirect("play");
  };

  const handleLogin = () => {
    window.location.replace("http://localhost:8888/login");
  };

  const handleAuth = () => {
    if (accessToken !== "") return;
    console.count("Handling AUTH");
    console.log(
      new URLSearchParams(window.location.search).get("access_token")
    );
    setAccessToken(
      new URLSearchParams(window.location.search).get("access_token")
    );
    axios("https://api.spotify.com/v1/me", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          new URLSearchParams(window.location.search).get("access_token"),
      },
      method: "GET",
    })
      .then((userData) => {
        let expireDate = new Date();
        expireDate.setMonth((expireDate.getMonth() + 1) % 12);
        console.log("Setting user data");
        console.log(userData);
        console.log("Setting username to", userData.data.display_name);
        setUserData({
          username: userData.data.display_name,
          totalScore: 0,
        });
        // alert("SETTING COOKIE");
        document.cookie =
          "user=" +
          userData.data.id +
          ";expires=" +
          expireDate.toUTCString() +
          ";path=/";
      })
      .catch((err) => {
        console.log("ERROR", err);
      });
    return <Redirect to="/maps" />;
    // setRedirect(true);
  };

  return (
    <div className="app">
      <Router>
        {redirect === "play" && window.location.pathname === "/maps" ? (
          <Redirect to="play" />
        ) : null}
        {redirect === "maps" ? <Redirect to="maps" /> : null}
        <Header userData={userData} setRedirect={setRedirect} />
        <Switch>
          <Route path="/auth" render={() => handleAuth()} />
          <Route path="/login" render={() => handleLogin()} />
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
          <Route path="/play">
            <Play
              accessToken={accessToken}
              token={accessToken}
              currMap={currMap}
            />
          </Route>
          <Route path="/error">
            <h1>Error! Check console</h1>
          </Route>
          <Route path="*">
            <h1>Not Found!</h1>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
