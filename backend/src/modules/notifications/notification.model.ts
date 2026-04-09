import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    title: String,
    body: String,
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Notification = mongoose.model("Notification", NotificationSchema);
