const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
    user: {
        type: mongoose.ObjectId,
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

const Recipe = (module.exports = mongoose.model("Recipe", recipeSchema));

module.exports.getById = function (id, callback) {
    Recipe.findOne({ _id: id }, callback)
};

module.exports.getByUser = function (user, callback) {
    Recipe.find({ user }, callback)
};
