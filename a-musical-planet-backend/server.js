let express = require("express");
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
let request = require("request");
let querystring = require("querystring");
const bcrypt = require("bcryptjs");

require("dotenv").config();

let app = express();

let redirect_uri = process.env.REDIRECT_URI || "http://localhost:8888/callback";

const mongoURI = "mongodb://localhost:27017/sessions";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("MongoDB Connected");
  });

const store = new MongoDBSession({
  uri: mongoURI,
  collection: "mySessions",
});

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
        "?refresh_token=" +
        req.session.user.refresh_token
    );
  }
  if (
    req.session.user &&
    req.session.user.refresh_token &&
    req.session.user.refresh_token !== ""
  ) {
    console.log("Refreshing token");
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
              "?refresh_token=" +
              refresh_token
          );
        }
      );
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
  console.log("Refreshing token");
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
            "?refresh_token=" +
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
        req.session.user = {
          id: JSON.parse(body).id,
          access_token,
          refresh_token,
        };
        return res.redirect(
          uri +
            "?access_token=" +
            access_token +
            "?refresh_token=" +
            refresh_token
        );
      }
    );
  });
});

let port = process.env.PORT || 8888;
console.log(
  `Listening on port ${port}. Go /login to initiate authentication flow.`
);
app.listen(port);
