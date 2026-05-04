import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import router from "./routers/index.js";


const app = express();

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());

// connect mongodb
import "./databases/init.mongodb.js";

app.use("/", router);

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;

    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        message: error.message || "Interal Server Error",
    });
});

export default app;