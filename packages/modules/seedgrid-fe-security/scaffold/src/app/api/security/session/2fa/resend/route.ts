import { NextRequest } from "next/server";

import { createResendTwoFactorRouteResponse } from "@/modules/security/server/session-routes";

export async function POST(request: NextRequest) {
  return createResendTwoFactorRouteResponse(request);
}

