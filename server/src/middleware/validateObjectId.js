import mongoose from "mongoose";

export const validateObjectId = (...params) => (req, res, next) => {
    for (const param of params) {
        if (!mongoose.isValidObjectId(req.params[param])) {
            return res.status(400).json({ message: `Invalid ${param}` })
        }
    }
    next()
}
