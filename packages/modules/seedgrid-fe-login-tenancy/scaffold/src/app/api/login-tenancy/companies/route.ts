import { toRouteResponse } from "@seedgrid/fe-security/server";

import { getLoginTenancyServer } from "@/modules/login-tenancy/server";

export async function GET() {
  return toRouteResponse(async () => {
    const tenancy = await getLoginTenancyServer();
    return tenancy.listMyCompanies();
  });
}
