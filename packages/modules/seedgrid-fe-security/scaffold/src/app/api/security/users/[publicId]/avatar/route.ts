import { NextRequest } from "next/server";

import { createUserAvatarRouteResponse } from "@/modules/security/server/avatar-routes";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ publicId: string }> }
) {
  const params = await context.params;

  return createUserAvatarRouteResponse(
    params.publicId,
    request.nextUrl.searchParams.get("v")
  );
}
