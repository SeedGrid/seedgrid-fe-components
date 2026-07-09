"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  SgButton,
  SgCard,
  SgConfirmationDialog,
  SgSkeleton,
  SgStack,
  sgWhistle,
} from "@seedgrid/fe-components";

import { useI18n } from "@/i18n";
import { PageFrame, RouteGuard } from "@/modules/security";
import { billingUserConfig } from "@/modules/billing-user";

import type { SubscriptionResponse, UsageSummaryResponse } from "@seedgrid/fe-billing-user";

type BillingMeResponse = {
  subscription: SubscriptionResponse | null;
  usage: UsageSummaryResponse | null;
};

function formatCurrency(value: number | string | null | undefined) {
  if (value == null) return "-";
  const numeric = typeof value === "number" ? value : Number.parseFloat(value);
  if (!Number.isFinite(numeric)) return "-";
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "BRL" }).format(numeric);
}

export default function BillingPage() {
  return (
    <RouteGuard permissions={["BILLING_READ"]}>
      <BillingScreen />
    </RouteGuard>
  );
}

function BillingScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const [data, setData] = useState<BillingMeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [openingPortal, setOpeningPortal] = useState(false);
  const [busyAction, setBusyAction] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/billing/me", { cache: "no-store" });
      const payload = (await response.json()) as BillingMeResponse;
      setData(payload);
    } catch {
      sgWhistle.error({ message: t("billing.user.load_error") });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleOpenPortal() {
    setOpeningPortal(true);
    try {
      const response = await fetch("/api/billing/portal", { method: "POST" });
      const payload = (await response.json()) as { portalUrl: string };
      window.location.assign(payload.portalUrl);
    } catch {
      sgWhistle.error({ message: t("billing.user.portal_error") });
      setOpeningPortal(false);
    }
  }

  // Recebe as mensagens JÁ resolvidas (t() é chamado com literais nos call
  // sites): passar a chave crua como `string` faria o `t()` recusar (a união
  // de chaves é estrita).
  async function runAction(path: string, successMessage: string, errorMessage: string) {
    setBusyAction(true);
    try {
      const response = await fetch(path, { method: "POST" });
      if (!response.ok) throw new Error("action failed");
      sgWhistle.success({ message: successMessage });
      await load();
    } catch {
      sgWhistle.error({ message: errorMessage });
    } finally {
      setBusyAction(false);
    }
  }

  const subscription = data?.subscription ?? null;
  const usage = data?.usage ?? null;
  const usedPercent =
    usage && usage.cycle.includedRequests > 0
      ? Math.min(100, Math.round((usage.cycle.usedRequests / usage.cycle.includedRequests) * 100))
      : 0;

  return (
    <PageFrame
      title={t("billing.user.title")}
      description={t("billing.user.description")}
      actions={
        <SgStack direction="row" gap={8} wrap>
          <SgButton
            appearance="outline"
            severity="secondary"
            shape="rounded"
            label={t("billing.user.view_plans")}
            onClick={() => router.push(billingUserConfig.routes.plans)}
          />
          <SgButton
            appearance="solid"
            severity="primary"
            shape="rounded"
            label={t("billing.user.manage_action")}
            loading={openingPortal}
            disabled={loading || !subscription}
            onClick={() => void handleOpenPortal()}
          />
        </SgStack>
      }
    >
      {loading ? (
        <SgStack gap={16}>
          <SgSkeleton height={120} />
          <SgSkeleton height={120} />
        </SgStack>
      ) : !subscription ? (
        <SgCard cardStyle="outlined" title={t("billing.user.no_subscription.title")}>
          <SgStack gap={12}>
            <span>{t("billing.user.no_subscription.description")}</span>
            <div>
              <SgButton
                appearance="solid"
                severity="primary"
                shape="rounded"
                label={t("billing.user.no_subscription.action")}
                onClick={() => router.push(billingUserConfig.routes.plans)}
              />
            </div>
          </SgStack>
        </SgCard>
      ) : (
        <SgStack gap={16}>
          <SgCard cardStyle="elevated" title={t("billing.user.plan.title")}>
            <SgStack gap={12}>
              <SgStack gap={8}>
                <strong>{subscription.plan?.name ?? "-"}</strong>
                <span>
                  {t("billing.user.plan.price", {
                    price: formatCurrency(subscription.planTerm?.monthlyPrice),
                  })}
                </span>
                {subscription.pendingChange ? (
                  <span className="text-sm text-slate-500">
                    {t("billing.user.plan.pending_change", {
                      planName: subscription.pendingChange.planName ?? "-",
                    })}
                  </span>
                ) : null}
                {subscription.cancelAtPeriodEnd ? (
                  <span className="text-sm text-amber-600">
                    {t("billing.user.plan.cancel_scheduled")}
                  </span>
                ) : null}
              </SgStack>

              <SgStack direction="row" gap={8} wrap>
                {subscription.pendingChange ? (
                  <SgButton
                    appearance="outline"
                    severity="secondary"
                    shape="rounded"
                    label={t("billing.user.actions.cancel_scheduled_change")}
                    loading={busyAction}
                    disabled={busyAction}
                    onClick={() =>
                      void runAction(
                        "/api/billing/cancel-scheduled-change",
                        t("billing.user.actions.cancel_scheduled_change_success"),
                        t("billing.user.actions.cancel_scheduled_change_error"),
                      )
                    }
                  />
                ) : null}

                {subscription.cancelAtPeriodEnd ? (
                  <SgButton
                    appearance="solid"
                    severity="success"
                    shape="rounded"
                    label={t("billing.user.actions.reactivate")}
                    loading={busyAction}
                    disabled={busyAction}
                    onClick={() =>
                      void runAction(
                        "/api/billing/reactivate",
                        t("billing.user.actions.reactivate_success"),
                        t("billing.user.actions.reactivate_error"),
                      )
                    }
                  />
                ) : (
                  <SgButton
                    appearance="outline"
                    severity="danger"
                    shape="rounded"
                    label={t("billing.user.actions.cancel")}
                    disabled={busyAction}
                    onClick={() => setConfirmCancel(true)}
                  />
                )}
              </SgStack>
            </SgStack>
          </SgCard>

          {usage ? (
            <SgCard cardStyle="elevated" title={t("billing.user.usage.title")}>
              <SgStack gap={12}>
                {/* Barra de progresso inline (o fe-components nao expoe um
                    SgProgressBar hoje): trilho + preenchimento por width%. */}
                <div
                  className="h-2 w-full overflow-hidden rounded-full bg-slate-200"
                  role="progressbar"
                  aria-valuenow={usedPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, usedPercent))}%` }}
                  />
                </div>
                <span className="text-sm text-slate-600">
                  {t("billing.user.usage.summary", {
                    used: usage.cycle.usedRequests,
                    included: usage.cycle.includedRequests,
                  })}
                </span>
                {usage.cycle.overageRequests > 0 ? (
                  <span className="text-sm text-amber-600">
                    {t("billing.user.usage.overage", { overage: usage.cycle.overageRequests })}
                  </span>
                ) : null}
              </SgStack>
            </SgCard>
          ) : null}
        </SgStack>
      )}

      <SgConfirmationDialog
        open={confirmCancel}
        severity="danger"
        title={t("billing.user.actions.cancel_title")}
        message={t("billing.user.actions.cancel_message")}
        onCancel={() => setConfirmCancel(false)}
        onConfirm={() => {
          setConfirmCancel(false);
          void runAction(
            "/api/billing/cancel",
            t("billing.user.actions.cancel_success"),
            t("billing.user.actions.cancel_error"),
          );
        }}
      />
    </PageFrame>
  );
}
