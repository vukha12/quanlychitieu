import express from "express";
import UserController from "../../controllers/user.controller.js";
import { checkAuth } from "../../auth/checkAuth.js";

const router = express.Router();

router.post("/login", UserController.signIn);
router.post("/signup", UserController.register);
router.post("/refreshToken", UserController.refreshToken);
router.post("/logout", checkAuth, UserController.logout);

export default router;