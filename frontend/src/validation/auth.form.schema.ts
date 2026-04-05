import { z } from "zod";

// -------------------------------
// Constants
// -------------------------------
const USERNAME_MIN = 8;
const USERNAME_MAX = 20;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 16;

// -------------------------------
// Reusable Schemas
// -------------------------------
const emailSchema = z
  .string()
  .nonempty("Email is required")
  .email("Enter a valid email address");

const passwordSchema = z
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

// -------------------------------
// Login Form Schema
// -------------------------------
export const signinFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SigninFormValues = z.infer<typeof signinFormSchema>;

// -------------------------------
// Signup Form Schema
// -------------------------------
export const signupFormSchema = z
  .object({
    organizationName: z
      .string()
      .nonempty("Organization name is required")
      .min(
        USERNAME_MIN,
        `Organization name must be at least ${USERNAME_MIN} characters`,
      )
      .max(
        USERNAME_MAX,
        `Organization name cannot exceed ${USERNAME_MAX} characters`,
      ),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

export type SignupFormValues = z.infer<typeof signupFormSchema>;

// -------------------------------
// Forgot Password Schema
// -------------------------------
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

// -------------------------------
// Create New Password Schema
// -------------------------------
export const createNewPasswordSchema = z
  .object({
    password: passwordSchema,
    repeatPassword: passwordSchema,
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

export type CreateNewPasswordValues = z.infer<typeof createNewPasswordSchema>;
