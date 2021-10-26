import express from "express";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import mongoose from "mongoose";
import request from "request";
import querystring from "querystring";
import fetch from "node-fetch";

import UserDAO from "./userDAO.js";

import cors from "cors";
import dotenv from "dotenv";

import User from "./models/user.js";

dotenv.config();

const mapNames = [
  "worldEasy",
  "worldMedium",
  "worldHard",
  "northAmerica",
  "southAmerica",
  "europe",
  "africa",
  "oceania",
  "asia",
];
const MongoDBSession = connectMongoDBSession(session);
let app = express();

//We use the FRONTEND_URI env variable, and if it does not exist, localhost:3000
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URI || "http://localhost:3000/",
  })
);

let redirect_uri = process.env.REDIRECT_URI || "http://localhost:8888/callback";

const mongoURI = process.env.MONGO_URI;
console.log(mongoURI);

//Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(async (client) => {
    console.log("MongoDB Connected");
  });

const store = new MongoDBSession({
  uri: mongoURI,
  collection: "sessions",
});

//Session data. Store is the MongoDB database.
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store: store,
  })
);

app.use((req, res, next) => {
  next();
});

//On login, we create a new session if the user is new,
//redirect to the client if the user exists and the access token is valid,
//or refresh the token if the user exists but the access token has expired.
app.get("/login", function (req, res) {
  console.log("LOGGING IN");
  if (!req.session.user || !req.session.user.refresh_token) {
    return createNewSession(res);
  }
  if (req.session.user.access_token && req.session.user.access_token !== "" && req.session.user.access_token_expire_date && req.session.user.access_token_expire_date > new Date().getTime()) {
    console.log("Session existing:", req.session.user.refresh_token);
    return res.redirect(
      process.env.FRONTEND_URI +
        "/auth/?access_token=" +
        req.session.user.access_token
    );
  }
  if (req.session.user.refresh_token !== "") {
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
        return createNewSession(res);
      }
      var access_token = body.access_token;
      var refresh_token = body.refresh_token;
      let uri = process.env.FRONTEND_URI || "http://localhost:3000/auth/";

      let access_token_expire_date = new Date();
      access_token_expire_date.setTime(
        access_token_expire_date.getTime() + 60 * 60 * 1000
      );

      req.session.user = {
        id: req.session.user.id,
        access_token,
        access_token_expire_date, 
        refresh_token: req.session.user.refresh_token
      };

      request.get(
        {
          url: "https://api.spotify.com/v1/me",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + req.session.user.access_token,
          },
        },
        function (error, response, body) {
          const parsedBody = JSON.parse(body);
          let profilePic = "NONE";
          if(parsedBody.images && parsedBody.images[0]) profilePic = parsedBody.images[0].url;
          User.updateOne({ userName: parsedBody.id }, { profilePicture: profilePic});
  
          if(parsedBody.images && parsedBody.images[0]) console.log(parsedBody.images[0].url);
          else console.log("NO IMAGE FOUND!");

          return res.redirect(
            uri +
              "/auth/?access_token=" +
              access_token
          );
        }
      );
    });
  } else return createNewSession(res);
});

//Creating the new session by redirecting to the Spotify authentication page.
//The Spotify authentication page will then redirect to this server's /callback page.
const createNewSession = (res) => {
  console.log("Creating new session");
  return res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: "user-read-private user-library-modify",
        redirect_uri,
      })
  );
};

//Refresh the token from Spotify, or create a new session if
//the refresh token is invalid.
app.get("/refreshToken", function (req, res) {
  if (!req.session.user || !req.session.user.refresh_token)
    return createNewSession(res);
  console.log("REFRESHING TOKEN FOR PLAY:", req.session.user.refresh_token);
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
    console.log(body);
    if (!body.access_token || body.access_token === "") {
      //if false, the client knows to request a new session
      console.log("Refreshing token failed, must redirect window to get new tokens");
      return false;
    }

      let access_token_expire_date = new Date();
      access_token_expire_date.setTime(
        access_token_expire_date.getTime() + 60 * 60 * 1000
      );

    req.session.user = {
      id: req.session.user.id,
      access_token: body.access_token,
      access_token_expire_date,
      refresh_token: req.session.user.refresh_token,
    };
    return res.json({
      access_token: body.access_token,
    });
  });
});

//Get a new token. Same as previous function, but redirects to
//the client rather than returning a JSON.
app.get("/getNewToken", function (req, res) {
  if (!req.session.user || !req.session.user.refresh_token)
    return createNewSession(res);
  console.log("Refreshing token from /getNewToken:", req.session.user.refresh_token);
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
    if (!body.access_token || body.access_token === "")
      return createNewSession(res);

      let access_token_expire_date = new Date();
      access_token_expire_date.setTime(
        access_token_expire_date.getTime() + 60 * 60 * 1000
      );

    req.session.user = {
      id: req.session.user.id,
      access_token: body.access_token,
      access_token_expire_date,
      refresh_token: req.session.user.refresh_token,
    };
    let uri = process.env.FRONTEND_URI || "http://localhost:3000/auth/";
    return res.redirect(
      uri +
        "/auth/?access_token=" +
        body.access_token
    );
  });
});

//After Spotify authenticates the user and gives us
//an access token and a refresh token, save them in
//the session database and create the new user if
//no user by that ID exists.
//Redirects to the client with the tokens as params.
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
        let access_token_expire_date = new Date();
        access_token_expire_date.setTime(
          access_token_expire_date.getTime() + 60 * 60 * 1000
        );
        req.session.user = {
          id: JSON.parse(body).id,
          access_token,
          access_token_expire_date,
          refresh_token,
        };
        User.findOne({ userName: parsedBody.id }).then((user, err) => {
          if (user) {
            console.log(`USER ${parsedBody.id} ALREADY EXISTS`);
            let profilePic = "NONE";
            if(parsedBody.images && parsedBody.images[0]) {
              profilePic = parsedBody.images[0].url;
            }
            //We update the picture whenever a user logs in because often
            //Spotify's pictures change URLs, meaning a user only a few
            //weeks old could lose their picture. The alternative could
            //be storing images in the database rather than Spotify's URLs,
            //but that would use much more storage.
            console.log("UPDATING userName:", parsedBody.id, "With picture", profilePic)
            User.updateOne({ userName: parsedBody.id }, { profilePicture: profilePic }).then(() => {
              return res.redirect(
                uri +
                  "/auth/?access_token=" +
                  access_token
              );
            });
          } else {
            console.log(`CREATING USER WITH ID ${parsedBody.id}`);
            let profilePic = "NONE";
            if(parsedBody.images && parsedBody.images[0]) profilePic = parsedBody.images[0].url;
            const user = new User({
              displayName: parsedBody.display_name,
              userName: parsedBody.id,
              stats: {
                maxScores: {
                  overall: {
                    score: 0,
                    map: "worldHard",
                  },
                },
                averageScores: {
                  overall: 0,
                },
                completedGames: {
                  overall: 0,
                },
              },
              profilePicture: profilePic,
              country: parsedBody.country,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                return res.redirect(
                  uri +
                    "/auth/?access_token=" +
                    access_token
                );
              })
              .catch((err) => console.log(err));
          }
        });
      }
    );
  });
});

//Get the user data for the requested user.
app.get("/userData/:userSpotifyId", function (req, res) {
  const userSpotifyId = req.params.userSpotifyId;
  User.findOne({ userName: userSpotifyId })
    .exec()
    .then((user) => {
      return res.json(user);
    });
});

const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

//Create bots for the leaderboard. Not currently needed as
//there are enuogh users to populate the leaderboard, but was
//used for testing.
// const createRandomUsers = async (loopTimes) => {
//   const users = [];
//   for (let i = 0; i < loopTimes; i++) {
//     const res = await fetch("https://randomuser.me/api/");
//     const resultsJson = await res.json();
//     const userData = resultsJson.results[0];
//     const user = new User({
//       displayName: `${userData.name.first} ${userData.name.last}`,
//       userName: userData.login.username,
//       stats: {
//         maxScores: {
//           worldEasy: randInt(1, 25000),
//           worldMedium: randInt(1, 25000),
//           worldHard: randInt(1, 25000),
//           northAmerica: randInt(1, 25000),
//           southAmerica: randInt(1, 25000),
//           africa: randInt(1, 25000),
//           europe: randInt(1, 25000),
//           asia: randInt(1, 25000),
//           oceania: randInt(1, 25000),
//         },
//         averageScores: {
//           worldEasy: randInt(5000, 20000),
//           worldMedium: randInt(5000, 20000),
//           worldHard: randInt(5000, 20000),
//           northAmerica: randInt(5000, 20000),
//           southAmerica: randInt(5000, 20000),
//           africa: randInt(5000, 20000),
//           europe: randInt(5000, 20000),
//           asia: randInt(5000, 20000),
//           oceania: randInt(5000, 20000),
//         },
//         completedGames: {
//           worldEasy: randInt(1, 500),
//           worldMedium: randInt(1, 500),
//           worldHard: randInt(1, 500),
//           northAmerica: randInt(1, 500),
//           southAmerica: randInt(1, 500),
//           africa: randInt(1, 500),
//           europe: randInt(1, 500),
//           asia: randInt(1, 500),
//           oceania: randInt(1, 500),
//         },
//       },
//       profilePicture: userData.picture.large,
//       country: userData.location.country,
//     });

//     let keys = Object.keys(user.stats.maxScores);
//     let overallMaxScore = parseInt(user.stats.maxScores[keys[0]]);
//     let overallMaxScoreMap = keys[0];
//     let totalCompletedGames = 0;
//     for (let i = 1; i < keys.length; i++) {
//       totalCompletedGames += parseInt(user.stats.completedGames[keys[i]]);
//       const currVal = parseInt(user.stats.maxScores[keys[i]]);
//       if (currVal > overallMaxScore) {
//         overallMaxScore = currVal;
//         overallMaxScoreMap = keys[i];
//       }
//     }

//     user.stats.completedGames.overall = totalCompletedGames;
//     user.stats.maxScores.overall = {
//       score: overallMaxScore,
//       map: overallMaxScoreMap,
//     };
//     user.stats.averageScores.overall = randInt(5000, 20000);
//     const currUser = await user.save();
//     users.push(currUser);
//   }
//   return users;
// };

const getLeaderboardForMap = async (map) => {
  var maxScoresForMap = {};
  maxScoresForMap["stats.maxScores." + map] = -1;
  let leaderboardData = await User.find().sort(maxScoresForMap).limit(25);
  return leaderboardData;
};

app.get("/getLeaderboard/", async (req, res) => {
  const leaderboardData = {};
  for (const map of mapNames) {
    leaderboardData[map] = await getLeaderboardForMap(map);
  }
  res.send(leaderboardData);
});

//Create :loopTimes number of bots.
// app.post("/createRandomUsers/:loopTimes", async (req, res) => {
//   const loopTimes = req.params.loopTimes;
//   const usersMade = await createRandomUsers(loopTimes);
//   res.send(usersMade);
// });

//Delete all bots from the database.
// app.get("/deleteBots", async (req, res) => {
//   await User.deleteMany({ "profilePicture": {$regex: 'https:\/\/randomuser.me\S*'} });
// });

//Store the user's new score for the given map. 
app.post("/newScore/:userSpotifyId/:map/:newScore", async (req, res) => {
  const userSpotifyId = req.params.userSpotifyId;
  const map = req.params.map;
  const newScore = Math.min(25000, parseInt(req.params.newScore));

  let userDoc = {};

  User.findOne({ userName: userSpotifyId }).then((newUser) => {
    userDoc = newUser;

    userDoc.stats.averageScores[map] = Math.floor(
      ((userDoc.stats.averageScores[map]
        ? userDoc.stats.averageScores[map]
        : 0) *
        (userDoc.stats.completedGames[map]
          ? userDoc.stats.completedGames[map]
          : 0) +
        newScore) /
        ((userDoc.stats.completedGames[map]
          ? userDoc.stats.completedGames[map]
          : 0) +
          1)
    );
    userDoc.stats.averageScores.overall = Math.floor(
      (userDoc.stats.averageScores.overall *
        userDoc.stats.completedGames.overall +
        newScore) /
        (userDoc.stats.completedGames.overall + 1)
    );

    userDoc.stats.completedGames[map] = userDoc.stats.completedGames[map]
      ? userDoc.stats.completedGames[map] + 1
      : 1;
    userDoc.stats.completedGames.overall += 1;

    if (
      !userDoc.stats.maxScores[map] ||
      newScore > userDoc.stats.maxScores[map]
    ) {
      console.log("SETTING NEW MAX SCORE ON MAP", map, newScore);
      userDoc.stats.maxScores[map] = newScore;
    }
    if (newScore > userDoc.stats.maxScores.overall.score) {
      console.log("SETTING NEW MAX SCORE OVERALL", newScore);
      userDoc.stats.maxScores.overall.score = newScore;
      userDoc.stats.maxScores.overall.map = map;
    }

    userDoc.markModified("stats");

    // mongoose.set("debug", true);

    userDoc.save().then((savedUserDoc) => {
      console.log(`Successfully saved ${userSpotifyId}'s new score!`);
      return res.json(savedUserDoc);
    });
  });
});

app.options("/", (req, res) => res.send());

let port = process.env.PORT || 8888;
console.log(
  `Listening on port ${port}.`
);
app.listen(port);
