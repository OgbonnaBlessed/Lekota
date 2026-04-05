import { Router } from "express";
import { getOverviewAnalytics, getTenantOverview, getThroughput } from "./analytics.controller";
import { protect } from "@/middleware/auth.middleware";
import { Role } from "@/types";

const router = Router();

router.get("/overview", protect([Role.ADMIN]), getOverviewAnalytics);
router.get("/throughput", protect([Role.ADMIN, Role.TENANT_ADMIN]), getThroughput);
router.get(
  "/tenant-overview",
  protect([Role.TENANT_ADMIN]),
  getTenantOverview
);

export default router;
