import { NextRequest } from "next/server";
import { toRouteResponse } from "@seedgrid/fe-security/server";

import { getLoginTenancyServer } from "@/modules/login-tenancy/server";
import type { ConfirmSignupRequest } from "@seedgrid/fe-login-tenancy";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as ConfirmSignupRequest;

  return toRouteResponse(async () => {
    const tenancy = await getLoginTenancyServer();
    return tenancy.confirmSignup(body);
  });
}
