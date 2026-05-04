import refreshTokenModel from "../refreshToken.model.js";

const findByRefreshToken = (refreshToken) => {
    return refreshTokenModel.findOne({ rf_refreshToken: refreshToken }).lean()
}

const deleteTokenById = (userId) => {
    return refreshTokenModel.deleteOne({ rf_user: userId }).lean()
}

const deleteTokenByToken = (refreshToken) => {
    return refreshTokenModel.findOneAndDelete({ rf_refreshToken: refreshToken });
}

export {
    findByRefreshToken,
    deleteTokenById,
    deleteTokenByToken
}