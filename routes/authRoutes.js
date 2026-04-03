import { Router } from "express";
import handleAsyncErr from "../utilities/handleAsyncErr.js";
import AuthController from "../controllers/authController.js";

const router = Router();

router.post("/signup", handleAsyncErr(AuthController.register));
router.post("/login", handleAsyncErr(AuthController.login));
router.post("/logout", handleAsyncErr(AuthController.logout));

export default router;
