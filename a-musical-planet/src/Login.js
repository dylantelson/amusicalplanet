import React from "react";

import "./Login.css";

const Login = ({ handleLogin }) => {
  return (
    <div className="login">
      <img src="/a-musical-planet.jpg" alt="musical planet image" />
      <button type="submit" onClick={handleLogin}>
        Login With Spotify
      </button>
    </div>
  );
};

export default Login;
