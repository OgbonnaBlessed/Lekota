import { Notification } from "./notification.model";
import { User } from "../users/user.model";
import { sendEmail } from "@/utils/email.util";

export const sendNotification = async ({
  userId,
  title,
  body,
  emailData,
}: {
  userId: string;
  title: string;
  body: string;
  emailData?: {
    subject: string;
    html: string;
  };
}) => {
  // Save in-app notification
  await Notification.create({
    user: userId,
    title,
    body,
  });

  // 🔥 ALSO SEND EMAIL
  const user = await User.findById(userId);

  if (user?.email && emailData) {
    await sendEmail(user.email, emailData.subject, emailData.html);
  }
};
