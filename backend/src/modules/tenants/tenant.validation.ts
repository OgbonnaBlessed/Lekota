import { emailSchema } from "@/modules/auth/auth.validation";
import { UserStatus } from "@/types";
import { z } from "zod";

const NAME_MIN = 8;
const NAME_MAX = 20;

// ===============================
// 🏢 CREATE TENANT
// ===============================
export const createTenantSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .min(NAME_MIN, `Name must be at least ${NAME_MIN} characters`)
    .max(NAME_MAX, `Name cannot exceed ${NAME_MAX} characters`),
  organization: z
    .string()
    .nonempty("Organization name is required")
    .min(NAME_MIN, `Organization name must be at least ${NAME_MIN} characters`)
    .max(NAME_MAX, `Organization name cannot exceed ${NAME_MAX} characters`),
  email: emailSchema,
});

// ===============================
// 👤 CREATE USER
// ===============================
export const createUserSchema = z.object({
  name: z.string()
    .nonempty("Name is required")
    .min(NAME_MIN, `Name must be at least ${NAME_MIN} characters`)
    .max(NAME_MAX, `Name cannot exceed ${NAME_MAX} characters`),
  email: emailSchema,
  role: z.enum(["staff", "client"]),
});

// ===============================
// 🚦 UPDATE USER STATUS
// ===============================
export const updateUserStatusSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  status: z.enum([UserStatus.ACTIVE, UserStatus.SUSPENDED, UserStatus.DELETED]),
});

// ===============================
// 🛠 CREATE SERVICE
// ===============================
export const createServiceSchema = z.object({
  name: z.string().min(2, "Service name is required"),

  subServices: z
    .array(z.string().min(5, "Subservice must be at least 5 characters"))
    .min(1, "At least one subservice is required"),

  schedules: z.array(
    z.object({
      duration: z.number().min(1),
      buffer: z.number().min(0),
    }),
  ),
});
