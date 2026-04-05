import { Request, Response } from "express";
import crypto from "crypto";
import { Tenant } from "@/modules/tenants/tenant.model";
import { SubscriptionStatus } from "@/types";
import axios from "axios";
import { Payment } from "./payment.model"; // adjust path

export const paystackWebhook = async (req: Request, res: Response) => {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET!)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.sendStatus(401);
  }

  const event = req.body;

  if (event.event === "charge.success") {
    const tenantId = event.data.metadata?.tenantId;

    const tenant = await Tenant.findById(tenantId);

    if (tenant && tenant.subscription) {
      tenant.subscription.status = SubscriptionStatus.ACTIVE;
      tenant.subscription.expiresAt = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      );

      await tenant.save();
    }

    // ✅ SAVE PAYMENT
    await Payment.create({
      tenant: tenantId,
      amount: event.data.amount / 100, // convert from kobo
      currency: event.data.currency,
      reference: event.data.reference,
      billedTo: event.data.billedTo,
      billedDetails: event.billDetails,
      status: event.data.status,
      paidAt: new Date(event.data.paid_at),
    });
  }

  res.sendStatus(200);
};

export const initializePayment = async (req: any, res: Response) => {
  try {
    const tenant = await Tenant.findById(req.user.tenant);

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: tenant.email,
        amount: 1000 * 100,
        metadata: {
          tenantId: tenant._id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
        },
      },
    );

    return res.json(response.data);
  } catch {
    return res.status(500).json({ message: "Payment init failed" });
  }
};

export const getTenantPayments = async (req: any, res: Response) => {
  try {
    const payments = await Payment.find({
      tenant: req.user.tenant,
    }).sort({ createdAt: -1 });

    return res.json({
      message: "Payments fetched successfully",
      payments,
    });
  } catch {
    return res.status(500).json({ message: "Failed to fetch payments" });
  }
};
