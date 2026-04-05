import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    amount: Number,
    currency: {
      type: String,
      default: "NGN",
    },
    reference: String,
    billedTo: String,
    billedDetails: String,
    status: String,
    paidAt: Date,
  },
  { timestamps: true },
);

export const Payment = mongoose.model("Payment", paymentSchema);
