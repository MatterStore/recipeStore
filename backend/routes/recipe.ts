/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import Joi from 'joi';
import passport from 'passport';

import validateParams from '../helpers/params-validator.js';
import { AuthenticatedRequest, cmpObjectIds, RecordRequest, withRecord } from '../helpers/utils.js';

import Recipe, { deleteById, getAllPublic, getByUser, IRecipe } from '../models/recipe.js';
import Tag from '../models/tag.js';

type RecipeRequest = RecordRequest<IRecipe>;

const router = express.Router();
export default router;

router.post(
  '/new',
  passport.authenticate('user', { session: false }),
  validateParams({
    title: Joi.string().required(),
    cooking_time: Joi.string(),
    servings: Joi.number(),
    ingredients: Joi.array()
      .items(
        Joi.object({
          text: Joi.string().required(),
          name: Joi.string(),
          quantity: Joi.string(),
          unit: Joi.string()
        })
      )
      .required(),
    steps: Joi.array().items(Joi.string()).required(),
    tags: Joi.array().items(Tag.validator).required(),
    public: Joi.boolean()
  }),
  (req: AuthenticatedRequest, res, next) => {
    const recipe = new Recipe({
      user: req.user._id,
      title: req.body.title,
      cooking_time: req.body.cooking_time,
      servings: req.body.servings,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      tags: req.body.tags,
      public: req.body.public
    });

    recipe.save((err) => {
      if (err) {
        res.status(422).json({ success: false, msg: 'Something went wrong.' });
      } else {
        res.status(200).json({ success: true, msg: 'Recipe saved.' });
      }
    });
  }
);

router.get(
  '/all',
  passport.authenticate('user', { session: false }),
  (req: AuthenticatedRequest, res, next) => {
    getByUser(req.user._id, (err, list) => {
      if (err) {
        res.status(422).json({ success: false, msg: 'Something went wrong.' });
      } else {
        res.status(200).json({ success: true, msg: 'Recipes found.', list });
      }
    });
  }
);

router.get('/all/public', passport.authenticate('user', { session: false }), (req, res, next) => {
  getAllPublic((err, list: IRecipe[]) => {
    if (err) {
      res.status(422).json({ success: false, msg: 'Something went wrong.' });
    } else {
      res.status(200).json({ success: true, msg: 'Recipes found.', list });
    }
  });
});

router.get(
  '/:id',
  passport.authenticate('user', { session: false }),
  withRecord(Recipe),
  (req: RecipeRequest, res, next) => {
    const recipe = req.record;
    if (recipe.public || cmpObjectIds(req.user._id, recipe.user)) {
      res.status(200).json({ success: true, msg: 'Recipe found.', recipe });
    } else {
      res.status(403).json({
        success: false,
        msg: 'Permission not granted.'
      });
    }
  }
);

router.delete(
  '/:id',
  passport.authenticate('user', { session: false }),
  withRecord(Recipe, true),
  (req: RecipeRequest, res, next) => {
    const recipe = req.record;
    if (cmpObjectIds(req.user._id, recipe.user)) {
      // Recipe found and user has permissions to delete it,
      deleteById(req.params.id, (err, resp) => {
        if (err || !resp) {
          res.status(422).json({ success: false, msg: 'Something went wrong.' });
        } else {
          res.status(200).json({ success: true, msg: 'Recipe deleted.' });
        }
      });
    } else {
      res.status(403).json({
        success: false,
        msg: 'Permission not granted.'
      });
    }
  }
);

router.patch(
  '/:id',
  passport.authenticate('user', { session: false }),
  validateParams({
    title: Joi.string(),
    cooking_time: Joi.string(),
    servings: Joi.number(),
    ingredients: Joi.array().items(
      Joi.object({
        text: Joi.string().required(),
        name: Joi.string(),
        quantity: Joi.string(),
        unit: Joi.string()
      })
    ),
    steps: Joi.array().items(Joi.string()),
    tags: Joi.array().items(Tag.validator),
    public: Joi.boolean()
  }),
  withRecord(Recipe, true),
  (req: RecipeRequest, res) => {
    const updateableKeys = [
      'title',
      'cooking_time',
      'servings',
      'ingredients',
      'steps',
      'tags',
      'public'
    ];

    // Create object with the changes provided in the request.
    const update = {};
    updateableKeys.forEach((key) => {
      if (key in req.body && req.body[key] != req.record[key]) {
        update[key] = req.body[key];
      }
    });

    if (Object.keys(update).length > 0) {
      Recipe.updateOne({ _id: req.params.id }, update, (err) => {
        if (err) {
          res.status(500).json({ success: false, msg: 'An error occurred.' });
        } else {
          res.status(200).json({ success: true, msg: 'Recipe updated.' });
        }
      });
    } else {
      res.status(200).json({ success: true, msg: 'No updates needed.' });
    }
  }
);
