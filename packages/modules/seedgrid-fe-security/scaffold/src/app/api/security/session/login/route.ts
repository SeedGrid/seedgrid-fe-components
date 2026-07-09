import { NextRequest } from "next/server";

import { createLoginRouteResponse } from "@/modules/security/server/session-routes";

export async function POST(request: NextRequest) {
  return createLoginRouteResponse(request);
}
