import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Category";
const COLLECTION_NAME = "Categories";

const categorySchema = new Schema({
    cte_user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cte_name: { type: String, required: true },
    cte_color: { type: String },
    cte_icon: { type: String },
    cte_parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

export default model(DOCUMENT_NAME, categorySchema);