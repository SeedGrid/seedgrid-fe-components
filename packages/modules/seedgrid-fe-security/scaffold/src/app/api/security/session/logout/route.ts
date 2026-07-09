import { createLogoutRouteResponse } from "@/modules/security/server/session-routes";

export async function POST() {
  return createLogoutRouteResponse();
}
