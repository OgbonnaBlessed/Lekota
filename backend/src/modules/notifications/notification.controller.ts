import { Response } from "express";
import { Notification } from "./notification.model";

export const getNotifications = async (req: any, res: Response) => {
  const notifications = await Notification.find({
    user: req.user.id,
  }).sort({ createdAt: -1 });

  const unreadCount = await Notification.countDocuments({
    user: req.user.id,
    $or: [{ isRead: false }, { isRead: { $exists: false } }],
  });

  res.json({
    message: "Notifications fetched",
    notifications,
    unreadCount,
  });
};

export const markAsRead = async (req: any, res: Response) => {
  const { id } = req.body;

  await Notification.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { isRead: true },
  );

  res.json({ message: "Marked as read" });
};
