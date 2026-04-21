import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export const protect =
  (roles: string[] = []) =>
  (req: any, res: Response, next: NextFunction) => {
    try {
      // ✅ GET TOKEN FROM COOKIE
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Not authorized" });
      }

      // ✅ VERIFY TOKEN
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      // ✅ ATTACH USER TO REQUEST
      req.user = decoded;

      // ✅ ROLE CHECK (if provided)
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
