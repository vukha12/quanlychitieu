import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Transaction";
const COLLECTION_NAME = "Transactions";

const transactionSchema = new Schema({
    trans_user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trans_category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    trans_categorySnapshot: { name: String, icon: String, parentId: String },
    trans_amount: {
        type: Number,
        required: true,
        min: [1000, 'Số tiền tối thiể 1,000đ'],
        max: [100_000_000_000, 'Số tiền tối đa 100 tỷ đồng'],
        validate: {
            validator: Number.isFinite,
            message: 'Số tiền không hợp lệ'
        }
    },
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