import { Router } from "express";
import {
  getTenantPayments,
  initializePayment,
  paystackWebhook,
  verifyPayment,
} from "./paystack.controller";
import { protect } from "@/middleware/auth.middleware";
import { Role } from "@/types";

const router = Router();

router.post("/webhook", paystackWebhook);
router.post("/initialize", protect([Role.TENANT_ADMIN]), initializePayment);
router.get("/", protect([Role.TENANT_ADMIN]), getTenantPayments);
router.get("/verify", protect([Role.TENANT_ADMIN]), verifyPayment);

export default router;
