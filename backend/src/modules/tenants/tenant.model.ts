import mongoose, { Schema } from "mongoose";
import { TenantStatus, SubscriptionStatus } from "../../types";

const TenantSchema = new Schema(
  {
    name: String,
    organization: String,
    email: String,

    tenantId: { type: String, unique: true },
    password: String,

    status: {
      type: String,
      enum: Object.values(TenantStatus),
      default: TenantStatus.ACTIVE,
    },

    subscription: {
      status: {
        type: String,
        enum: Object.values(SubscriptionStatus),
        default: SubscriptionStatus.TRIAL,
      },
      expiresAt: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true },
);

export const Tenant = mongoose.model("Tenant", TenantSchema);
