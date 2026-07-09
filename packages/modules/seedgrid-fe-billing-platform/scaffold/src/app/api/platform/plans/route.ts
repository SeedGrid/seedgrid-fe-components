import { NextRequest } from "next/server";
import { toRouteResponse } from "@seedgrid/fe-security/server";

import { getBillingPlatformServer } from "@/modules/billing-platform/server";
import type { CreatePlanRequest } from "@seedgrid/fe-billing-platform";

export async function GET() {
  return toRouteResponse(async () => {
    const plans = await getBillingPlatformServer();
    return plans.listPlans();
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CreatePlanRequest;

  return toRouteResponse(async () => {
    const plans = await getBillingPlatformServer();
    return plans.createPlan(body);
  });
}
