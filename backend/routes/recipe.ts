import express, { Router } from "express";
import Joi from "joi";
import passport from "passport";

import validateParams from "../helpers/params-validator.js";

import Recipe, { deleteById, getById, getByUser } from "../models/recipe.js";
import Tag from "../models/tag.js";

const router = express.Router();
export default router;

router.post(
    "/new",
    passport.authenticate("user", { session: false }),
    validateParams({
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
        tags: Joi.array().items(Tag.validator).required(),
        public: Joi.boolean()
    }),
    (req, res, next) => {
        let recipe = new Recipe({
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
        getByUser((req as any).user.id, (err, list) => {
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
        getById(req.params.id, (err, recipe) => {
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

router.delete(
    "/:id",
    passport.authenticate("user", { session: false }),
    (req, res, next) => {
        deleteById(req.params.id, (err, recipe) => {
            if (err) {
                res
                    .status(422)
                    .json({ success: false, msg: "Something went wrong." });
            } else if (!recipe) {
                res
                    .status(404)
                    .json({ success: false, msg: "Recipe not found." });
            } else if ((req as any).user.id != recipe.user) {
                res
                    .status(403)
                    .json({
                        success: false,
                        msg: "Recipe belongs to another user."
                    });
            } else {
                deleteById(req.params.id, err => {
                    if (err) {
                        res
                            .status(500)
                            .json({
                                success: false,
                                msg: "Something went wrong."
                            });
                    } else {
                        res
                            .status(200)
                            .json({
                                success: true,
                                msg: "Recipe deleted."
                            });
                    }
                })
            }
        })
    }
);