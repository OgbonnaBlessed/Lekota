import mongoose, { Schema } from "mongoose";

const ServiceSchema = new Schema(
  {
    tenant: { type: Schema.Types.ObjectId, ref: "Tenant" },

    name: String,

    subServices: [String],

    schedules: [
      {
        duration: Number,
        buffer: Number,
      },
    ],

    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Service = mongoose.model("Service", ServiceSchema);