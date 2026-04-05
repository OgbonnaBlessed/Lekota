import mongoose, { Schema } from "mongoose";

const AvailabilitySchema = new Schema(
  {
    staff: { type: Schema.Types.ObjectId, ref: "User" },

    day: {
      type: String, // "Mon", "Tue"
    },

    startTime: String, // "09:00"
    endTime: String, // "17:00"
  },
  { timestamps: true },
);

export const Availability = mongoose.model("Availability", AvailabilitySchema);
