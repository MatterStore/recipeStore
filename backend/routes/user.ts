import express from 'express';
import jwt from 'jsonwebtoken';

import validateParams from '../helpers/params-validator.js';
import Joi from 'joi';

import {
  authenticate,
  AuthenticatedRequest,
} from '../helpers/authentication.js';
import User, {
  addUser,
  comparePassword,
  getUserByEmail,
  updatePassword,
} from '../models/user.js';

const router = express.Router();

const errorLogger = {
  error: (err) => console.log(err),
};

const emailRegex =
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

router.post(
  '/signup',
  validateParams({
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(8).max(20).required(),
    name: Joi.string().min(2).max(40).required(),
  }),
  (req, res, next) => {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
    });

    getUserByEmail(newUser.email, (err, user) => {
      if (err) {
        errorLogger.error(err);
        return res
          .status(422)
          .json({ success: false, msg: 'Something went wrong.' });
      }
      if (user) {
        return res.status(422).json({
          success: false,
          msg: 'Email has already been registered with us.',
        });
      }

      addUser(newUser, (err) => {
        if (err) {
          errorLogger.error(err);
          return res.status(422).json({
            success: false,
            msg: 'Something went wrong.',
          });
        }
        res.status(200).json({
          success: true,
          msg: 'User registered successfully.',
        });
      });
    });
  }
);

router.post(
  '/login',
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
          .json({ success: false, msg: 'Something went wrong.' });
      }
      if (!emailUser) {
        return res
          .status(422)
          .json({ success: false, msg: 'Invalid credentials.' });
      }
      const finalUser = emailUser;
      comparePassword(password, finalUser.password, (err, isMatch) => {
        if (err) {
          errorLogger.error(err);
          return res
            .status(422)
            .json({ success: false, msg: 'Something went wrong.' });
        }
        if (!isMatch) {
          return res
            .status(422)
            .json({ success: false, msg: 'Invalid credentials.' });
        }

        const token = jwt.sign({ data: finalUser }, process.env.JWT_SECRET, {});
        res.status(200).json({
          msg: 'Logged in Successfully.',
          success: true,
          token: 'JWT ' + token,
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

router.get('/profile', authenticate(), (req: AuthenticatedRequest, res) => {
  res.status(200).json({ success: true, user: req.user });
});

router.post(
  '/update-password',
  authenticate(),
  validateParams({
    password: Joi.string().min(8).max(20).required(),
    confirmPassword: Joi.string().min(8).max(20).required(),
  }),
  (req: AuthenticatedRequest, res, next) => {
    const newPassword = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (newPassword != confirmPassword) {
      return res.status(422).json({
        success: false,
        msg: 'Both password fields do not match.',
      });
    }

    comparePassword(newPassword, req.user.password, (err, ok) => {
      if (ok) {
        res.status(422).json({
          success: false,
          msg: 'Current password matches with the new password.',
        });
      } else {
        updatePassword(req.user._id, newPassword, (err, ok) => {
          if (err) {
            res
              .status(422)
              .json({ success: false, msg: 'Something went wrong.' });
          } else {
            res.status(200).json({ success: true, msg: 'Password updated.' });
          }
        });
      }
    });
  }
);

export { router };
