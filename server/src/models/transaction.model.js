import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Transaction";
const COLLECTION_NAME = "Transactions";

const transactionSchema = new Schema({
    cate: { type: mongoose.Types.ObjectId, ref: 'Category', require: true },
    amount: { type: Number, require: true },
    date: { type: Date, default: Date.now },
    note: { type: String },
}, {
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    },
    collection: COLLECTION_NAME,
})

export default model(DOCUMENT_NAME, transactionSchema)