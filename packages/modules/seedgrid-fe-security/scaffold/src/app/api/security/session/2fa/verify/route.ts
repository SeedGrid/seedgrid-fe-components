import { NextRequest } from "next/server";

import { createVerifyTwoFactorRouteResponse } from "@/modules/security/server/session-routes";

export async function POST(request: NextRequest) {
  return createVerifyTwoFactorRouteResponse(request);
}

