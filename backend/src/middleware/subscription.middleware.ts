import { Tenant } from "@/modules/tenants/tenant.model";
import { NextFunction, Response } from "express";

export const checkSubscription = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const tenant = await Tenant.findById(req.user.tenant);

  if (!tenant) return res.status(404).json({ message: "Tenant not found" });

  if (
    !tenant.subscription ||
    tenant.subscription.status === "expired" ||
    !tenant.subscription.expiresAt ||
    new Date() > tenant.subscription.expiresAt
  ) {
    return res.status(403).json({
      message: "Subscription expired. Please renew.",
    });
  }

  next();
};
