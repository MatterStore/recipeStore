import dotenv from "dotenv";
const result = dotenv.config({
  path: `.env`,
});

import "./config/db-connection.js";
import path from "path";
import express from "express";
import expressSession from "express-session";
import cors from "cors";
import passport from "passport";
import { fileURLToPath } from "url";
import * as users_route from "./routes/user.js";
import collectionsRoute from "./routes/collection.js";
import recipesRoute from "./routes/recipe.js";

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
execPassport(passport);

const __filename = fileURLToPath(import.meta.url + "/../../");
const __dirname = path.dirname(__filename);
console.log(__dirname);
if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.use(express.static(path.resolve(__dirname, "frontend/build")));
  app.get("*", (req, res) => {
    const buildPath = path.join(
      path.resolve(__dirname, "frontend/build/index.html")
    );
    res.sendFile(buildPath);
    console.log(buildPath);
  });
}

app.use("/user", users_route.router);
app.use("/collections", collectionsRoute);
app.use("/recipes", recipesRoute);

// default case for unmatched routes
app.use(function (req, res) {
  res.status(404).send();
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`\nServer Started on ${port}`);
});

export default app;
