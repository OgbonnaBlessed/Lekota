import mongoose, { Schema } from "mongoose";

const AppointmentSchema = new Schema(
  {
    tenant: { type: Schema.Types.ObjectId, ref: "Tenant" },
    staff: { type: Schema.Types.ObjectId, ref: "User" },
    client: { type: Schema.Types.ObjectId, ref: "User" },

    date: Date,
    startTime: String,
    endTime: String,

    status: {
      type: String,
      enum: ["pending", "completed", "absent", "cancelled"],
      default: "pending",
    },

    reason: String,
    cancelReason: String,

    sessionNotes: String,
    rating: Number,
    remarks: String,
  },
  { timestamps: true },
);

export const Appointment = mongoose.model("Appointment", AppointmentSchema);
