import { NextRequest } from "next/server";
import { toRouteResponse } from "@seedgrid/fe-security/server";

import { getBillingUserServer } from "@/modules/billing-user/server";
import type { CheckoutRequest } from "@seedgrid/fe-billing-user";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CheckoutRequest;

  return toRouteResponse(async () => {
    const billing = await getBillingUserServer();
    return billing.createCheckout(body);
  });
}
