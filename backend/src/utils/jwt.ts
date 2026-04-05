// utils/jwt.ts
import jwt from "jsonwebtoken";

export const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      tenant: user.tenant,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" },
  );
};
