import { Router } from "express";
import {
  updateStaffProfile,
  getStaffSchedules,
  getSingleSchedule,
  updateAppointmentStatus,
} from "./staff.controller";

import { protect } from "@/middleware/auth.middleware";
import { Role } from "@/types";

const router = Router();

router.patch("/profile", protect([Role.STAFF]), updateStaffProfile);
router.get("/schedules", protect([Role.STAFF]), getStaffSchedules);
router.get("/schedules/:id", protect([Role.STAFF]), getSingleSchedule);
router.patch("/schedules/status", protect([Role.STAFF]), updateAppointmentStatus);

export default router;
