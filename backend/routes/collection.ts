import express, { NextFunction, Request, Response } from "express";
import Joi from "joi";
import passport from "passport";

import validateParams, { objectId } from "../helpers/params-validator.js";

import Collection, {
  deleteById,
  getByUser,
  ICollection,
} from "../models/collection.js";
import Tag from "../models/tag.js";
import {
  AuthenticatedRequest,
  cmpObjectIds,
  includesObjectId,
  RecordRequest,
  withRecord,
} from "../helpers/utils.js";

type CollectionRequest = RecordRequest<ICollection>;

const router = express.Router();
export default router;

router.post(
  "/new",
  passport.authenticate("user", { session: false }),
  validateParams({
    name: Joi.string().max(255).required(),
    tags: Joi.array().items(Tag.validator).required(),
    recipes: Joi.array().items(objectId()).required(),
    public: Joi.boolean(),
  }),
  async (req: AuthenticatedRequest, res) => {
    let collection = new Collection({
      user: req.user._id,
      name: req.body.name,
      tags: req.body.tags,
      recipes: req.body.recipes,
      public: req.body?.public,
    });

    collection.save((err) => {
      if (err) {
        res.status(422).json({ success: false, msg: "Something went wrong." });
      } else {
        res.status(200).json({ success: true, msg: "Collection saved." });
      }
    });
  }
);

router.get(
  "/all",
  passport.authenticate("user", { session: false }),
  (req: AuthenticatedRequest, res) => {
    getByUser(req.user._id, (err, list) => {
      if (err) {
        res.status(500).json({ success: false, msg: "Something went wrong." });
      } else {
        res
          .status(200)
          .json({ success: true, msg: "Collections found.", list });
      }
    });
  }
);

router.get("/all/public", (req, res) => {});

router.get(
  "/:id",
  passport.authenticate("user", { session: false }),
  withRecord(Collection),
  (req: CollectionRequest, res) => {
    let collection = req.record;
    if (collection.public || cmpObjectIds(req.user._id, collection.user)) {
      res
        .status(200)
        .json({ success: true, msg: "Collection found.", collection });
    } else {
      res.status(403).json({ success: false, msg: "Permission not granted." });
    }
  }
);

router.delete(
  "/:id",
  passport.authenticate("user", { session: false }),
  withRecord(Collection, true),
  (req: CollectionRequest, res) => {
    deleteById(req.params.id, (err) => {
      if (err) {
        res.status(500).json({
          success: false,
          msg: "Something went wrong.",
        });
      } else {
        res.status(200).json({
          success: true,
          msg: "Collection deleted.",
        });
      }
    });
  }
);

router.patch(
  "/:id",
  passport.authenticate("user", { session: false }),
  withRecord(Collection, true),
  (req: CollectionRequest, res) => {}
);

router.post(
  "/:id/add",
  validateParams({
    recipes: Joi.array().items(objectId()),
  }),
  passport.authenticate("user", { session: false }),
  withRecord(Collection, true),
  (req: CollectionRequest, res) => {
    let collection = req.record;

    let added = false;
    req.body.recipes.forEach((recipe: string) => {
      if (!collection.recipes.includes(recipe)) {
        collection.recipes.push(recipe);
        added = true;
      }
    });

    if (added) {
      Collection.updateOne(
        { _id: collection._id },
        { $set: { recipes: collection.recipes } },
        (err) => {
          if (err) {
            res
              .status(500)
              .json({ success: false, msg: "Something went wrong." });
          } else {
            res.status(200).json({
              success: true,
              msg: "Recipes added to collection.",
            });
          }
        }
      );
    } else {
      res.status(200).json({
        success: true,
        msg: "All recipes already in collection.",
      });
    }
  }
);

router.post(
  "/:id/remove",
  validateParams({
    recipes: Joi.array().items(objectId()),
  }),
  passport.authenticate("user", { session: false }),
  withRecord(Collection, true),
  (req: CollectionRequest, res) => {
    let collection = req.record;

    let len = collection.recipes.length;
    collection.recipes = collection.recipes.filter(
      (r) => !includesObjectId(req.body.recipes, r)
    );

    if (collection.recipes.length == len) {
      res.status(200).json({
        success: true,
        msg: "None of these recipes were in this collection.",
      });
    } else {
      Collection.updateOne(
        { _id: collection._id },
        { $set: { recipes: collection.recipes } },
        (err) => {
          if (err) {
            res
              .status(500)
              .json({ success: false, msg: "Something went wrong." });
          } else {
            res.status(200).json({
              success: true,
              msg: "Recipes removed from collection.",
            });
          }
        }
      );
    }
  }
);
