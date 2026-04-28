import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Category";
const COLLECTION_NAME = "Categories";

const categorySchema = new Schema({
    name: { type: String, require: true },
    color: { type: String },
    icon: { type: String },
    type: {
        type: String,
        require: true,
        enum: ['income', 'expense']
    }
}, {
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    },
    collection: COLLECTION_NAME,
})

export default model(DOCUMENT_NAME, categorySchema);