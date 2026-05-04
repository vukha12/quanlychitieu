import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Category";
const COLLECTION_NAME = "Categories";

const categorySchema = new Schema({
    cte_name: { type: String, require: true },
    cte_color: { type: String },
    cte_icon: { type: String },
    cte_type: {
        type: String,
        require: true,
        enum: ['income', 'expense'],
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

export default model(DOCUMENT_NAME, categorySchema);