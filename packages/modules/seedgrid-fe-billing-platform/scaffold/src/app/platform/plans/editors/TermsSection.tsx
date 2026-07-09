"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  SgBadge,
  SgButton,
  SgCard,
  SgConfirmationDialog,
  SgDatatable,
  SgGrid,
  SgInputText,
  SgStack,
  sgWhistle,
} from "@seedgrid/fe-components";

import { useI18n } from "@/i18n";
import { extractApiMessage, useCrudPermission } from "@/modules/security";
import type { PaginatedResult } from "@seedgrid/fe-security";
import type {
  CreatePlanTermRequest,
  PlanTermEntry,
  PlanTermStatus,
} from "@seedgrid/fe-billing-platform";

type PaginatedTerms = PaginatedResult<PlanTermEntry>;

type NewTermValues = {
  monthlyPrice: string;
  monthlyRequests: string;
  maxUsers: string;
  overagePrice: string;
  effectiveFrom: string;
};

function emptyTerm(): NewTermValues {
  return {
    monthlyPrice: "",
    monthlyRequests: "",
    maxUsers: "",
    overagePrice: "",
    effectiveFrom: "",
  };
}

function statusSeverity(status: PlanTermStatus) {
  switch (status) {
    case "CURRENT":
      return "success" as const;
    case "SCHEDULED":
      return "info" as const;
    default:
      return "neutral" as const;
  }
}

function formatMoney(value: number | string) {
  const numeric = typeof value === "number" ? value : Number.parseFloat(value);
  if (!Number.isFinite(numeric)) return String(value);
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "BRL" }).format(numeric);
}

function requiredNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function TermsSection({ planPublicId }: { planPublicId: string }) {
  const { t } = useI18n();
  const permissions = useCrudPermission("PLAN");
  const [terms, setTerms] = useState<PlanTermEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState<NewTermValues>(emptyTerm());
  const [creating, setCreating] = useState(false);
  const [termToDelete, setTermToDelete] = useState<PlanTermEntry | null>(null);
  const [busyTermId, setBusyTermId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/platform/plans/${planPublicId}/terms`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("load failed");
      const payload = (await response.json()) as PaginatedTerms;
      setTerms(payload.items ?? []);
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t("billing.platform.terms.load_error"),
      });
    } finally {
      setLoading(false);
    }
  }, [planPublicId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  function update<K extends keyof NewTermValues>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleCreate() {
    const monthlyPrice = requiredNumber(values.monthlyPrice);
    const overagePrice = requiredNumber(values.overagePrice);
    if (monthlyPrice === null || overagePrice === null) {
      sgWhistle.error({ message: t("billing.platform.terms.price_required") });
      return;
    }

    const payload: CreatePlanTermRequest = {
      monthlyPrice,
      overagePrice,
      monthlyRequests: requiredNumber(values.monthlyRequests) ?? undefined,
      maxUsers: requiredNumber(values.maxUsers) ?? undefined,
      effectiveFrom: values.effectiveFrom.trim() || undefined,
    };

    setCreating(true);
    try {
      const response = await fetch(`/api/platform/plans/${planPublicId}/terms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const problem = (await response.json().catch(() => null)) as { detail?: string } | null;
        sgWhistle.error({ message: problem?.detail ?? t("billing.platform.terms.create_error") });
        return;
      }
      const created = (await response.json()) as PlanTermEntry & {
        published?: boolean;
        publishError?: string | null;
      };
      if (created.publishError) {
        sgWhistle.error({
          message: t("billing.platform.terms.publish_warning", { error: created.publishError }),
        });
      } else {
        sgWhistle.success({ message: t("billing.platform.terms.create_success") });
      }
      setValues(emptyTerm());
      await load();
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t("billing.platform.terms.create_error"),
      });
    } finally {
      setCreating(false);
    }
  }

  async function runTermAction(
    term: PlanTermEntry,
    action: "publish" | "archive",
  ) {
    setBusyTermId(term.publicId);
    try {
      const response = await fetch(
        `/api/platform/plans/${planPublicId}/terms/${term.publicId}/${action}`,
        { method: "POST" },
      );
      if (!response.ok) throw new Error("action failed");
      sgWhistle.success({ message: t(`billing.platform.terms.${action}_success`) });
      await load();
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t(`billing.platform.terms.${action}_error`),
      });
    } finally {
      setBusyTermId(null);
    }
  }

  async function handleDelete() {
    if (!termToDelete) return;
    setBusyTermId(termToDelete.publicId);
    try {
      const response = await fetch(
        `/api/platform/plans/${planPublicId}/terms/${termToDelete.publicId}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error("delete failed");
      sgWhistle.success({ message: t("billing.platform.terms.delete_success") });
      setTermToDelete(null);
      await load();
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t("billing.platform.terms.delete_error"),
      });
    } finally {
      setBusyTermId(null);
    }
  }

  const columns = useMemo(
    () => [
      {
        field: "effectiveFrom",
        header: t("billing.platform.terms.column.effective_from"),
        body: (term: PlanTermEntry) => term.effectiveFrom?.slice(0, 10) ?? "-",
      },
      {
        field: "monthlyPrice",
        header: t("billing.platform.terms.column.monthly_price"),
        body: (term: PlanTermEntry) => formatMoney(term.monthlyPrice),
      },
      {
        field: "monthlyRequests",
        header: t("billing.platform.terms.column.monthly_requests"),
        body: (term: PlanTermEntry) => term.monthlyRequests.toLocaleString(),
      },
      {
        field: "status",
        header: t("billing.platform.terms.column.status"),
        body: (term: PlanTermEntry) => (
          <SgBadge
            value={t(`billing.platform.terms.status.${term.status}`)}
            severity={statusSeverity(term.status)}
            badgeStyle="soft"
            size="sm"
          />
        ),
      },
      {
        header: t("billing.platform.common.actions"),
        body: (term: PlanTermEntry) =>
          term.status === "SCHEDULED" && permissions.canUpdate ? (
            <SgStack direction="row" gap={8} wrap data-sg-stop-row-select="true">
              <SgButton
                appearance="outline"
                severity="success"
                shape="rounded"
                label={t("billing.platform.terms.action.publish")}
                loading={busyTermId === term.publicId}
                disabled={busyTermId !== null}
                onClick={() => void runTermAction(term, "publish")}
              />
              <SgButton
                appearance="outline"
                severity="secondary"
                shape="rounded"
                label={t("billing.platform.terms.action.archive")}
                disabled={busyTermId !== null}
                onClick={() => void runTermAction(term, "archive")}
              />
              {permissions.canDelete ? (
                <SgButton
                  appearance="outline"
                  severity="danger"
                  shape="rounded"
                  label={t("billing.platform.common.delete")}
                  disabled={busyTermId !== null}
                  onClick={() => setTermToDelete(term)}
                />
              ) : null}
            </SgStack>
          ) : (
            <span className="text-sm text-slate-400">—</span>
          ),
      },
    ],
    [busyTermId, permissions.canDelete, permissions.canUpdate, t],
  );

  return (
    <SgCard cardStyle="elevated" title={t("billing.platform.terms.title")}>
      <SgStack gap={20}>
        <SgDatatable<PlanTermEntry>
          title=" "
          value={terms}
          columns={columns}
          dataKey="publicId"
          loading={loading}
          emptyMessage={t("billing.platform.terms.empty")}
        />

        {permissions.canCreate ? (
          <SgCard cardStyle="outlined" title={t("billing.platform.terms.new_title")}>
            <SgStack gap={16}>
              <SgGrid minItemWidth={200} gap={16}>
                <SgInputText
                  id="term-monthly-price"
                  label={t("billing.platform.terms.fields.monthly_price")}
                  required
                  inputProps={{
                    value: values.monthlyPrice,
                    inputMode: "decimal",
                    onChange: (event) => update("monthlyPrice", event.target.value),
                  }}
                />
                <SgInputText
                  id="term-overage-price"
                  label={t("billing.platform.terms.fields.overage_price")}
                  required
                  inputProps={{
                    value: values.overagePrice,
                    inputMode: "decimal",
                    onChange: (event) => update("overagePrice", event.target.value),
                  }}
                />
                <SgInputText
                  id="term-monthly-requests"
                  label={t("billing.platform.terms.fields.monthly_requests")}
                  inputProps={{
                    value: values.monthlyRequests,
                    inputMode: "numeric",
                    onChange: (event) =>
                      update("monthlyRequests", event.target.value.replace(/[^\d]/g, "")),
                  }}
                />
                <SgInputText
                  id="term-max-users"
                  label={t("billing.platform.terms.fields.max_users")}
                  inputProps={{
                    value: values.maxUsers,
                    inputMode: "numeric",
                    onChange: (event) =>
                      update("maxUsers", event.target.value.replace(/[^\d]/g, "")),
                  }}
                />
                <SgInputText
                  id="term-effective-from"
                  label={t("billing.platform.terms.fields.effective_from")}
                  hintText={t("billing.platform.terms.fields.effective_from_hint")}
                  inputProps={{
                    value: values.effectiveFrom,
                    type: "date",
                    onChange: (event) => update("effectiveFrom", event.target.value),
                  }}
                />
              </SgGrid>
              <SgButton
                appearance="solid"
                severity="primary"
                shape="rounded"
                label={
                  creating
                    ? t("billing.platform.terms.creating")
                    : t("billing.platform.terms.create")
                }
                loading={creating}
                disabled={creating}
                onClick={() => void handleCreate()}
              />
            </SgStack>
          </SgCard>
        ) : null}
      </SgStack>

      <SgConfirmationDialog
        open={Boolean(termToDelete)}
        severity="danger"
        title={t("billing.platform.terms.delete_title")}
        message={t("billing.platform.terms.delete_message")}
        onCancel={() => setTermToDelete(null)}
        onConfirm={handleDelete}
      />
    </SgCard>
  );
}
