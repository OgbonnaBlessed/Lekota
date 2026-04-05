import { Router } from "express";
import {
  createAppointment,
  cancelAppointment,
  rescheduleAppointment,
} from "./appointment.controller";

import { protect } from "@/middleware/auth.middleware";
import { checkSubscription } from "@/middleware/subscription.middleware";
import {
  getClientAppointments,
  getSingleAppointment,
} from "../client/client.controller";
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

export default router;
