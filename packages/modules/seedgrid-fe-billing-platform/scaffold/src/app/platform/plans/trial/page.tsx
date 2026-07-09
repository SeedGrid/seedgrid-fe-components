"use client";

import { useCallback, useEffect, useState } from "react";

import {
  SgButton,
  SgCard,
  SgInputText,
  SgSkeleton,
  SgStack,
  sgWhistle,
} from "@seedgrid/fe-components";

import { useI18n } from "@/i18n";
import { PageFrame, RouteGuard, extractApiMessage, useCrudPermission } from "@/modules/security";
import type { TrialConfig } from "@seedgrid/fe-billing-platform";

export default function TrialPage() {
  return (
    <RouteGuard permissions={["PLAN_READ"]}>
      <TrialScreen />
    </RouteGuard>
  );
}

function TrialScreen() {
  const { t } = useI18n();
  const permissions = useCrudPermission("PLAN");
  const [trial, setTrial] = useState<TrialConfig | null>(null);
  const [monthlyRequests, setMonthlyRequests] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/platform/plans/trial", { cache: "no-store" });
      if (!response.ok) throw new Error("load failed");
      const payload = (await response.json()) as TrialConfig;
      setTrial(payload);
      setMonthlyRequests(String(payload.monthlyRequests ?? ""));
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t("billing.platform.trial.load_error"),
      });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSave() {
    const parsed = Number(monthlyRequests.trim());
    if (!Number.isFinite(parsed) || parsed < 0) {
      sgWhistle.error({ message: t("billing.platform.trial.invalid_requests") });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/platform/plans/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthlyRequests: parsed }),
      });
      if (!response.ok) {
        const problem = (await response.json().catch(() => null)) as { detail?: string } | null;
        sgWhistle.error({ message: problem?.detail ?? t("billing.platform.trial.save_error") });
        return;
      }
      const updated = (await response.json()) as TrialConfig;
      setTrial(updated);
      setMonthlyRequests(String(updated.monthlyRequests ?? ""));
      sgWhistle.success({ message: t("billing.platform.trial.save_success") });
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t("billing.platform.trial.save_error"),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageFrame
      title={t("billing.platform.trial.title")}
      description={t("billing.platform.trial.description")}
      readonlyLabel={permissions.isReadOnly ? t("billing.platform.common.readonly") : null}
    >
      {loading ? (
        <SgSkeleton height={140} />
      ) : (
        <SgCard cardStyle="elevated" title={t("billing.platform.trial.section")}>
          <SgStack gap={16}>
            <SgInputText
              id="trial-monthly-requests"
              label={t("billing.platform.trial.fields.monthly_requests")}
              hintText={t("billing.platform.trial.fields.monthly_requests_hint")}
              inputProps={{
                value: monthlyRequests,
                inputMode: "numeric",
                onChange: (event) =>
                  setMonthlyRequests(event.target.value.replace(/[^\d]/g, "")),
                disabled: !permissions.canUpdate,
              }}
            />
            {trial ? (
              <p className="text-sm text-slate-500">
                {t("billing.platform.trial.linked_plan", { plan: trial.planPublicId })}
              </p>
            ) : null}
            {permissions.canUpdate ? (
              <div>
                <SgButton
                  appearance="solid"
                  severity="primary"
                  shape="rounded"
                  label={
                    saving
                      ? t("billing.platform.trial.saving")
                      : t("billing.platform.trial.save")
                  }
                  loading={saving}
                  disabled={saving}
                  onClick={() => void handleSave()}
                />
              </div>
            ) : null}
          </SgStack>
        </SgCard>
      )}
    </PageFrame>
  );
}
