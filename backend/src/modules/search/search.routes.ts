import { Router } from "express";
import { searchServices } from "./search.controller";
import { protect } from "@/middleware/auth.middleware";
import { Role } from "@/types";

const router = Router();

// Search services + staff
router.get("/", protect([Role.CLIENT]), searchServices);

export default router;