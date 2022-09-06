import pkg from 'mongoose';
const { Schema, Types, model } = pkg;

export interface ICollection {
    id: string,
    user: string,
    name: string,
    tags: Array<string>,
    recipes: Array<string>,
    public?: boolean
}

const collectionSchema = new Schema({
    user: {
        type: Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        required: true,
    },
    recipes: {
        type: [Types.ObjectId],
        required: true,
    },
    public: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const Collection = model("Collection", collectionSchema);
export default Collection;

export function getByUser(user: string, callback) {
    Collection.find({ user }, callback);
}

export function getById(
    id: string,
    callback: (err: any, collection?: ICollection) => void
) {
    Collection.find({ _id: id }, callback);
}

export function deleteById(id: string, callback) {
    Collection.deleteOne({ _id: id }, callback);
}
