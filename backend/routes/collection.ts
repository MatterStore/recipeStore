import express from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import passport from 'passport';

import validateParams from '../helpers/params-validator';

import Collection, { deleteById, getById, getByUser } from '../models/collection';
import Tag from '../models/tag';

const router = express.Router();
export default router;

router.post(
    "/new",
    passport.authenticate("user", { session: false }),
    validateParams({
        name: Joi.string().max(255).required(),
        tags: Joi.array().items(Tag.validator).required(),
        recipes: Joi.array().items(Joi.string()).required(),
        public: Joi.boolean()
    }),
    async (req, res) => {
        for (let id of req.body.recipes) {
            if (!mongoose.isValidObjectId(id)) {
                return res
                    .status(422)
                    .json({ success: false, msg: `Invalid recipe ID: ${id}`});
            }
        }

        let collection = new Collection({
            user: (req as any).user.id,
            name: req.body.name,
            tags: req.body.tags,
            recipes: req.body.recipes,
            public: req.body?.public
        });

        collection.save(err => {
            if (err) {
                res
                    .status(422)
                    .json({ success: false, msg: "Something went wrong." });
            } else {
                res
                    .status(200)
                    .json({ success: true, msg: "Collection saved." });
            }
        });
    }
);

router.get(
    "/all",
    passport.authenticate("user", { session: false }),
    (req, res) => {
        getByUser((req as any).user.id, (err, list) => {
            if (err) {
                res
                    .status(500)
                    .json({ success: false, msg: "Something went wrong." });
            } else {
                res
                    .status(200)
                    .json({ success: true, msg: "Collections found.", list });
            }
        });
    }
);

router.get(
    "/:id",
    passport.authenticate("user", { session: false }),
    (req, res) => {
        getById(req.params.id, (err, collection) => {
            if (err) {
                res
                    .status(422)
                    .json({ success: false, msg: "Something went wrong." });
            } else if (!collection) {
                res
                    .status(404)
                    .json({ success: false, msg: "Recipe not found." });
            } else if (collection.public || (req as any).user.id == collection.user) {
                res
                    .status(200)
                    .json({ success: true, msg: "Recipe found.", collection });
            }  else {
                res
                    .status(403)
                    .json({ success: false, msg: "Permission not granted." });
            }
        })
    }
);

router.post(
    "/:id/delete",
    passport.authenticate("user", { session: false }),
    (req, res) => {
        getById(req.params.id, (err, collection) => {
            if (err) {
                res
                    .status(422)
                    .json({ success: false, msg: "Something went wrong." });
            } else if (!collection) {
                res
                    .status(404)
                    .json({ success: false, msg: "Recipe not found." });
            } else if ((req as any).user.id != collection.user) {
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
                                msg: "Collection deleted."
                            });
                    }
                })
            }
        });
    }
)
