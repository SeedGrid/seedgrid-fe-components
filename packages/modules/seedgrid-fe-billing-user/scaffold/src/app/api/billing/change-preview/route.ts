import { NextRequest } from "next/server";
import { toRouteResponse } from "@seedgrid/fe-security/server";

import { getBillingUserServer } from "@/modules/billing-user/server";

export async function GET(request: NextRequest) {
  const planId = request.nextUrl.searchParams.get("planId") ?? "";

  return toRouteResponse(async () => {
    const billing = await getBillingUserServer();
    return billing.getChangePreview(planId);
  });
}
