import UserService from "../services/user.service.js";
import { CREATED, SuccessResponse } from "../core/success.response.js";

const refreshToken = async (req, res) => {

    const { refreshToken } = req.cookies;

    const result = await UserService.handleRefreshToken({ refreshToken });

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    })

    new SuccessResponse({
        message: "Refresh token successfully",
        metadata: {
            accessToken: result.accessToken,
        }
    }).send(res);
}

const signIn = async (req, res) => {

    const result = await UserService.login(req.body);

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    })

    new SuccessResponse({
        message: "User logged in successfully",
        metadata: {
            user: result.user,
            accessToken: result.accessToken
        }
    }).send(res);
}

const register = async (req, res) => {
    new CREATED({
        message: "User registered successfully",
        metadata: await UserService.signUp(req.body)
    }).send(res);
}

export default {
    signIn,
    register,
    refreshToken
}