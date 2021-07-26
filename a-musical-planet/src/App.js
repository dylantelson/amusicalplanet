//import "./App.css";
import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

import axios from "axios";
import { Credentials } from "./Credentials";
import Auth from "./Auth";
import Play from "./Play";
import queryString from "query-string";

import ReactTooltip from "react-tooltip";

const SpotifyWebApi = require("spotify-web-api-node");

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [redirect, setRedirect] = useState(false);

  var spotifyApi = new SpotifyWebApi(Credentials());

  const handleLogin = () => {
    window.location.replace(
      "https://a-musical-planet-backend.herokuapp.com/login"
    );
  };

  const handleAuth = () => {
    console.log(
      new URLSearchParams(window.location.search).get("access_token")
    );
    setAccessToken(
      new URLSearchParams(window.location.search).get("access_token")
    );
    setRefreshToken(
      new URLSearchParams(window.location.search).get("refresh_token")
    );
    setRedirect(true);
  };

  return (
    <Router>
      {redirect && window.location.href.split("/")[3] === "auth" ? (
        <Redirect to="/play" />
      ) : null}
      <Switch>
        <Route path="/auth" render={() => handleAuth()} />
        <Route path="/login" render={() => handleLogin()} />
        <Route exact path="/">
          <h1>Login Screen</h1>
          <button type="submit" onClick={handleLogin}>
            Login
          </button>
        </Route>
        <Route
          path="/map"
          render={(props) => (
            <div>
              <h1>You shouldn't be here</h1>
            </div>
          )}
        />
        <Route path="/play">
          <Play accessToken={accessToken} token={accessToken} />
        </Route>
        <Route path="/error">
          <h1>Error! Check console</h1>
        </Route>
        <Route path="*">
          <h1>Not Found!</h1>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
