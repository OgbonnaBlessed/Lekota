import { Service } from "@/modules/services/service.model";
import { User } from "@/modules/users/user.model";
import { Response } from "express";

export const searchServices = async (req: any, res: Response) => {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ message: "Search query is required" });
  }

  const tenantId = req.user.tenant;

  // Search services within tenant
  const services = await Service.find({
    tenant: tenantId,
    name: { $regex: query, $options: "i" },
  });

  // Search staff within tenant
  const staff = await User.find({
    tenant: tenantId,
    role: "staff",
    "profile.service": { $regex: query, $options: "i" },
  }).select("name email profile");

  res.json({ services, staff });
};