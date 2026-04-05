import { Router } from "express";
import { getNotifications } from "./notification.controller";
import { protect } from "@/middleware/auth.middleware";
import { Role } from "@/types";

const router = Router();

router.get("/", protect([Role.STAFF, Role.CLIENT]), getNotifications);

export default router;
