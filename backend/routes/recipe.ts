import express from 'express';
import Joi from 'joi';

import {
  authenticate,
  AuthenticatedRequest,
} from '../helpers/authentication.js';
import validateParams from '../helpers/params-validator.js';
import Recipe, {
  deleteById,
  getAllPublic,
  getByUser,
  IRecipe,
} from '../models/recipe.js';
import Tag from '../models/tag.js';
import { cmpObjectIds, RecordRequest, withRecord } from '../helpers/utils.js';
import { ensureUploaded } from '../helpers/aws.js';

type RecipeRequest = RecordRequest<IRecipe>;

const router = express.Router();
export default router;

router.post(
  '/new',
  authenticate(),
  validateParams({
    title: Joi.string().required(),
    time: Joi.object({ hours: Joi.number(), minutes: Joi.number() }),
    servings: Joi.number(),
    ingredients: Joi.array()
      .items(
        Joi.object({
          text: Joi.string().required(),
          name: Joi.string(),
          quantity: Joi.string(),
          unit: Joi.string(),
        })
      )
      .required(),
    steps: Joi.array().items(Joi.string()).required(),
    tags: Joi.array().items(Tag.validator).required(),
    public: Joi.boolean(),
    images: Joi.array().items(Joi.string()).required(),
  }),
  (req: AuthenticatedRequest, res, next) => {
    const recipe = new Recipe({
      user: req.user._id,
      title: req.body.title,
      time: req.body.time,
      servings: req.body.servings,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      tags: req.body.tags,
      public: req.body.public,
      images: req.body.images,
    });

    let waitingFor = recipe.images.length + 1;
    const done = () => {
      if (--waitingFor <= 0) {
        recipe.save((err, resp) => {
          if (err) {
            res
              .status(422)
              .json({ success: false, msg: 'Something went wrong.' });
          } else {
            res
              .status(200)
              .json({ success: true, msg: 'Recipe saved.', id: resp._id });
          }
        });
      }
    };

    // Ensure all recipes uploaded.
    recipe.images.forEach((url, i) =>
      ensureUploaded(url, (newUrl, err) => {
        // Fallback: keep original URL
        if (!err) {
          recipe.images[i] = newUrl;
        }
        done();
      })
    );
    done();
  }
);

router.get('/all', authenticate(), (req: AuthenticatedRequest, res, next) => {
  getByUser(req.user._id, (err, list) => {
    if (err) {
      res.status(422).json({ success: false, msg: 'Something went wrong.' });
    } else {
      res.status(200).json({ success: true, msg: 'Recipes found.', list });
    }
  });
});

router.get('/all/public', authenticate(), (req, res, next) => {
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
  authenticate(),
  withRecord(Recipe),
  (req: RecipeRequest, res, next) => {
    const recipe = req.record;
    if (recipe.public || cmpObjectIds(req.user._id, recipe.user)) {
      res.status(200).json({ success: true, msg: 'Recipe found.', recipe });
    } else {
      res.status(403).json({
        success: false,
        msg: 'Permission not granted.',
      });
    }
  }
);

router.delete(
  '/:id',
  authenticate(),
  withRecord(Recipe, true),
  (req: RecipeRequest, res, next) => {
    const recipe = req.record;
    if (cmpObjectIds(req.user._id, recipe.user)) {
      // Recipe found and user has permissions to delete it,
      deleteById(req.params.id, (err, resp) => {
        if (err || !resp) {
          res
            .status(422)
            .json({ success: false, msg: 'Something went wrong.' });
        } else {
          res.status(200).json({ success: true, msg: 'Recipe deleted.' });
        }
      });
    } else {
      res.status(403).json({
        success: false,
        msg: 'Permission not granted.',
      });
    }
  }
);

router.patch(
  '/:id',
  authenticate(),
  validateParams({
    title: Joi.string(),
    time: Joi.object({ hours: Joi.number(), minutes: Joi.number() }),
    servings: Joi.number(),
    ingredients: Joi.array().items(
      Joi.object({
        text: Joi.string().required(),
        name: Joi.string(),
        quantity: Joi.string(),
        unit: Joi.string(),
      })
    ),
    steps: Joi.array().items(Joi.string()),
    tags: Joi.array().items(Tag.validator),
    public: Joi.boolean(),
    images: Joi.array().items(Joi.string()),
  }),
  withRecord(Recipe, true),
  (req: RecipeRequest, res) => {
    const updateableKeys = [
      'title',
      'time',
      'servings',
      'ingredients',
      'steps',
      'tags',
      'public',
      'images',
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
