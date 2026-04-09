import { User } from "@/modules/users/user.model";
import { Role } from "@/types/index";
import { sendEmail } from "@/utils/email.util";
import { generateToken } from "@/utils/jwt";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Request, Response } from "express";
import {
  authSchema,
  emailSchema,
  loginSchema,
  passwordSchema,
} from "./auth.validation";
import { forgotPasswordEmail } from "@/utils/email.template";

const sendAuthResponse = (res: Response, user: any, message: string) => {
  const token = generateToken(user);

  res.json({
    message,
    token, // ✅ ADD THIS
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      tenant: user.tenant || null, // ✅ VERY IMPORTANT
    },
  });
};

export const adminSignup = async (req: Request, res: Response) => {
  const { organization, email, password, confirmPassword } = req.body;

  const existing = await User.findOne({ role: Role.ADMIN });
  if (existing) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  // VALIDATE INPUT
  const result = authSchema.safeParse({ email, password });

  if (!result.success) {
    const errorMessage = result.error.errors[0].message;
    return res.status(400).json({ message: errorMessage });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: organization,
    email,
    password: hashed,
    role: Role.ADMIN,
  });

  sendAuthResponse(res, user, "Admin account created successfully");
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // ✅ LIGHT VALIDATION (ONLY EMAIL + REQUIRED PASSWORD)
  const result = loginSchema.safeParse({ email, password });

  if (!result.success) {
    const errorMessage = result.error.errors[0].message;
    return res.status(400).json({ message: errorMessage });
  }

  const user = await User.findOne({ email });

  // 🔒 Do NOT reveal whether email exists or not
  if (!user || !user?.password) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  if (user.status !== "active") {
    return res.status(403).json({
      message: "Account is inactive",
    });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  sendAuthResponse(res, user, "Login successful");
};

export const getMe = async (req: any, res: Response) => {
  const user = await User.findById(req.user.id).select("-password");

  res.json({ user });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  // Validate email
  const result = emailSchema.safeParse(email);
  if (!result.success) {
    return res.status(400).json({ message: result.error.errors[0].message });
  }

  const user = await User.findOne({ email });

  // DO NOT reveal if user exists
  if (!user) {
    return res.json({
      message: "If this email exists, reset instructions were sent",
    });
  }

  // Generate token
  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  await user.save();

  const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  if (user.email && user.name) {
    await sendEmail(
      user.email,
      "Reset Your Lekota Password",
      forgotPasswordEmail({
        name: user.name,
        resetURL,
      }),
    );
  }

  res.json({
    message: "Reset instructions sent to your email",
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password, confirmPassword } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Invalid or missing token" });
  }

  // Validate password strength
  const result = passwordSchema.safeParse(password);
  if (!result.success) {
    return res.status(400).json({ message: result.error.errors[0].message });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    return res.status(400).json({
      message: "Token is invalid or has expired",
    });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({
    message: "Password reset successful",
  });
};

export const logout = async (_req: Request, res: Response) => {
  return res.json({
    message: "Logged out successfully",
  });
};
