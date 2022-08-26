import express from "express";
import Joi from "joi";
import passport from "passport";

import * as params_validator from "../helpers/params-validator.js";

import * as Recipe from "../models/recipe.js";

import User from "../models/user.js";

const router = express.Router();

router.post(
    "/new",
    passport.authenticate("user", { session: false }),
    params_validator.validateParams({
        title: Joi.string().required(),
        cooking_time: Joi.string(),
        servings: Joi.number(),
        ingredients: Joi.array().items(
            Joi.object({
                text: Joi.string().required(),
                name: Joi.string(),
                quantity: Joi.string(),
                unit: Joi.string()
            })
        ).required(),
        steps: Joi.array().items(Joi.string()).required(),
        tags: Joi.array().items(Joi.string()).required(),
        public: Joi.boolean()
    }),
    (req, res, next) => {
        let recipe = new Recipe.Recipe({
            user: (req as any).user.id,
            title: req.body.title,
            cooking_time: req.body.cooking_time,
            servings: req.body.servings,
            ingredients: req.body.ingredients,
            steps: req.body.steps,
            tags: req.body.tags,
            public: req.body.public
        });

        recipe.save(err => {
            if (err) {
                res
                    .status(422)
                    .json({ success: false, msg: "Something went wrong." });
            } else {
                res
                    .status(200)
                    .json({ success: true, msg: "Recipe saved." });
            }
        });
    }
);

router.get(
    "/all",
    passport.authenticate("user", { session: false }),
    (req, res, next) => {
        Recipe.getByUser((req as any).user.id, (err, list) => {
            if (err) {
                res
                    .status(422)
                    .json({ success: false, msg: "Something went wrong." });
            } else {
                res
                    .status(200)
                    .json({ sucess: true, msg: "Recipes found.", list });
            }
        });
    }
);

router.get(
    "/:id",
    passport.authenticate("user", { session: false }),
    (req, res, next) => {
        Recipe.getById(req.params.id, (err, recipe) => {
            if (err) {
                res
                    .status(422)
                    .json({ success: false, msg: "Something went wrong." });
            } else if (!recipe) {
                res
                    .status(404)
                    .json({ success: false, msg: "Recipe not found." });
            } else if (recipe.public || (req as any).user.id == recipe.user) {
                res
                    .status(200)
                    .json({ success: true, msg: "Recipe found.", recipe });
            }  else {
                res
                    .status(403)
                    .json({
                        success: false,
                        msg: "Permission not granted."
                    });
            }
        })
    }
);

export default router;
