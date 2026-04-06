import mongoose, { Schema } from "mongoose";

const AvailabilitySchema = new Schema(
  {
    staff: { type: Schema.Types.ObjectId, ref: "User" },

    day: {
      type: String,
    },

    startTime: String,
    endTime: String,
  },
  { timestamps: true },
);

export const Availability = mongoose.model("Availability", AvailabilitySchema);
