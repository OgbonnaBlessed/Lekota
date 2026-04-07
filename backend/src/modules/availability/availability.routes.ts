import { Router } from "express";
import { getAvailability, getStaffAvailability, setAvailability } from "./availability.controller";
import { protect } from "@/middleware/auth.middleware";
import { Role } from "@/types";

const router = Router();

router.post("/", protect([Role.STAFF]), setAvailability);
router.get("/", protect([Role.STAFF]), getAvailability);
router.get("/:staffId", getStaffAvailability);

export default router;
