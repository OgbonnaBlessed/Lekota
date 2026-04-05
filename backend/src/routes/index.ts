import { Router } from "express";
import authRoutes from "@/modules/auth/auth.routes";
import tenantRoutes from "@/modules/tenants/tenant.routes";
import appointmentRoutes from "@/modules/appointments/appointment.routes";
import availabilityRoutes from "@/modules/availability/availability.routes";
import paymentRoutes from "@/modules/payments/payment.routes";
import clientRoutes from "@/modules/client/client.routes";
import staffRoutes from "@/modules/staff/staff.routes";
import slotRoutes from "@/modules/slot/slot.routes";
import analyticsRoutes from "@/modules/analytics/analytics.routes";
import notificationRoutes from "@/modules/notifications/notification.routes";
import searchRoutes from "@/modules/search/search.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/tenants", tenantRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/availability", availabilityRoutes);
router.use("/payments", paymentRoutes);
router.use("/client", clientRoutes);
router.use("/staff", staffRoutes);
router.use("/slot", slotRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/notification", notificationRoutes);
router.use("/search", searchRoutes);

export default router;
