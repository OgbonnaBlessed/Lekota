import mongoose, { Schema } from "mongoose";

const AppointmentSchema = new Schema(
  {
    tenant: { type: Schema.Types.ObjectId, ref: "Tenant" },
    staff: { type: Schema.Types.ObjectId, ref: "User" },
    client: { type: Schema.Types.ObjectId, ref: "User" },

    serviceId: String,

    date: Date,
    startTime: String,
    endTime: String,
    duration: Number,
    buffer: Number,

    type: {
      type: String,
      enum: ["onsite", "virtual"],
      default: "onsite",
    },

    meetingLink: String,

    status: {
      type: String,
      enum: ["pending", "completed", "absent", "cancelled"],
      default: "pending",
    },

    service: String,
    subService: String,

    reason: String,
    cancelReason: String,

    sessionNotes: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        note: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    rating: Number,
    remarks: String,
  },
  { timestamps: true },
);

export const Appointment = mongoose.model("Appointment", AppointmentSchema);
