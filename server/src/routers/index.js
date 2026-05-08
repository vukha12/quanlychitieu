import { Router } from "express";
import userRouter from "./user/index.js";
import categoryRouter from "./category/index.js"

const router = Router()
    .use("/v1/api/access", userRouter)
    .use("/v1/api/category", categoryRouter)

export default router;