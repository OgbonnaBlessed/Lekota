import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUserStatus,
  createService,
  getTenantThroughput,
  createTenant,
  getTenants,
  getServices,
  updateServiceStatus,
  updateService,
  updateTenantStatus,
} from "./tenant.controller";
import { protect } from "@/middleware/auth.middleware";
import { Role } from "@/types";

const router = Router();

router.get("/", protect([Role.ADMIN]), getTenants);
router.post("/create", protect([Role.ADMIN]), createTenant);
router.patch("/status", protect([Role.ADMIN]), updateTenantStatus);
router.get("/users", protect([Role.TENANT_ADMIN]), getUsers);
router.post("/users/create", protect([Role.TENANT_ADMIN]), createUser);
router.patch("/users/status", protect([Role.TENANT_ADMIN]), updateUserStatus);
router.post("/services", protect([Role.TENANT_ADMIN]), createService);
router.get("/services", protect([Role.TENANT_ADMIN, Role.STAFF, Role.CLIENT]), getServices);
router.patch(
  "/services/status",
  protect([Role.TENANT_ADMIN]),
  updateServiceStatus,
);
router.patch("/services", protect([Role.TENANT_ADMIN]), updateService);
router.get("/analytics", protect([Role.TENANT_ADMIN]), getTenantThroughput);

export default router;
