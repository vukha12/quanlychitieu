import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Transaction";
const COLLECTION_NAME = "Transactions";

const transactionSchema = new Schema({
    trans_user: { type: mongoose.Types.ObjectId, ref: 'User', require: true },
    trans_category: { type: mongoose.Types.ObjectId, ref: 'Category', require: true },
    trans_amount: { type: Number, require: true },
    trans_date: { type: Date, default: Date.now },
    trans_note: { type: String },
    trans_type: {
        type: String,
        require: true,
        enum: ['income', 'expense'],
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

export default model(DOCUMENT_NAME, transactionSchema)