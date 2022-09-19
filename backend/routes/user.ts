import express from "express";
const router = express.Router();
import passport from "passport";
import jwt from "jsonwebtoken";

import validateParams from "../helpers/params-validator.js";
import * as jwt_validator from "../helpers/user-jwt-validate.js";
import Joi from "joi";

import User, {
  addUser,
  comparePassword,
  getUserByEmail,
  updatePassword,
} from "../models/user.js";

const errorLogger = {
  error: (err) => console.log(err),
};

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

router.post(
  "/signup",
  validateParams({
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(8).max(20).required(),
    name: Joi.string().min(2).max(40).required(),
  }),
  (req, res, next) => {
    let newUser = new User({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
    });

    getUserByEmail(newUser.email, (err, user) => {
      if (err) {
        errorLogger.error(err);
        return res
          .status(422)
          .json({ success: false, msg: "Something went wrong." });
      }
      if (user) {
        return res.status(422).json({
          success: false,
          msg: "Email has already been registered with us.",
        });
      }

      addUser(newUser, (err) => {
        if (err) {
          errorLogger.error(err);
          return res.status(422).json({
            success: false,
            msg: "Something went wrong.",
          });
        }
        res.status(200).json({
          success: true,
          msg: "User registered successfully.",
        });
      });
    });
  }
);

router.post(
  "/login",
  validateParams({
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(8).max(20).required(),
  }),
  (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    getUserByEmail(email, (err, emailUser) => {
      if (err) {
        errorLogger.error(err);
        return res
          .status(422)
          .json({ success: false, msg: "Something went wrong." });
      }
      if (!emailUser) {
        return res
          .status(422)
          .json({ success: false, msg: "Invalid credentials." });
      }
      let finalUser = emailUser;
      comparePassword(password, finalUser.password, (err, isMatch) => {
        if (err) {
          errorLogger.error(err);
          return res
            .status(422)
            .json({ success: false, msg: "Something went wrong." });
        }
        if (!isMatch) {
          return res
            .status(422)
            .json({ success: false, msg: "Invalid credentials." });
        }

        const token = jwt.sign({ data: finalUser }, process.env.JWT_SECRET, {});
        res.status(200).json({
          msg: "Logged in Successfully.",
          success: true,
          token: "JWT " + token,
          user: {
            id: finalUser._id,
            email: finalUser.email,
            name: finalUser.studentName,
            admin: finalUser.admin,
          },
        });
      });
    });
  }
);

router.get(
  "/profile",
  passport.authenticate("user", { session: false }),
  (req: any, res, next) => {
    res.status(200).json({ success: true, user: req.user });
  }
);

router.post(
  "/update-password",
  validateParams({
    email: Joi.string().max(20).required(),
    currentPassword: Joi.string().max(20).required(),
    newPassword: Joi.string()
      .pattern(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&(=)<>.,/])[A-Za-z\d@$!%*#?&(=)<>.,/]{6,}$/
      )
      .max(20)
      .required(),
    newConfirmPassword: Joi.string().max(20).required(),
  }),
  (req, res, next) => {
    let user = jwt_validator.validateUserJWTToken(req.headers.authorization);
    if (!user)
      return res.status(422).json({ success: false, msg: "Invalid token." });

    const newUser = {
      email: req.body.email,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
      newConfirmPassword: req.body.newConfirmPassword,
    };

    if (newUser.newPassword != newUser.newConfirmPassword) {
      return res.status(422).json({
        success: false,
        msg: "Both password fields do not match.",
      });
    }

    if (newUser.currentPassword == newUser.newPassword) {
      return res.status(422).json({
        success: false,
        msg: "Current password matches with the new password.",
      });
    }

    getUserByEmail(newUser.email, (err, user) => {
      if (err) {
        return res
          .status(422)
          .json({ success: false, msg: "Something went wrong." });
      }
      if (!user) {
        return res.status(404).json({ success: false, msg: "User not found." });
      }
      comparePassword(
        newUser.currentPassword,
        user.password,
        (err, isMatch) => {
          if (err) {
            errorLogger.error(err);

            return res
              .status(422)
              .json({ success: false, msg: "Something went wrong." });
          }
          if (!isMatch) {
            return res
              .status(422)
              .json({ success: false, msg: "Incorrect password." });
          }
          updatePassword(newUser, (err) => {
            if (err) {
              errorLogger.error(err);
              return res
                .status(422)
                .json({ success: false, msg: "Something went wrong." });
            }
            return res
              .status(200)
              .json({ success: true, msg: "Password updated." });
          });
        }
      );
    });
  }
);

export { router };
