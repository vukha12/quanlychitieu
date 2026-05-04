import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "RefreshToken";
const COLLECTION_NAME = "Refresh_tokens";

const refreshTokenSchema = new Schema({
    rf_user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    rf_refreshToken: {
        type: String,
        require: true
    },
    rf_expireAt: {
        type: Date,
        require: true,
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

refreshTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

export default model(DOCUMENT_NAME, refreshTokenSchema);