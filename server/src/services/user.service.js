import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import ms from "ms";
import userModel from "../models/user.model.js";
import refreshTokenModel from "../models/refreshToken.model.js";
import { findUserByName } from "../models/repositories/user.repo.js";
import {
    findByRefreshToken,
    deleteTokenById,
    deleteTokenByToken
} from "../models/repositories/refreshToken.repo.js";
import { BadRequestError, AuthFailureError, NotFoundError } from "../core/error.response.js";
import { getDataInfo } from "../helpers/index.js";
import { ENV } from "../configs/env.js";

const handleLogout = async (refreshToken) => {
    if (!refreshToken) throw new NotFoundError("Token invalid!!!");

    await deleteTokenByToken(refreshToken);

    return true;
}

const handleRefreshToken = async (refreshToken) => {
    if (!refreshToken) throw new NotFoundError("Refresh token not found!!!");

    const holderToken = await findByRefreshToken(refreshToken);
    if (!holderToken) throw new NotFoundError("Not found refresh token!");

    try {
        const decoded = jwt.verify(refreshToken, ENV.JWT_REFRESH_TOKEN_SECRET_KEY);

        const accessToken = jwt.sign(
            { userId: decoded.userId },
            ENV.JWT_ACCESS_TOKEN_SECRET_KEY,
            { expiresIn: ENV.JWT_ACCESS_TOKEN_EXPIRES_IN }
        )

        const newRefreshToken = jwt.sign(
            { userId: decoded.userId },
            ENV.JWT_REFRESH_TOKEN_SECRET_KEY,
            { expiresIn: ENV.JWT_REFRESH_TOKEN_EXPIRES_IN }
        )

        await deleteTokenById(decoded.userId);
        await refreshTokenModel.create({
            rf_user: decoded.userId,
            rf_refreshToken: newRefreshToken,
            rf_expireAt: new Date(Date.now() + ms(ENV.JWT_REFRESH_TOKEN_EXPIRES_IN))
        })

        return {
            accessToken,
            refreshToken: newRefreshToken
        };
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
            await deleteTokenById(userId);
            throw new AuthFailureError("Invalid refresh token");
        }
        throw error;
    }
}

const login = async ({ name, password }) => {
    // 1. validate params
    if (!name || !password) throw new BadRequestError("Missing required parameters");

    // 2. check name exists
    const user = await findUserByName({ name });
    if (!user) throw new BadRequestError(`User or password is incorrect`);

    // 3. compare password
    const isPasswordValid = await bcrypt.compare(password, user.usr_password);
    if (!isPasswordValid) throw new AuthFailureError(`Authentication error`);

    const { _id: userId } = user;

    const accessToken = jwt.sign(
        {
            userId
        },
        ENV.JWT_ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn: ENV.JWT_ACCESS_TOKEN_EXPIRES_IN
        }
    )

    const refreshToken = jwt.sign(
        {
            userId
        },
        ENV.JWT_REFRESH_TOKEN_SECRET_KEY,
        {
            expiresIn: ENV.JWT_REFRESH_TOKEN_EXPIRES_IN
        }
    )

    await refreshTokenModel.create({
        rf_user: userId,
        rf_refreshToken: refreshToken,
        rf_expireAt: new Date(Date.now() + ms(ENV.JWT_REFRESH_TOKEN_EXPIRES_IN))
    })

    return {
        user: getDataInfo(user, ["_id", "usr_name_display", "usr_email"]),
        accessToken,
        refreshToken
    }
}

const signUp = async (payload) => {

    const { name_display, name, password, avatar = "" } = payload;

    // 1. validate params
    if (!name_display || !name || !password) throw new BadRequestError("Missing required parameters");

    // 2. check name exists
    const existingUser = await findUserByName({ name });
    if (existingUser) throw new BadRequestError(`User already exists`);

    // 3. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. create user
    const newUser = await userModel.create({
        usr_name_display: name_display,
        usr_email: name,
        usr_password: hashedPassword,
        usr_avatar: avatar
    })

    const token = jwt.sign(
        {
            userId: newUser._id
        },
        ENV.JWT_ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn: ENV.JWT_ACCESS_TOKEN_EXPIRES_IN
        })

    return {
        user: getDataInfo(newUser, ["_id", "usr_name_display", "usr_email"]),
        token
    }
}

export default {
    signUp,
    login,
    handleRefreshToken,
    handleLogout
}