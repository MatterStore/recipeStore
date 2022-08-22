require("dotenv").config({
  path: `./.env.${process.env.NODE_ENV}`,
});
require("./config/db-connection");

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

const users_route = require("./routes/user");

app.use("/user", users_route);

const recipes_route = require("./routes/recipe");

app.use("/recipes", recipes_route);

// default case for unmatched routes
app.use(function (req, res) {
  res.status(404).send();
});

const port = process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`\nServer Started on ${port}`);
});
