import userModel from "../user.model.js";

const findUserByName = async ({ name }) => {
    return userModel.findOne({ usr_email: name }).select("+usr_password").lean();
}

export {
    findUserByName
}