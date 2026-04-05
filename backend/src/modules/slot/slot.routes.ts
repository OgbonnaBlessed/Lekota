import { Router } from "express";
import { getAvailableSlots } from "./slot.controller";
import { protect } from "@/middleware/auth.middleware";
import { Role } from "@/types";

const router = Router();

router.get("/", protect([Role.CLIENT]), getAvailableSlots);

export default router;
