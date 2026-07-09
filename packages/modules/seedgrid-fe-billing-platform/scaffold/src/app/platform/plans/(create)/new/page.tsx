"use client";

import { RouteGuard } from "@/modules/security";
import { PlanEditor } from "../../editors/PlanEditor";

export default function NewPlanPage() {
  return (
    <RouteGuard permissions={["PLAN_CREATE"]}>
      <PlanEditor />
    </RouteGuard>
  );
}
