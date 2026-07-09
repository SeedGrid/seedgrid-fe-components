import { redirect } from "next/navigation";

import { securityConfig } from "@/modules/security";

export default function LegacyLoginPage() {
  redirect(securityConfig.routes.login);
}
