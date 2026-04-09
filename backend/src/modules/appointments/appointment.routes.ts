import { Router } from "express";
import {
  createAppointment,
  cancelAppointment,
  rescheduleAppointment,
  getClientAppointments,
  getSingleAppointment,
  rateAppointment,
  addSessionNote,
  deleteAppointment,
} from "./appointment.controller";

import { protect } from "@/middleware/auth.middleware";
import { checkSubscription } from "@/middleware/subscription.middleware";
import { Role } from "@/types";

const router = Router();

// ========================================
// 📅 CREATE APPOINTMENT
// ========================================
router.post("/", protect([Role.CLIENT]), checkSubscription, createAppointment);

// Get all client appointments
router.get("/", protect([Role.CLIENT]), getClientAppointments);

// Get single appointment
router.get("/:id", protect([Role.CLIENT]), getSingleAppointment);

// ========================================
//  CANCEL APPOINTMENT
// ========================================
router.patch("/cancel", protect([Role.CLIENT]), cancelAppointment);

// ========================================
// 🔄 RESCHEDULE APPOINTMENT
// ========================================
router.patch("/reschedule", protect([Role.CLIENT]), rescheduleAppointment);
router.patch("/rate", protect([Role.CLIENT]), rateAppointment);
router.patch("/note", protect([Role.CLIENT]), addSessionNote);
router.delete("/:id", protect([Role.CLIENT]), deleteAppointment);

export default router;
