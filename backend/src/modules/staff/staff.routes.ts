import { Router } from "express";
import {
  updateStaffProfile,
  getStaffSchedules,
  getSingleSchedule,
  updateAppointmentStatus,
  getStaffProfile,
  getStaffById,
} from "./staff.controller";

import { protect } from "@/middleware/auth.middleware";
import { Role } from "@/types";

const router = Router();

router.get("/profile", protect([Role.STAFF, Role.CLIENT]), getStaffProfile);
router.patch("/profile", protect([Role.STAFF]), updateStaffProfile);
router.get("/schedules", protect([Role.STAFF]), getStaffSchedules);
router.get("/schedules/:id", protect([Role.STAFF]), getSingleSchedule);
router.patch("/schedules/status", protect([Role.STAFF]), updateAppointmentStatus);
router.get("/:id", getStaffById);

export default router;
