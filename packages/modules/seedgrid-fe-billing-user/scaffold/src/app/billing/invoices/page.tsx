"use client";

import { useCallback, useEffect, useState } from "react";

import {
  SgButton,
  SgCard,
  SgSkeleton,
  SgStack,
  sgWhistle,
} from "@seedgrid/fe-components";

import { useI18n } from "@/i18n";
import { PageFrame, RouteGuard } from "@/modules/security";
import type {
  BillingInvoiceEnvelope,
  UpcomingInvoiceResponse,
} from "@seedgrid/fe-billing-user";

export default function InvoicesPage() {
  return (
    <RouteGuard permissions={["BILLING_READ"]}>
      <InvoicesScreen />
    </RouteGuard>
  );
}

// O item de invoice é repassado cru do provedor (shape não confirmado — ver a
// lib). Leitura defensiva dos campos mais comuns (estilo Stripe), sem travar
// o tipo.
function pickString(record: Record<string, unknown>, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }
  return null;
}

function pickAmount(record: Record<string, unknown>, ...keys: string[]): number | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return null;
}

function formatCurrency(value: number | string | null | undefined, currency?: string | null) {
  if (value == null) return "-";
  const numeric = typeof value === "number" ? value : Number.parseFloat(value);
  if (!Number.isFinite(numeric)) return "-";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: (currency || "BRL").toUpperCase(),
  }).format(numeric);
}

function formatDate(value: string | number | null | undefined) {
  if (value == null) return "-";
  // Stripe timestamps vêm em segundos (epoch); ISO strings também são aceitas.
  const date = typeof value === "number" ? new Date(value * 1000) : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function InvoicesScreen() {
  const { t } = useI18n();
  const [upcoming, setUpcoming] = useState<UpcomingInvoiceResponse | null>(null);
  const [invoices, setInvoices] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [upcomingRes, invoicesRes] = await Promise.all([
        fetch("/api/billing/upcoming", { cache: "no-store" }),
        fetch("/api/billing/invoices?limit=12", { cache: "no-store" }),
      ]);
      if (upcomingRes.ok) {
        const payload = (await upcomingRes.json()) as { upcoming: UpcomingInvoiceResponse | null };
        setUpcoming(payload.upcoming ?? null);
      }
      if (invoicesRes.ok) {
        const payload = (await invoicesRes.json()) as BillingInvoiceEnvelope;
        setInvoices(payload.invoices ?? []);
      }
    } catch {
      sgWhistle.error({ message: t("billing.user.invoices.load_error") });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <PageFrame
      title={t("billing.user.invoices.title")}
      description={t("billing.user.invoices.description")}
    >
      {loading ? (
        <SgStack gap={16}>
          <SgSkeleton height={120} />
          <SgSkeleton height={200} />
        </SgStack>
      ) : (
        <SgStack gap={16}>
          <SgCard cardStyle="elevated" title={t("billing.user.invoices.upcoming.title")}>
            {upcoming ? (
              <SgStack gap={8}>
                <div className="text-2xl font-semibold text-slate-900">
                  {formatCurrency(upcoming.amountDue ?? upcoming.total, upcoming.currency)}
                </div>
                <span className="text-sm text-slate-600">
                  {t("billing.user.invoices.upcoming.next_attempt", {
                    date: formatDate(upcoming.nextPaymentAttempt),
                  })}
                </span>
                {upcoming.lines?.length ? (
                  <SgStack gap={4} className="mt-2">
                    {upcoming.lines.map((line, index) => (
                      <div
                        key={index}
                        className="flex justify-between border-b border-slate-100 py-1 text-sm last:border-b-0"
                      >
                        <span className="text-slate-600">{line.description ?? "-"}</span>
                        <span className="text-slate-900">
                          {formatCurrency(line.amount, upcoming.currency)}
                        </span>
                      </div>
                    ))}
                  </SgStack>
                ) : null}
              </SgStack>
            ) : (
              <span className="text-sm text-slate-500">
                {t("billing.user.invoices.upcoming.none")}
              </span>
            )}
          </SgCard>

          <SgCard cardStyle="elevated" title={t("billing.user.invoices.history.title")}>
            {invoices.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      <th className="py-2 pr-4">{t("billing.user.invoices.history.column.number")}</th>
                      <th className="py-2 pr-4">{t("billing.user.invoices.history.column.date")}</th>
                      <th className="py-2 pr-4">{t("billing.user.invoices.history.column.amount")}</th>
                      <th className="py-2 pr-4">{t("billing.user.invoices.history.column.status")}</th>
                      <th className="py-2">{" "}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice, index) => {
                      const number = pickString(invoice, "number", "id");
                      const amountRaw = pickAmount(invoice, "amount_paid", "amount_due", "total");
                      const amount = amountRaw != null ? amountRaw / 100 : null;
                      const currency = pickString(invoice, "currency");
                      const status = pickString(invoice, "status");
                      const created = invoice["created"];
                      const url = pickString(invoice, "hosted_invoice_url", "invoice_pdf");

                      return (
                        <tr key={number ?? index} className="border-b border-slate-100 last:border-b-0">
                          <td className="py-2 pr-4 text-slate-900">{number ?? "-"}</td>
                          <td className="py-2 pr-4 text-slate-600">
                            {formatDate(typeof created === "number" || typeof created === "string" ? created : null)}
                          </td>
                          <td className="py-2 pr-4 text-slate-900">{formatCurrency(amount, currency)}</td>
                          <td className="py-2 pr-4 text-slate-600">{status ?? "-"}</td>
                          <td className="py-2">
                            {url ? (
                              <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sky-600 hover:text-sky-800"
                              >
                                {t("billing.user.invoices.history.view")}
                              </a>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <span className="text-sm text-slate-500">
                {t("billing.user.invoices.history.empty")}
              </span>
            )}
          </SgCard>

          <div>
            <SgButton
              appearance="outline"
              severity="secondary"
              shape="rounded"
              label={t("billing.user.invoices.refresh")}
              onClick={() => void load()}
            />
          </div>
        </SgStack>
      )}
    </PageFrame>
  );
}
