import { Request, Response } from "express";
import { Appointment } from "@/modules/appointments/appointment.model";

import { Tenant } from "@/modules/tenants/tenant.model";
import { User } from "@/modules/users/user.model";

export const getOverviewAnalytics = async (_req: Request, res: Response) => {
  const [
    totalTenants,
    activeTenants,
    suspendedTenants,
    deletedTenants,
    subscribedTenants,
  ] = await Promise.all([
    Tenant.countDocuments(),
    Tenant.countDocuments({ status: "active" }),
    Tenant.countDocuments({ status: "suspended" }),
    Tenant.countDocuments({ status: "deleted" }),
    Tenant.countDocuments({ "subscription.status": "active" }),
  ]);

  res.json({
    totalTenants,
    activeTenants,
    suspendedTenants,
    deletedTenants,
    subscribedTenants,
  });
};

export const getTenantOverview = async (req: any, res: Response) => {
  try {
    const tenantId = req.user.tenant;

    const [totalUsers, activeUsers, suspendedUsers, deletedUsers, tenant] =
      await Promise.all([
        User.countDocuments({ tenant: tenantId }),
        User.countDocuments({ tenant: tenantId, status: "active" }),
        User.countDocuments({ tenant: tenantId, status: "suspended" }),
        User.countDocuments({ tenant: tenantId, status: "deleted" }),
        Tenant.findById(tenantId),
      ]);

    // 🧠 calculate trial days left
    let trialDaysLeft = 0;

    if (tenant?.subscription?.expiresAt) {
      const diff =
        new Date(tenant.subscription.expiresAt).getTime() - Date.now();
      trialDaysLeft = Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
    }

    return res.json({
      totalUsers,
      activeUsers,
      suspendedUsers,
      deletedUsers,
      trialDaysLeft,
    });
  } catch (error: any) {
    console.error("TENANT OVERVIEW ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch tenant overview",
    });
  }
};

export const getThroughput = async (req: any, res: Response) => {
  const { range = "weekly" } = req.query;

  let groupFormat;

  switch (range) {
    case "daily":
      groupFormat = "%Y-%m-%d-%H";
      break;
    case "weekly":
      groupFormat = "%Y-%U";
      break;
    case "monthly":
      groupFormat = "%Y-%m";
      break;
    default:
      groupFormat = "%Y";
  }

  const match: any = {};

  // ✅ TENANT FILTER (KEY FIX)
  if (req.user.role === "tenant_admin") {
    match.tenant = req.user.tenant;
  }

  const data = await Appointment.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: { format: groupFormat, date: "$date" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(data);
};
