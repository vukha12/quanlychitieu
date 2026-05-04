import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userSchema = new Schema({
    usr_name_display: { type: String, require: true },
    usr_email: { type: String, require: true },
    usr_password: { type: String, require: true, select: false },
    usr_avatar: { type: String, default: "" }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

export default model(DOCUMENT_NAME, userSchema);