import { Tenant } from "@/modules/tenants/tenant.model";
import { SubscriptionStatus } from "@/types";

export const checkSubscription = async (tenantId: string) => {
  const tenant = await Tenant.findById(tenantId);

  if (!tenant) return;

  if (tenant.subscription && tenant.subscription.expiresAt) {
    if (
      tenant.subscription.status === "trial" &&
      new Date() > tenant.subscription.expiresAt
    ) {
      if (tenant.subscription.status) {
        tenant.subscription.status = SubscriptionStatus.EXPIRED;
        await tenant.save();
      }
    }
  }

  return tenant;
};
