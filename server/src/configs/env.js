import "dotenv/config";

const required = [
    'JWT_ACCESS_TOKEN_SECRET_KEY',
    'JWT_REFRESH_TOKEN_SECRET_KEY',
    'JWT_ACCESS_TOKEN_EXPIRES_IN',
    'JWT_REFRESH_TOKEN_EXPIRES_IN',
]

required.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required env variable: ${key}`)
    }
})

export const ENV = {
    JWT_ACCESS_TOKEN_SECRET_KEY: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    JWT_REFRESH_TOKEN_SECRET_KEY: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    JWT_REFRESH_TOKEN_EXPIRES_IN: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
}