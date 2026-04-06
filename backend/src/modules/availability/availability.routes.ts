import { Router } from "express";
import { getAvailability, setAvailability } from "./availability.controller";
import { protect } from "@/middleware/auth.middleware";
import { Role } from "@/types";

const router = Router();

router.post("/", protect([Role.STAFF]), setAvailability);
router.get("/", protect([Role.STAFF]), getAvailability);

export default router;
