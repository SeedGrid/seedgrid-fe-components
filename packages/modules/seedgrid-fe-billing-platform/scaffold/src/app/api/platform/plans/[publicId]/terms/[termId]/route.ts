import { NextRequest } from "next/server";
import { toRouteResponse } from "@seedgrid/fe-security/server";

import { getBillingPlatformServer } from "@/modules/billing-platform/server";
import type { PatchPlanTermRequest } from "@seedgrid/fe-billing-platform";

type Ctx = { params: Promise<{ publicId: string; termId: string }> };

// PATCH: só termos AGENDADOS (effectiveFrom no futuro) — o backend rejeita os demais.
export async function PATCH(request: NextRequest, context: Ctx) {
  const { publicId, termId } = await context.params;
  const body = (await request.json()) as PatchPlanTermRequest;

  return toRouteResponse(async () => {
    const plans = await getBillingPlatformServer();
    return plans.updateTerm(publicId, termId, body);
  });
}

export async function DELETE(_request: NextRequest, context: Ctx) {
  const { publicId, termId } = await context.params;

  return toRouteResponse(async () => {
    const plans = await getBillingPlatformServer();
    await plans.deleteTerm(publicId, termId);
    return null;
  });
}
