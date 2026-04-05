import mongoose, { Schema } from "mongoose";
import { Role, UserStatus } from "../../types/index";

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
    },

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },

    profile: {
      image: String,
      location: String,
      bio: String,
      gender: String,

      // staff only
      service: String,
      sub_service: String,
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true },
);

export const User = mongoose.model("User", UserSchema);
