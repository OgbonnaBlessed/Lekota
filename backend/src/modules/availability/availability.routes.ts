import { Router } from "express";
import { setAvailability } from "./availability.controller";
import { protect } from "@/middleware/auth.middleware";
import { Role } from "@/types";

const router = Router();

router.post("/", protect([Role.STAFF]), setAvailability);

export default router;