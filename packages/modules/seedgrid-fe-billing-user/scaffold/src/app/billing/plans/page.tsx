"use client";

import { useCallback, useEffect, useState } from "react";

import {
  SgBadge,
  SgButton,
  SgCard,
  SgConfirmationDialog,
  SgGrid,
  SgSkeleton,
  SgStack,
  sgWhistle,
} from "@seedgrid/fe-components";

import { useI18n } from "@/i18n";
import { PageFrame, RouteGuard } from "@/modules/security";
import { billingUserConfig } from "@/modules/billing-user";
import type {
  ChangePreviewResponse,
  PlanCatalogItem,
  PlansCatalogResponse,
} from "@seedgrid/fe-billing-user";

export default function PlansCatalogPage() {
  return (
    <RouteGuard permissions={["BILLING_READ"]}>
      <PlansCatalogScreen />
    </RouteGuard>
  );
}

function formatCurrency(value: number | string | null | undefined) {
  if (value == null) return "-";
  const numeric = typeof value === "number" ? value : Number.parseFloat(value);
  if (!Number.isFinite(numeric)) return "-";
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "BRL" }).format(numeric);
}

function PlansCatalogScreen() {
  const { t } = useI18n();
  const [catalog, setCatalog] = useState<PlansCatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyPlanId, setBusyPlanId] = useState<string | null>(null);
  const [pendingChange, setPendingChange] = useState<{
    item: PlanCatalogItem;
    preview: ChangePreviewResponse;
  } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/billing/plans", { cache: "no-store" });
      if (!response.ok) throw new Error("load failed");
      setCatalog((await response.json()) as PlansCatalogResponse);
    } catch {
      sgWhistle.error({ message: t("billing.user.plans_catalog.load_error") });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const items = catalog?.items ?? [];
  const hasSubscription = items.some((item) => item.current);

  async function handleSubscribe(item: PlanCatalogItem) {
    setBusyPlanId(item.planId);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: item.planId }),
      });
      if (!response.ok) throw new Error("checkout failed");
      const payload = (await response.json()) as { checkoutUrl: string };
      window.location.assign(payload.checkoutUrl);
    } catch {
      sgWhistle.error({ message: t("billing.user.plans_catalog.checkout_error") });
      setBusyPlanId(null);
    }
  }

  async function handleRequestChange(item: PlanCatalogItem) {
    setBusyPlanId(item.planId);
    try {
      const response = await fetch(
        `/api/billing/change-preview?planId=${encodeURIComponent(item.planId)}`,
        { cache: "no-store" },
      );
      if (!response.ok) throw new Error("preview failed");
      const preview = (await response.json()) as ChangePreviewResponse;
      setPendingChange({ item, preview });
    } catch {
      sgWhistle.error({ message: t("billing.user.plans_catalog.preview_error") });
    } finally {
      setBusyPlanId(null);
    }
  }

  async function confirmChange() {
    if (!pendingChange) return;
    const { item } = pendingChange;
    setBusyPlanId(item.planId);
    setPendingChange(null);
    try {
      const response = await fetch("/api/billing/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: item.planId }),
      });
      if (!response.ok) throw new Error("change failed");
      sgWhistle.success({ message: t("billing.user.plans_catalog.change_success") });
      await load();
    } catch {
      sgWhistle.error({ message: t("billing.user.plans_catalog.change_error") });
    } finally {
      setBusyPlanId(null);
    }
  }

  const changeMessage = pendingChange
    ? pendingChange.preview.downgrade
      ? t("billing.user.plans_catalog.confirm.downgrade")
      : pendingChange.preview.immediate
        ? t("billing.user.plans_catalog.confirm.immediate", {
            amount: formatCurrency(pendingChange.preview.amountDue),
          })
        : t("billing.user.plans_catalog.confirm.upgrade")
    : "";

  return (
    <PageFrame
      title={t("billing.user.plans_catalog.title")}
      description={t("billing.user.plans_catalog.description")}
    >
      {loading ? (
        <SgGrid minItemWidth={280} gap={16}>
          <SgSkeleton height={220} />
          <SgSkeleton height={220} />
          <SgSkeleton height={220} />
        </SgGrid>
      ) : (
        <SgStack gap={16}>
          {catalog?.pendingChange ? (
            <SgCard cardStyle="outlined" title={t("billing.user.plans_catalog.pending.title")}>
              {t("billing.user.plans_catalog.pending.description", {
                planName: catalog.pendingChange.planName,
              })}
            </SgCard>
          ) : null}

          <SgGrid minItemWidth={280} gap={16}>
            {items.map((item) => (
              <SgCard
                key={item.planId}
                cardStyle={item.current ? "elevated" : "outlined"}
                title={item.name}
              >
                <SgStack gap={12}>
                  {item.current ? (
                    <SgBadge
                      value={t("billing.user.plans_catalog.current")}
                      severity="success"
                      badgeStyle="soft"
                      size="sm"
                    />
                  ) : null}
                  <div className="text-2xl font-semibold text-slate-900">
                    {formatCurrency(item.monthlyPrice)}
                    <span className="text-sm font-normal text-slate-500">
                      {" "}
                      {t("billing.user.plans_catalog.per_month")}
                    </span>
                  </div>
                  {item.description ? (
                    <p className="text-sm text-slate-600">{item.description}</p>
                  ) : null}
                  <p className="text-sm text-slate-600">
                    {t("billing.user.plans_catalog.requests", {
                      requests: item.monthlyRequests.toLocaleString(),
                    })}
                  </p>

                  {item.current ? (
                    <SgButton
                      appearance="outline"
                      severity="secondary"
                      shape="rounded"
                      label={t("billing.user.plans_catalog.current_action")}
                      disabled
                    />
                  ) : !item.checkoutEnabled ? (
                    <SgButton
                      appearance="outline"
                      severity="secondary"
                      shape="rounded"
                      label={t("billing.user.plans_catalog.unavailable")}
                      disabled
                    />
                  ) : hasSubscription ? (
                    <SgButton
                      appearance="solid"
                      severity="primary"
                      shape="rounded"
                      label={t("billing.user.plans_catalog.change_action")}
                      loading={busyPlanId === item.planId}
                      disabled={busyPlanId !== null}
                      onClick={() => void handleRequestChange(item)}
                    />
                  ) : (
                    <SgButton
                      appearance="solid"
                      severity="primary"
                      shape="rounded"
                      label={t("billing.user.plans_catalog.subscribe_action")}
                      loading={busyPlanId === item.planId}
                      disabled={busyPlanId !== null}
                      onClick={() => void handleSubscribe(item)}
                    />
                  )}
                </SgStack>
              </SgCard>
            ))}
          </SgGrid>

          {!items.length ? (
            <SgCard cardStyle="outlined" title={t("billing.user.plans_catalog.empty_title")}>
              {t("billing.user.plans_catalog.empty")}
            </SgCard>
          ) : null}
        </SgStack>
      )}

      <SgConfirmationDialog
        open={Boolean(pendingChange)}
        severity="primary"
        title={t("billing.user.plans_catalog.confirm.title")}
        message={changeMessage}
        onCancel={() => setPendingChange(null)}
        onConfirm={confirmChange}
      />
    </PageFrame>
  );
}
