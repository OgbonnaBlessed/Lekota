import { Router } from "express";
import {
  getTenantPayments,
  initializePayment,
  paystackWebhook,
} from "./paystack.controller";
import { protect } from "@/middleware/auth.middleware";
import { Role } from "@/types";

const router = Router();

router.post("/webhook", paystackWebhook);
router.post("/initialize", initializePayment);
router.get("/", protect([Role.TENANT_ADMIN]), getTenantPayments);

export default router;
