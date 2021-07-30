// import axios from "axios";
// import React from "react";
// import { Credentials } from "./Credentials";
// const SpotifyWebApi = require("spotify-web-api-node");

// const Auth = (props) => {
//   //var code = document.URL.split("=")[1];
//   const code = new URLSearchParams(window.location.search).get("code");

//   console.log("AUTHENTICATING...");

//   var spotifyApi = new SpotifyWebApi(Credentials());
//   axios("https://accounts.spotify.com/api/token", {
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       Authorization:
//         "Basic " + btoa(Credentials().clientId + ":" + Credentials().secretId),
//     },
//     body: {
//       grant_type: "authorization_code",
//       code: code,
//       redirect_uri: Credentials().redirectUri,
//     },
//     method: "POST",
//   }).then(
//     function ({ data }) {
//       console.log(data);
//       console.log("The token expires in " + data["expires_in"]);
//       console.log("The access token is " + data["access_token"]);
//       console.log("The refresh token is " + data["refresh_token"]);
//       //setToken(data["access_token"]);
//       console.log(`Sending token as ${data["access_token"]}`);
//       axios("https://api.spotify.com/v1/me", {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           Authorization: data["access_token"],
//         },
//         method: "GET",
//       }).then((userData) => {
//         console.log("userData:", userData);
//         console.log("Saving cookie");
//         props.gotToken(data["access_token"]);
//       });
//     },
//     function (err) {
//       console.log("Something went wrong!", err);
//     }
//   );

//   //   spotifyApi.authorizationCodeGrant(code).then(
//   //     function (data) {
//   //       console.log("The token expires in " + data.body["expires_in"]);
//   //       console.log("The access token is " + data.body["access_token"]);
//   //       console.log("The refresh token is " + data.body["refresh_token"]);

//   //       // Set the access token on the API object to use it in later calls
//   //       spotifyApi.setAccessToken(data.body["access_token"]);
//   //       spotifyApi.setRefreshToken(data.body["refresh_token"]);
//   //       token = spotifyApi.access_token;
//   //     },
//   //     function (err) {
//   //       console.log("Something went wrong!", err);
//   //     }
//   //   );
//   return (
//     <div>
//       <h1>Hello!</h1>
//       <p>Your token is blah</p>
//     </div>
//   );
// };

// export default Auth;
