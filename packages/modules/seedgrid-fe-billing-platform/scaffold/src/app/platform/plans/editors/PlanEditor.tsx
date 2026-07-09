"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  SgButton,
  SgCard,
  SgGrid,
  SgInputText,
  SgInputTextArea,
  SgSkeleton,
  SgStack,
  SgToggleSwitch,
  sgWhistle,
} from "@seedgrid/fe-components";

import { useI18n } from "@/i18n";
import { PageFrame, extractApiMessage } from "@/modules/security";
import { billingPlatformConfig } from "@/modules/billing-platform";
import type { CreatePlanRequest, PlanEntry } from "@seedgrid/fe-billing-platform";

type PlanFormValues = {
  code: string;
  name: string;
  description: string;
  active: boolean;
  upgradePromptThresholdPercent: string;
  quotaWarningRemainingPercent: string;
  quotaCriticalRemainingPercent: string;
};

function emptyValues(): PlanFormValues {
  return {
    code: "",
    name: "",
    description: "",
    active: true,
    upgradePromptThresholdPercent: "80",
    quotaWarningRemainingPercent: "20",
    quotaCriticalRemainingPercent: "5",
  };
}

function fromPlan(plan: PlanEntry): PlanFormValues {
  return {
    code: plan.code ?? "",
    name: plan.name ?? "",
    description: plan.description ?? "",
    active: plan.active,
    upgradePromptThresholdPercent: String(plan.upgradePromptThresholdPercent ?? ""),
    quotaWarningRemainingPercent: String(plan.quotaWarningRemainingPercent ?? ""),
    quotaCriticalRemainingPercent: String(plan.quotaCriticalRemainingPercent ?? ""),
  };
}

function toNumberOrUndefined(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function buildPayload(values: PlanFormValues): CreatePlanRequest {
  return {
    code: values.code.trim() || undefined,
    name: values.name.trim(),
    description: values.description.trim() || undefined,
    active: values.active,
    upgradePromptThresholdPercent: toNumberOrUndefined(values.upgradePromptThresholdPercent),
    quotaWarningRemainingPercent: toNumberOrUndefined(values.quotaWarningRemainingPercent),
    quotaCriticalRemainingPercent: toNumberOrUndefined(values.quotaCriticalRemainingPercent),
  };
}

export function PlanEditor({ publicId }: { publicId?: string }) {
  const router = useRouter();
  const { t } = useI18n();
  const isEditing = Boolean(publicId);

  const [values, setValues] = useState<PlanFormValues>(emptyValues());
  const [loading, setLoading] = useState<boolean>(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!publicId) return;

    let cancelled = false;
    setLoading(true);

    void (async () => {
      try {
        const response = await fetch(`/api/platform/plans/${publicId}`, { cache: "no-store" });
        if (!response.ok) throw new Error("load failed");
        const plan = (await response.json()) as PlanEntry;
        if (!cancelled) setValues(fromPlan(plan));
      } catch {
        if (!cancelled) {
          sgWhistle.error({ message: t("billing.platform.plan_editor.load_error") });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [publicId, t]);

  function update<K extends keyof PlanFormValues>(key: K, value: PlanFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function numberInputProps(key: keyof PlanFormValues) {
    return {
      value: values[key] as string,
      inputMode: "numeric" as const,
      onChange: (event: { target: { value: string } }) =>
        update(key, event.target.value.replace(/[^\d]/g, "") as PlanFormValues[typeof key]),
    };
  }

  async function handleSubmit() {
    if (!values.name.trim()) {
      sgWhistle.error({ message: t("billing.platform.plan_editor.name_required") });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(
        isEditing ? `/api/platform/plans/${publicId}` : "/api/platform/plans",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload(values)),
        },
      );

      if (!response.ok) {
        const problem = (await response.json().catch(() => null)) as { detail?: string } | null;
        sgWhistle.error({
          message: problem?.detail ?? t("billing.platform.plan_editor.save_error"),
        });
        return;
      }

      sgWhistle.success({ message: t("billing.platform.plan_editor.save_success") });
      router.push(billingPlatformConfig.routes.plans);
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t("billing.platform.plan_editor.save_error"),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageFrame
      title={
        isEditing
          ? t("billing.platform.plan_editor.edit_title")
          : t("billing.platform.plan_editor.new_title")
      }
      description={t("billing.platform.plan_editor.description")}
    >
      {loading ? (
        <SgStack gap={12}>
          <SgSkeleton height={56} />
          <SgSkeleton height={56} />
          <SgSkeleton height={120} />
        </SgStack>
      ) : (
        <SgStack gap={20}>
          <SgCard cardStyle="elevated" title={t("billing.platform.plan_editor.section.identity")}>
            <SgStack gap={16}>
              <SgGrid minItemWidth={240} gap={16}>
                <SgInputText
                  id="plan-name"
                  label={t("billing.platform.plan_editor.fields.name")}
                  required
                  inputProps={{
                    value: values.name,
                    onChange: (event) => update("name", event.target.value),
                  }}
                />
                <SgInputText
                  id="plan-code"
                  label={t("billing.platform.plan_editor.fields.code")}
                  hintText={t("billing.platform.plan_editor.fields.code_hint")}
                  inputProps={{
                    value: values.code,
                    onChange: (event) => update("code", event.target.value),
                  }}
                />
              </SgGrid>
              <SgInputTextArea
                id="plan-description"
                label={t("billing.platform.plan_editor.fields.description")}
                textareaProps={{
                  value: values.description,
                  onChange: (event) => update("description", event.target.value),
                }}
              />
              <SgToggleSwitch
                id="plan-active"
                label={t("billing.platform.plan_editor.fields.active")}
                checked={values.active}
                onChange={(checked) => update("active", checked)}
              />
            </SgStack>
          </SgCard>

          <SgCard cardStyle="elevated" title={t("billing.platform.plan_editor.section.quota")}>
            <SgGrid minItemWidth={220} gap={16}>
              <SgInputText
                id="plan-upgrade-threshold"
                label={t("billing.platform.plan_editor.fields.upgrade_threshold")}
                hintText={t("billing.platform.plan_editor.fields.percent_hint")}
                inputProps={numberInputProps("upgradePromptThresholdPercent")}
              />
              <SgInputText
                id="plan-quota-warning"
                label={t("billing.platform.plan_editor.fields.quota_warning")}
                hintText={t("billing.platform.plan_editor.fields.percent_hint")}
                inputProps={numberInputProps("quotaWarningRemainingPercent")}
              />
              <SgInputText
                id="plan-quota-critical"
                label={t("billing.platform.plan_editor.fields.quota_critical")}
                hintText={t("billing.platform.plan_editor.fields.percent_hint")}
                inputProps={numberInputProps("quotaCriticalRemainingPercent")}
              />
            </SgGrid>
          </SgCard>

          <SgStack direction="row" gap={12} wrap>
            <SgButton
              appearance="solid"
              severity="primary"
              shape="rounded"
              label={
                saving
                  ? t("billing.platform.plan_editor.saving")
                  : t("billing.platform.plan_editor.save")
              }
              loading={saving}
              disabled={saving}
              onClick={() => void handleSubmit()}
            />
            <SgButton
              appearance="outline"
              severity="secondary"
              shape="rounded"
              label={t("billing.platform.common.cancel")}
              disabled={saving}
              onClick={() => router.push(billingPlatformConfig.routes.plans)}
            />
          </SgStack>
        </SgStack>
      )}
    </PageFrame>
  );
}
