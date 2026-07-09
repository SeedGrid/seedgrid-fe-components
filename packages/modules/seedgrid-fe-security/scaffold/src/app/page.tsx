"use client";

import { RouteGuard } from "@/modules/security";
import { SecurityDashboard } from "@/modules/security/components/SecurityDashboard";

export default function DashboardPage() {
  return (
    <RouteGuard>
      <SecurityDashboard />
    </RouteGuard>
  );
}
