import { Router } from "express";
import userRouter from "./user/index.js";
import categoryRouter from "./category/index.js"
import transactionRouter from "./transaction/index.js"

const router = Router()
    .use("/v1/api/access", userRouter)
    .use("/v1/api/category", categoryRouter)
    .use("/v1/api/transaction", transactionRouter)

export default router;