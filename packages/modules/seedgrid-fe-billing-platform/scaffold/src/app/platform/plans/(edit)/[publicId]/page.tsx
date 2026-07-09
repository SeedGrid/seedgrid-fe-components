"use client";

import { useParams } from "next/navigation";

import { SgStack } from "@seedgrid/fe-components";

import { RouteGuard } from "@/modules/security";
import { PlanEditor } from "../../editors/PlanEditor";
import { TermsSection } from "../../editors/TermsSection";

export default function EditPlanPage() {
  const params = useParams<{ publicId: string }>();
  const publicId = params.publicId;

  return (
    <RouteGuard permissions={["PLAN_READ"]}>
      <SgStack gap={24}>
        <PlanEditor publicId={publicId} />
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
          <TermsSection planPublicId={publicId} />
        </div>
      </SgStack>
    </RouteGuard>
  );
}
