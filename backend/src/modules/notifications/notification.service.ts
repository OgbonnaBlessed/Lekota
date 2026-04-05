import { Notification } from "./notification.model";

export const sendNotification = async (
  userId: string,
  title: string,
  body: string,
) => {
  await Notification.create({
    user: userId,
    title,
    body,
  });
};
