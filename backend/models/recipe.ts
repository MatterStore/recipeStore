import pkg, { ObjectId } from 'mongoose';
const { Schema, Types, model } = pkg;

export interface IRecipe {
  user: ObjectId;
  title: string;
  cooking_time?: string;
  servings?: number;
  ingredients: {
    text: string;
    name?: string;
    quantity?: string;
    unit?: string;
  }[];
  steps: string[];
  tags: string[];
  public?: boolean;
}

const recipeSchema = new Schema({
  user: {
    type: Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  time: {
    type: {
      minutes: {
        type: String,
        required: false,
      },
      hours: {
        type: String,
        required: false,
      },
    },
    required: false,
  },
  servings: {
    type: Number,
    required: false,
  },
  ingredients: {
    type: [
      {
        text: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: false,
        },
        quantity: {
          type: String,
          required: false,
        },
        unit: {
          type: String,
          required: false,
        },
      },
    ],
    required: true,
  },
  steps: {
    type: [String],
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  public: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const Recipe = model('Recipe', recipeSchema);

export default Recipe;

export function getById(id, callback) {
  Recipe.findOne({ _id: id }, callback);
}

export function deleteById(id: string, callback) {
  Recipe.deleteOne({ _id: id }, callback);
}

export function getByUser(user, callback) {
  Recipe.find({ user }, callback);
}

export function getAllPublic(callback) {
  Recipe.find({ public: true }, callback);
}
