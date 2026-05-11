import { Router } from "express";
import {
  login,
  register,
  refreshToken,
  forgotPassword,
  resetPasswordController,
  verifyEmailController,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordController);
router.get("/verify", verifyEmailController);

export default router;
