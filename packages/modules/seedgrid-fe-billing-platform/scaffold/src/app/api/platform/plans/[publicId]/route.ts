import { NextRequest } from "next/server";
import { toRouteResponse } from "@seedgrid/fe-security/server";

import { getBillingPlatformServer } from "@/modules/billing-platform/server";
import type { CreatePlanRequest } from "@seedgrid/fe-billing-platform";

type Ctx = { params: Promise<{ publicId: string }> };

export async function GET(_request: NextRequest, context: Ctx) {
  const { publicId } = await context.params;

  return toRouteResponse(async () => {
    const plans = await getBillingPlatformServer();
    return plans.getPlan(publicId);
  });
}

export async function PUT(request: NextRequest, context: Ctx) {
  const { publicId } = await context.params;
  const body = (await request.json()) as CreatePlanRequest;

  return toRouteResponse(async () => {
    const plans = await getBillingPlatformServer();
    return plans.updatePlan(publicId, body);
  });
}

export async function DELETE(_request: NextRequest, context: Ctx) {
  const { publicId } = await context.params;

  return toRouteResponse(async () => {
    const plans = await getBillingPlatformServer();
    await plans.deletePlan(publicId);
    return null;
  });
}
