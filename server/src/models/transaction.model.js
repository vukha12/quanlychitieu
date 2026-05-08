import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Transaction";
const COLLECTION_NAME = "Transactions";

const transactionSchema = new Schema({
    trans_user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    trans_category: { type: mongoose.Types.ObjectId, ref: 'Category', required: true },
    trans_amount: { type: Number, required: true },
    trans_date: { type: Date, default: Date.now },
    trans_note: { type: String },
    trans_type: {
        type: String,
        required: true,
        enum: ['income', 'expense'],
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

export default model(DOCUMENT_NAME, transactionSchema)