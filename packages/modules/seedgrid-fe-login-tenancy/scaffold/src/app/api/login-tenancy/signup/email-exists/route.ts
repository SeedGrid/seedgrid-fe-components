import { NextRequest } from "next/server";
import { toRouteResponse } from "@seedgrid/fe-security/server";

import { getLoginTenancyServer } from "@/modules/login-tenancy/server";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email") ?? "";

  return toRouteResponse(async () => {
    const tenancy = await getLoginTenancyServer();
    return tenancy.emailExists(email);
  });
}
