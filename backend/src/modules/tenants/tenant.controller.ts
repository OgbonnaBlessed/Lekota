import { Request, Response } from "express";
import { Appointment } from "../appointments/appointment.model";
import { Service } from "../services/service.model";
import { User } from "../users/user.model";
import { Tenant } from "./tenant.model";

import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

import { Role } from "@/types";
import { sendEmail } from "@/utils/email.util";
import {
  createServiceSchema,
  createTenantSchema,
  createUserSchema,
  updateUserStatusSchema,
} from "./tenant.validation";
import { welcomeEmail } from "@/utils/email.template";

// ======================================================
// 🏢 ADMIN: CREATE TENANT
// ======================================================
export const createTenant = async (req: Request, res: Response) => {
  try {
    const parsed = createTenantSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors[0].message,
      });
    }

    const { name, organization, email } = parsed.data;

    const exists = await Tenant.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "Tenant already exists" });
    }

    const rawPassword = uuid().slice(0, 10);

    const tenant = await Tenant.create({
      name,
      organization,
      email,
      tenantId: uuid(),
      subscription: {
        status: "trial",
        expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
    });

    // ✅ CREATE TENANT ADMIN USER
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(rawPassword, 10),
      role: Role.TENANT_ADMIN,
      tenant: tenant._id,
    });

    await sendEmail(
      email,
      "Welcome to Lekota",
      welcomeEmail(name, rawPassword),
    );

    return res.status(201).json({
      message: "Tenant created successfully",
      tenant,
      user,
    });
  } catch {
    return res.status(500).json({ message: "Failed to create tenant" });
  }
};

export const updateTenantStatus = async (req: any, res: Response) => {
  try {
    const { tenantId, status } = req.body;

    const tenant = await Tenant.findOne({
      _id: tenantId,
    });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    tenant.status = status;
    await tenant.save();

    return res.json({
      message: `Tenant ${status} successfully`,
    });
  } catch {
    return res.status(500).json({ message: "Failed to update tenant status" });
  }
};

// ======================================================
// 👤 TENANT ADMIN: CREATE USER (STAFF / CLIENT)
// ======================================================
export const createUser = async (req: any, res: Response) => {
  try {
    const parsed = createUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors[0].message,
      });
    }

    const { name, email, role } = parsed.data;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const rawPassword = uuid().slice(0, 10);

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(rawPassword, 10),
      role,
      tenant: req.user.tenant,
    });

    await sendEmail(
      email,
      "Welcome to Lekota",
      welcomeEmail(name, rawPassword),
    );

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch {
    return res.status(500).json({ message: "Failed to create user" });
  }
};

// ======================================================
// 👥 TENANT ADMIN: GET USERS (FILTERED)
// ======================================================
export const getUsers = async (req: any, res: Response) => {
  try {
    const { status } = req.query;

    const filter: any = { tenant: req.user.tenant };
    if (status) filter.status = status;

    const users = await User.find(filter).populate("tenant", "organization");

    return res.json({
      message: "Users fetched successfully",
      users,
    });
  } catch {
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ======================================================
// 🚦 TENANT ADMIN: UPDATE USER STATUS
// ======================================================
export const updateUserStatus = async (req: any, res: Response) => {
  try {
    const parsed = updateUserStatusSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors[0].message,
      });
    }

    const { userId, status } = parsed.data;

    const user = await User.findOne({
      _id: userId,
      tenant: req.user.tenant,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;
    await user.save();

    return res.json({ message: `User ${status} updated successfully` });
  } catch {
    return res.status(500).json({ message: "Update failed" });
  }
};

// ======================================================
// TENANT ADMIN: CREATE SERVICE
// ======================================================
export const createService = async (req: any, res: Response) => {
  try {
    const parsed = createServiceSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.errors[0].message,
      });
    }

    const service = await Service.create({
      ...parsed.data,
      tenant: req.user.tenant,
    });

    return res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch {
    return res.status(500).json({ message: "Failed to create service" });
  }
};

export const getServices = async (req: any, res: Response) => {
  try {
    const services = await Service.find({
      tenant: req.user.tenant,
    })
      .populate("tenant", "name organization email")
      .sort({ createdAt: -1 });

    return res.json({
      message: "Services fetched successfully",
      services,
    });
  } catch {
    return res.status(500).json({ message: "Failed to fetch services" });
  }
};

export const updateServiceStatus = async (req: any, res: Response) => {
  try {
    const { serviceId, status } = req.body;

    const service = await Service.findOne({
      _id: serviceId,
      tenant: req.user.tenant,
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.status = status;
    await service.save();

    return res.json({
      message: `Service ${status} successfully`,
    });
  } catch {
    return res.status(500).json({ message: "Failed to update service" });
  }
};

export const updateService = async (req: any, res: Response) => {
  try {
    const { serviceId, name, subServices, schedules } = req.body;

    const service = await Service.findOne({
      _id: serviceId,
      tenant: req.user.tenant,
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (name !== undefined) service.name = name;
    if (subServices !== undefined) service.subServices = subServices;
    if (schedules !== undefined) service.schedules = schedules;

    await service.save();

    const updatedService = await Service.findById(service._id).populate(
      "tenant",
      "name organization email",
    );

    return res.json({
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch {
    return res.status(500).json({ message: "Failed to update service" });
  }
};

// ======================================================
// 📊 TENANT ADMIN: GET TENANT ANALYTICS
// ======================================================
export const getTenantThroughput = async (req: any, res: Response) => {
  const { range } = req.query;

  let format;

  switch (range) {
    case "daily":
      format = "%Y-%m-%d-%H";
      break;
    case "weekly":
      format = "%Y-%U";
      break;
    case "monthly":
      format = "%Y-%m";
      break;
    default:
      format = "%Y";
  }

  const data = await Appointment.aggregate([
    {
      $match: {
        tenant: req.user.tenant,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format, date: "$date" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(data);
};

// ======================================================
// 🏢 ADMIN: GET ALL TENANTS
// ======================================================
export const getTenants = async (_req: Request, res: Response) => {
  const tenants = await Tenant.find().sort({ createdAt: -1 });

  res.json({ message: "Tenants fetched successfully", tenants });
};
