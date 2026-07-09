import { toRouteResponse } from "@seedgrid/fe-security/server";

import { getBillingUserServer } from "@/modules/billing-user/server";

export async function GET() {
  return toRouteResponse(async () => {
    const billing = await getBillingUserServer();
    const [subscription, usage] = await Promise.all([
      billing.getSubscription(),
      billing.getUsageSummary(),
    ]);

    return { subscription, usage };
  });
}
