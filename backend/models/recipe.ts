import pkg from 'mongoose';
const { Schema, Types, model } = pkg;
const recipeSchema = new Schema({
    user: {
        type: Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    cooking_time: {
        type: String,
        required: false,
    },
    servings: {
        type: Number,
        required: false,
    },
    ingredients: {
        type: [{
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
            }
        }],
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
    }
});

const Recipe = model("Recipe", recipeSchema);

export {
    Recipe
}

export function getById(id, callback) {
    Recipe.findOne({ _id: id }, callback)
};

export function getByUser (user, callback) {
    Recipe.find({ user }, callback)
};
