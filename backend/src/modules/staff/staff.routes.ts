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
import { upload } from "../../middleware/upload.middleware";

const router = Router();

router.get("/profile", protect([Role.STAFF, Role.CLIENT]), getStaffProfile);
router.patch(
  "/profile",
  protect([Role.STAFF]),
  upload.single("image"),
  updateStaffProfile,
);
router.get("/schedules", protect([Role.STAFF]), getStaffSchedules);
router.get("/schedules/:id", protect([Role.STAFF]), getSingleSchedule);
router.patch(
  "/schedules/status",
  protect([Role.STAFF]),
  updateAppointmentStatus,
);
router.get("/:id", getStaffById);

export default router;
