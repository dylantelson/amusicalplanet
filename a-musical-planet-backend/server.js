import express from "express";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
// const MongoDBSession = require("connect-mongodb-session")(session);
import mongoose from "mongoose";
import request from "request";
import querystring from "querystring";

import UserDAO from "./userDAO.js";

import cors from "cors";
import dotenv from "dotenv";

import User from "./models/user.js";

dotenv.config();

const MongoDBSession = connectMongoDBSession(session);
let app = express();

app.use(cors());

let redirect_uri = process.env.REDIRECT_URI || "http://localhost:8888/callback";

// const mongoURI = "mongodb://localhost:27017/sessions";
const mongoURI = `mongodb+srv://dylan:${process.env.MONGO_PASSWORD}@dtcluster.yn1yz.mongodb.net/aMusicalPlanet?retryWrites=true&w=majority`;
console.log(mongoURI);

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(async (client) => {
    console.log("MongoDB Connected");
    // console.log(client);
    // await UserDAO.injectDB(client);
  });

const store = new MongoDBSession({
  uri: mongoURI,
  collection: "sessions",
});

try {
  User.findOne({ userName: "joncena" }, function (err, doc) {
    console.log(doc);
  });
  // console.log(await User.findOne({ userName: "joncena" }));
} catch (e) {
  console.log("ERRORASD", e);
}

app.use(
  session({
    secret: "mySecret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store: store,
  })
);

app.use((req, res, next) => {
  console.log(req.session);
  next();
});

app.get("/login", function (req, res) {
  console.log("LOGGING IN");
  if (
    req.session.user &&
    req.session.user.access_token &&
    req.session.user.access_token !== ""
  ) {
    console.log("Session existing");
    return res.redirect(
      process.env.FRONTEND_URI +
        "?access_token=" +
        req.session.user.access_token +
        "&refresh_token=" +
        req.session.user.refresh_token
    );
  }
  if (
    req.session.user &&
    req.session.user.refresh_token &&
    req.session.user.refresh_token !== ""
  ) {
    console.log("Refreshing token from /login");
    let authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        grant_type: "refresh_token",
        refresh_token: req.session.user.refresh_token,
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
      },
      json: true,
    };
    request.post(authOptions, function (error, response, body) {
      if (!body.access_token || body.access_token === "") {
        console.log("Creating new session");
        return res.redirect(
          "https://accounts.spotify.com/authorize?" +
            querystring.stringify({
              response_type: "code",
              client_id: process.env.SPOTIFY_CLIENT_ID,
              scope: "user-read-private user-read-email",
              redirect_uri,
            })
        );
      }
      var access_token = body.access_token;
      var refresh_token = body.refresh_token;
      let uri = process.env.FRONTEND_URI || "http://localhost:3000/auth/";
      req.session.user = {
        access_token,
        refresh_token,
      };
      return res.redirect(
        uri +
          "?access_token=" +
          access_token +
          "&refresh_token=" +
          refresh_token
      );
      // request.get(
      //   {
      //     url: "https://api.spotify.com/v1/me",
      //     headers: {
      //       Accept: "application/json",
      //       "Content-Type": "application/json",
      //       Authorization: "Bearer " + access_token,
      //     },
      //   },
      //   function (error, response, body) {
      //     req.session.user = {
      //       id: JSON.parse(body).id,
      //       access_token,
      //       refresh_token,
      //     };
      //     return res.redirect(
      //       uri +
      //         "?access_token=" +
      //         access_token +
      //         "&refresh_token=" +
      //         refresh_token
      //     );
      //   }
      // );
    });
  }
  console.log("Creating new session");
  return res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: "user-read-private user-read-email",
        redirect_uri,
      })
  );
});

app.get("/getNewToken", function (req, res) {
  console.log("Refreshing token from /getNewToken");
  let authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      grant_type: "refresh_token",
      refresh_token: req.session.user.refresh_token,
    },
    headers: {
      Authorization:
        "Basic " +
        new Buffer(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
    },
    json: true,
  };
  request.post(authOptions, function (error, response, body) {
    if (!body.access_token || body.access_token === "") {
      console.log("Creating new session");
      return res.redirect(
        "https://accounts.spotify.com/authorize?" +
          querystring.stringify({
            response_type: "code",
            client_id: process.env.SPOTIFY_CLIENT_ID,
            scope: "user-read-private user-read-email",
            redirect_uri,
          })
      );
    }
    var access_token = body.access_token;
    var refresh_token = body.refresh_token;
    let uri = process.env.FRONTEND_URI || "http://localhost:3000/auth/";
    request.get(
      {
        url: "https://api.spotify.com/v1/me",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
      },
      function (error, response, body) {
        req.session.user = {
          id: JSON.parse(body).id,
          access_token,
          refresh_token,
        };
        return res.redirect(
          uri +
            "?access_token=" +
            access_token +
            "&refresh_token=" +
            refresh_token
        );
      }
    );
  });
});

// app.get("/getTokens", function (req, res) {
//   console.log("returning tokens");
//   if (
//     req.session.user &&
//     req.session.user.access_token &&
//     req.session.user.access_token !== ""
//   ) {
//     console.log("GOT THEM");
//     return res.JSON({
//       success: true,
//       access_token: req.session.user.access_token,
//       refresh_token: req.session.user.refresh_token,
//     });
//   } else {
//     console.log("No such thing");
//     return res.JSON({
//       success: false,
//     });
//   }
// });

app.get("/callback", function (req, res) {
  let code = req.query.code || null;
  let authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        new Buffer(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
    },
    json: true,
  };
  request.post(authOptions, function (error, response, body) {
    var access_token = body.access_token;
    var refresh_token = body.refresh_token;
    let uri = process.env.FRONTEND_URI || "http://localhost:3000/auth/";
    request.get(
      {
        url: "https://api.spotify.com/v1/me",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
      },
      function (error, response, body) {
        const parsedBody = JSON.parse(body);
        req.session.user = {
          id: JSON.parse(body).id,
          access_token,
          refresh_token,
        };
        User.findOne({ userName: parsedBody.id }).then((user, err) => {
          if (user) {
            console.log(`USER ${parsedBody.id} ALREADY EXISTS`);
          } else {
            console.log(`CREATING USER WITH ID ${parsedBody.id}`);
            const user = new User({
              displayName: parsedBody.display_name,
              userName: parsedBody.id,
              maxScores: { world: 24108 },
            });
            user
              .save()
              .then((result) => {
                console.log(result);
              })
              .catch((err) => console.log(err));
          }
        });
        return res.redirect(
          uri +
            "?access_token=" +
            access_token +
            "&refresh_token=" +
            refresh_token
        );
      }
    );
  });
});

app.get("/userData/:userSpotifyId", function (req, res) {
  console.log("User requested data");
  const userSpotifyId = req.params.userSpotifyId;
  // console.log(userSpotifyId);
  User.findOne({ userName: userSpotifyId })
    .exec()
    .then((user) => {
      return res.json(user);
    });
});

let port = process.env.PORT || 8888;
console.log(
  `Listening on port ${port}. Go /login to initiate authentication flow.`
);
app.listen(port);
