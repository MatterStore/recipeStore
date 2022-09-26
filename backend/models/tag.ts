import Joi from 'joi';

const MIN_LENGTH = 2;
const MAX_LENGTH = 32;

const Tag = {
  MIN_LENGTH,
  MAX_LENGTH,
  validator: Joi.string().min(MIN_LENGTH).max(MAX_LENGTH),
};
export default Tag;
