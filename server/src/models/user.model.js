import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userSchema = new Schema({
    usr_name_display: { type: String, required: true },
    usr_email: { type: String, required: true },
    usr_password: { type: String, required: true, select: false },
    usr_avatar: { type: String, default: "" }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

export default model(DOCUMENT_NAME, userSchema);