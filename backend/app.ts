import dotenv from "dotenv"
const result = dotenv.config({
  path: `.env`,
});
if (result.error) {
  throw result.error;
}

import "./config/db-connection.js";
import path from 'path';
import express from "express";
import expressSession from "express-session";
import cors from "cors";
import passport from "passport";

import * as users_route from "./routes/user.js";

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
import execPassport from "./config/passport.js";
execPassport(passport)

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
  app.use(express.static("frontend/build"));
  app.get('*', (req, res) => {
    const buildPath = path.join(__dirname + '/../frontend/build/index.html')
    res.sendFile(buildPath);
    console.log(buildPath)
  });
}


app.use("/user", users_route.router);

import recipes_route from "./routes/recipe.js";

app.use("/recipes", recipes_route);

// default case for unmatched routes
app.use(function (req, res) {
  res.status(404).send();
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`\nServer Started on ${port}`);
});

export default app;
