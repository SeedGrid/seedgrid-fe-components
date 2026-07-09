"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  SgBadge,
  SgButton,
  SgConfirmationDialog,
  SgDatatable,
  SgStack,
  sgWhistle,
} from "@seedgrid/fe-components";
import { Pencil, Trash2 } from "lucide-react";

import { useI18n } from "@/i18n";
import { PageFrame, RouteGuard, extractApiMessage, useCrudPermission } from "@/modules/security";
import { billingPlatformConfig } from "@/modules/billing-platform";
import type { PaginatedResult } from "@seedgrid/fe-security";
import type { PlanEntry } from "@seedgrid/fe-billing-platform";

export default function PlansListPage() {
  return (
    <RouteGuard permissions={["PLAN_READ"]}>
      <PlansListScreen />
    </RouteGuard>
  );
}

function formatMoney(value: number | string | null | undefined) {
  if (value == null) return "-";
  const numeric = typeof value === "number" ? value : Number.parseFloat(value);
  if (!Number.isFinite(numeric)) return "-";
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "BRL" }).format(numeric);
}

function PlansListScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const permissions = useCrudPermission("PLAN");
  const [plans, setPlans] = useState<PlanEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [planToDelete, setPlanToDelete] = useState<PlanEntry | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/platform/plans", { cache: "no-store" });
      if (!response.ok) throw new Error("load failed");
      const payload = (await response.json()) as PaginatedResult<PlanEntry>;
      setPlans(payload.items ?? []);
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t("billing.platform.plans.load_error"),
      });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const columns = useMemo(
    () => [
      {
        field: "name",
        header: t("billing.platform.plans.column.name"),
      },
      {
        field: "code",
        header: t("billing.platform.plans.column.code"),
        body: (plan: PlanEntry) => plan.code || "-",
      },
      {
        field: "currentTerm",
        header: t("billing.platform.plans.column.price"),
        body: (plan: PlanEntry) =>
          plan.currentTerm ? formatMoney(plan.currentTerm.monthlyPrice) : "-",
      },
      {
        field: "active",
        header: t("billing.platform.plans.column.status"),
        body: (plan: PlanEntry) => (
          <SgBadge
            value={
              plan.active
                ? t("billing.platform.plans.status.active")
                : t("billing.platform.plans.status.inactive")
            }
            severity={plan.active ? "success" : "neutral"}
            badgeStyle="soft"
            size="sm"
          />
        ),
      },
      {
        header: t("billing.platform.common.actions"),
        body: (plan: PlanEntry) => (
          <SgStack direction="row" wrap gap={8} data-sg-stop-row-select="true">
            <SgButton
              appearance="ghost"
              severity="info"
              iconOnly
              leftIcon={<Pencil size={16} />}
              title={
                permissions.canUpdate
                  ? t("billing.platform.plans.action.edit")
                  : t("billing.platform.plans.action.view")
              }
              aria-label={
                permissions.canUpdate
                  ? t("billing.platform.plans.action.edit")
                  : t("billing.platform.plans.action.view")
              }
              onClick={() => router.push(billingPlatformConfig.routes.plan(plan.publicId))}
              className="border border-slate-200/80 bg-slate-50/55 text-slate-700 hover:border-sky-200 hover:bg-slate-50 hover:text-sky-700"
            />
            {permissions.canDelete ? (
              <SgButton
                appearance="ghost"
                severity="danger"
                iconOnly
                leftIcon={<Trash2 size={16} />}
                title={t("billing.platform.common.delete")}
                aria-label={t("billing.platform.common.delete")}
                onClick={() => setPlanToDelete(plan)}
                className="border border-rose-200/80 bg-rose-50/45 text-rose-600 hover:border-rose-200 hover:bg-rose-50/70 hover:text-rose-700"
              />
            ) : null}
          </SgStack>
        ),
      },
    ],
    [permissions.canDelete, permissions.canUpdate, router, t],
  );

  async function handleDelete() {
    if (!planToDelete) return;
    try {
      const response = await fetch(`/api/platform/plans/${planToDelete.publicId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("delete failed");
      sgWhistle.success({ message: t("billing.platform.plans.delete_success") });
      setPlanToDelete(null);
      await load();
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t("billing.platform.plans.delete_error"),
      });
    }
  }

  return (
    <PageFrame
      title={t("billing.platform.plans.title")}
      description={t("billing.platform.plans.description")}
      readonlyLabel={permissions.isReadOnly ? t("billing.platform.common.readonly") : null}
      actions={
        permissions.canCreate ? (
          <SgButton
            appearance="solid"
            severity="primary"
            shape="rounded"
            label={t("billing.platform.plans.new")}
            onClick={() => router.push(billingPlatformConfig.routes.newPlan)}
          />
        ) : undefined
      }
    >
      <SgDatatable<PlanEntry>
        title=" "
        value={plans}
        columns={columns}
        dataKey="publicId"
        loading={loading}
        emptyMessage={t("billing.platform.plans.empty")}
      />

      <SgConfirmationDialog
        open={Boolean(planToDelete)}
        severity="danger"
        title={t("billing.platform.plans.delete_title")}
        message={t("billing.platform.plans.delete_message")}
        onCancel={() => setPlanToDelete(null)}
        onConfirm={handleDelete}
      />
    </PageFrame>
  );
}
