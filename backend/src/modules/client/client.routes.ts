import { Router } from "express";
import {
  updateClientProfile,
  getClientAppointments,
  getSingleAppointment,
  cancelAppointment,
  rateAppointment,
} from "./client.controller";

import { protect } from "@/middleware/auth.middleware";
import { Role } from "@/types";

const router = Router();

router.patch("/profile", protect([Role.CLIENT]), updateClientProfile);

router.get("/appointments", protect([Role.CLIENT]), getClientAppointments);
router.get("/appointments/:id", protect([Role.CLIENT]), getSingleAppointment);

router.patch("/appointments/cancel", protect([Role.CLIENT]), cancelAppointment);
router.patch("/appointments/rate", protect([Role.CLIENT]), rateAppointment);

export default router;
