import { protect } from "@/middleware/auth.middleware";
import { Router } from "express";
import {
  adminSignup,
  forgotPassword,
  getMe,
  login,
  logout,
  resetPassword
} from "./auth.controller";

const router = Router();

router.get("/me", protect, getMe);
router.post("/admin/signup", adminSignup);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
