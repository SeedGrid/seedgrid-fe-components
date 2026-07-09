import { NextRequest } from "next/server";

import { createRefreshRouteResponse } from "@/modules/security/server/session-routes";

export async function POST(request: NextRequest) {
  return createRefreshRouteResponse(request);
}
