import Joi from "joi";
import lodash from "lodash";
import mongoose from "mongoose";

export default function validateParams(paramSchema) {
  return async (req, res, next) => {
    const schema = Joi.object().keys(paramSchema);
    const paramSchemaKeys = Object.keys(paramSchema);
    let requestParamObj = {};
    for (let key of paramSchemaKeys) {
      requestParamObj[key] = lodash.get(req.body, key);
    }
    try {
      await schema.validateAsync(requestParamObj);
    } catch (err) {
      return res.status(422).json({
        success: false,
        msg: err.details[0].message, // Something went wrong.
      });
    }
    next();
  };
}

export function objectId() {
  return Joi.string().custom((value, helper) => {
    if (!mongoose.isValidObjectId(value)) {
      return helper.message({
        custom: `${value} is not a valid MongoDB ObjectID.`,
      });
    } else {
      return true;
    }
  });
}
