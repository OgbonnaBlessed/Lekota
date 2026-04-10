import { Router } from "express";
import {
  getClientProfile,
  updateClientProfile
} from "./client.controller";

import { protect } from "@/middleware/auth.middleware";
import { Role } from "@/types";
import { upload } from "@/middleware/upload.middleware";

const router = Router();

router.get("/profile", protect([Role.CLIENT]), getClientProfile);
router.patch("/profile", protect([Role.CLIENT]), upload.single("image"), updateClientProfile);
export default router;
