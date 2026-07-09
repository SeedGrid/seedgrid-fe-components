import { NextRequest } from "next/server";
import { toRouteResponse } from "@seedgrid/fe-security/server";

import { getBillingPlatformServer } from "@/modules/billing-platform/server";
import type { PatchTrialRequest } from "@seedgrid/fe-billing-platform";

export async function GET() {
  return toRouteResponse(async () => {
    const plans = await getBillingPlatformServer();
    return plans.getTrial();
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as PatchTrialRequest;

  return toRouteResponse(async () => {
    const plans = await getBillingPlatformServer();
    return plans.updateTrial(body);
  });
}
