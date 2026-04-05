import { z } from "zod";

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 20;

export const emailSchema = z
  .string()
  .nonempty("Email is required")
  .email("Enter a valid email address");

export const passwordSchema = z
  .string()
  .nonempty("Password is required")
  .min(PASSWORD_MIN, `Password must be at least ${PASSWORD_MIN} characters`)
  .max(PASSWORD_MAX, `Password cannot exceed ${PASSWORD_MAX} characters`)
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least one special character",
  );

export const authSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Enter a valid email address"),

  password: z.string().nonempty("Password is required"),
});
