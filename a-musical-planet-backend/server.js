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

import RandomNames from "./RandomNames.js";

dotenv.config();

const mapNames = [
  "world",
  "northamerica",
  "southamerica",
  "europe",
  "africa",
  "oceania",
  "asia",
];
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

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
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

const randInt = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const createRandomUsers = async (loopTimes) => {
  const users = [];
  for (let i = 0; i < loopTimes; i++) {
    const randomName = RandomNames()[randInt(0, RandomNames().length - 1)];
    const user = new User({
      displayName: randomName,
      userName: randomName.toLowerCase(),
      maxScores: {
        world: randInt(1, 25000),
        northamerica: randInt(1, 25000),
        southamerica: randInt(1, 25000),
        africa: randInt(1, 25000),
        europe: randInt(1, 25000),
        asia: randInt(1, 25000),
        oceania: randInt(1, 25000),
      },
    });
    const currUser = await user.save();
    console.log(currUser);
    users.push(currUser);
  }
  return users;
};

const getLeaderboardForMap = async (map) => {
  var maxScoresForMap = {};
  maxScoresForMap["maxScores." + map] = -1;
  let leaderboardData = await User.find().sort(maxScoresForMap).limit(5);
  return leaderboardData;
};

app.get("/getLeaderboard/", async (req, res) => {
  const leaderboardData = ;
  for (const map of mapNames) {
    leaderboardData[map] = await getLeaderboardForMap(map);
  }
  console.log(leaderboardData);
  res.send(leaderboardData);
});

app.post("/createRandomUsers/:loopTimes", async (req, res) => {
  const loopTimes = req.params.loopTimes;
  const usersMade = await createRandomUsers(loopTimes);
  res.send(usersMade);
});

app.post("/setMaxScore/:userSpotifyId/:map/:newScore", async (req, res) => {
  console.log(req.url);
  const userSpotifyId = req.params.userSpotifyId;
  const map = req.params.map;
  const newScore = parseInt(req.params.newScore);
  console.log(
    `User ${userSpotifyId} posting new high score ${newScore} on map ${map}`
  );

  let userDoc = {};

  User.findOne({ userName: userSpotifyId }).then((newUser) => {
    userDoc = newUser;
    userDoc.maxScores[map] = newScore;

    userDoc.markModified("maxScores");

    mongoose.set("debug", true);

    userDoc.save().then((savedUserDoc) => {
      console.log(`Successfully saved ${userSpotifyId}'s new high score!`);
      console.log(savedUserDoc);
      return res.json(savedUserDoc);
    });
  });
  // .catch((err) => {
  //   console.log("ERROR UPDATING MAX SCORE");
  //   console.error(err);
  //   return res.send(err);
  // });
});

app.options("/", (req, res) => res.send());

let port = process.env.PORT || 8888;
console.log(
  `Listening on port ${port}. Go /login to initiate authentication flow.`
);
app.listen(port);
