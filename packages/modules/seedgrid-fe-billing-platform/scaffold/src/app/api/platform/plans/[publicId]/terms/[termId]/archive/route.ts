import { NextRequest } from "next/server";
import { toRouteResponse } from "@seedgrid/fe-security/server";

import { getBillingPlatformServer } from "@/modules/billing-platform/server";

type Ctx = { params: Promise<{ publicId: string; termId: string }> };

export async function POST(_request: NextRequest, context: Ctx) {
  const { publicId, termId } = await context.params;

  return toRouteResponse(async () => {
    const plans = await getBillingPlatformServer();
    return plans.archiveTerm(publicId, termId);
  });
}
