import refreshTokenModel from "../refreshToken.model.js";

const findByRefreshTokenUsed = (refreshToken) => {
    return refreshTokenModel.findOne({ rf_refreshTokensUser: refreshToken }).lean()
}

const findByRefreshToken = (refreshToken) => {
    return refreshTokenModel.findOne({ rf_refreshToken: refreshToken }).lean()
}

const deleteTokenById = (userId) => {
    return refreshTokenModel.deleteOne({ rf_user: userId }).lean()
}

export {
    findByRefreshTokenUsed,
    findByRefreshToken,
    deleteTokenById
}