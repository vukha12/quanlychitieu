import jwt from "jsonwebtoken";
import "dotenv/config";
import { Authorization } from "../core/error.response.js";
import { ENV } from "../configs/env.js";

const checkAuth = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
        throw new Authorization(`Missing or invalid authorization header`);

    const token = authHeader.split(" ")[1];
    if (!token) throw new Authorization(`Missing token`);

    try {
        const decoded = verifyToken(token, ENV.JWT_ACCESS_TOKEN_SECRET_KEY);

        if (!decoded?.userId) throw new Authorization(`Invalid token payload`)

        req.user = decoded;

        return next();
    } catch (err) {
        console.error('verify error:', err.name, err.message)
        throw new Authorization(`Invalid or expired token`);
    }
}

const verifyToken = (token, key_secret) => {
    return jwt.verify(token, key_secret);
}

export {
    checkAuth,
    verifyToken
}