// require("dotenv").config({
//   path: `./.env.${process.env.NODE_ENV}`,
// });
require("./config/db-connection");

const path = require('path');
const express = require("express");
const expressSession = require("express-session");
const cors = require("cors");
const passport = require("passport");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  expressSession({
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);


// if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
  app.use(express.static("frontend/build"));
  app.get('*', (req, res) => {
  const buildPath = path.join(__dirname + '/../frontend/build/index.html')
  res.sendFile(buildPath);
  console.log(buildPath)
});
//  }

const users_route = require("./routes/user");

app.use("/user", users_route);

// default case for unmatched routes
app.use(function (req, res) {
  res.status(404);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`\nServer Started on ${port}`);
});
