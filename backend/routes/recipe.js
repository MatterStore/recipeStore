const express = require("express");
const Joi = require("joi");
const passport = require("passport");

const params_validator = require("../helpers/params-validator");
const jwt_validator = require("../helpers/user-jwt-validate");

const Recipe = require("../models/recipe");

const router = express.Router();

router.post(
    "/new",
    passport.authenticate("user", { session: false }),
    params_validator.validateParams({
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
        let recipe = new Recipe({
            user: req.user._id,
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
                    .json({ success: false, msg: "AA Something went wrong." });
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
        Recipe.getByUser(req.user.id, (err, list) => {
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
    (req, res, next) => {
        Recipe.getById(req.params.id, (err, recipe) => {
            if (err) {
                return res
                    .status(422)
                    .json({ success: false, msg: "Something went wrong." });
            } else if (!recipe) {
                return res
                    .status(404)
                    .json({ success: false, msg: "Recipe not found." });
            } else if (recipe.public) {
                return res
                    .status(200)
                    .json({ success: true, msg: "Recipe found.", recipe });
            } else {
                let user = jwt_validator.validateUserJWTToken(
                    req.headers.authorization
                );
                if (!user) {
                    return res
                        .status(422)
                        .json({ success: false, msg: "Invalid token." });
                } else if (recipe.user === user._id) {
                    return res
                        .status(200)
                        .json({ success: true, msg: "Recipe found.", recipe });
                } else {
                    return res
                        .status(403)
                        .json({
                            success: false,
                            msg: "Permission not granted."
                        });
                }
            }
        })
    }
);

module.exports = router;
