import { NextRequest } from "next/server";
import { toRouteResponse } from "@seedgrid/fe-security/server";

import { getBillingUserServer } from "@/modules/billing-user/server";

export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : undefined;

  return toRouteResponse(async () => {
    const billing = await getBillingUserServer();
    return billing.listInvoices(Number.isFinite(limit) ? limit : undefined);
  });
}
