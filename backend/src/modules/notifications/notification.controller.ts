import { Response } from "express";
import { Notification } from "./notification.model";

export const getNotifications = async (req: any, res: Response) => {
  const notifications = await Notification.find({
    user: req.user.id,
  }).sort({ createdAt: -1 });

  res.json(notifications);
};
