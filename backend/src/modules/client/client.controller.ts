import { Response } from "express";
import { sendNotification } from "../notifications/notification.service";
import { User } from "../users/user.model";

export const getClientProfile = async (req: any, res: Response) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const response = {
    name: user.name,
    email: user.email,
    image: user.profile?.image,
    location: user.profile?.location,
    bio: user.profile?.bio,
    phone: user.profile?.phone,
  };

  res.json(response);
};

// ========================================
// UPDATE CLIENT PROFILE
// ========================================
export const updateClientProfile = async (req: any, res: Response) => {
  const updates = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: { ...updates } },
    { new: true },
  );

  await sendNotification(
    req.user.id,
    "Profile Updated",
    "Your profile was updated successfully",
  );

  res.json(user);
};
