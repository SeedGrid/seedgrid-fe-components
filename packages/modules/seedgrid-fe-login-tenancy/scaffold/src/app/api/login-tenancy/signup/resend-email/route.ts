import { NextRequest } from "next/server";
import { toRouteResponse } from "@seedgrid/fe-security/server";

import { getLoginTenancyServer } from "@/modules/login-tenancy/server";
import type { ResendSignupEmailRequest } from "@seedgrid/fe-login-tenancy";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as ResendSignupEmailRequest;

  return toRouteResponse(async () => {
    const tenancy = await getLoginTenancyServer();
    await tenancy.resendSignupEmail(body);
    return { ok: true };
  });
}
