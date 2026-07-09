// Helpers server-side de billing do usuário, sobre o motor de sessão do fe-security.
// SERVER-ONLY (action/route).
//
//   const session = createSecurityServer({ ... });
//   export const billing = createBillingUserServer(session);
//
// change-plan/cancel/cancel-scheduled-change/reactivate/invoices/upcoming/change-preview
// foram confirmados lendo `MeBillingResource`/`BillingCheckoutResource` reais
// (`seedgrid-report-api`) e adicionados aqui — ver `scaffold/README.md` pras divergências
// encontradas (paths errados, CheckoutRequest/PortalRequest com shape incorreto).

import type { SecurityServer } from "@seedgrid/fe-security";

import { BillingUserPaths } from "../paths";
import type {
  BillingInvoiceEnvelope,
  CancelScheduledChangeResponse,
  CancelSubscriptionResponse,
  ChangePlanRequest,
  ChangePlanResponse,
  ChangePreviewResponse,
  CheckoutRequest,
  CheckoutSessionResponse,
  PlansCatalogResponse,
  PortalSessionResponse,
  ReactivateSubscriptionResponse,
  SubscriptionResponse,
  UpcomingInvoiceResponse,
  UsageStatementResponse,
  UsageSummaryResponse,
} from "../billing";

export interface BillingUserServer {
  /** Assinatura corrente (null se não houver). */
  getSubscription(): Promise<SubscriptionResponse | null>;
  /** Catálogo de planos assináveis. */
  listPlans(): Promise<PlansCatalogResponse>;
  /** Resumo de uso do ciclo (null se sem assinatura). */
  getUsageSummary(): Promise<UsageSummaryResponse | null>;
  /** Extrato detalhado de uso. Requer permissão STATEMENT_READ (403 sem ela). */
  getUsageStatement(): Promise<UsageStatementResponse | null>;
  /** Cria sessão de checkout (1ª assinatura) — devolve checkoutUrl pra redirecionar. */
  createCheckout(req: CheckoutRequest): Promise<CheckoutSessionResponse>;
  /** Cria sessão do customer portal — devolve portalUrl pra redirecionar. Sem payload. */
  openPortal(): Promise<PortalSessionResponse>;
  /** Troca o plano de uma assinatura já ATIVA (upgrade imediato ou downgrade agendado). */
  changePlan(req: ChangePlanRequest): Promise<ChangePlanResponse>;
  /** Cancela uma troca de plano (downgrade) agendada. Idempotente. */
  cancelScheduledChange(): Promise<CancelScheduledChangeResponse>;
  /** Agenda cancelamento da assinatura ao fim do ciclo vigente. */
  cancelSubscription(): Promise<CancelSubscriptionResponse>;
  /** Reverte um cancelamento agendado (enquanto ainda vigente). */
  reactivateSubscription(): Promise<ReactivateSubscriptionResponse>;
  /** Extrato de faturas do provedor, mais recentes primeiro. */
  listInvoices(limit?: number): Promise<BillingInvoiceEnvelope>;
  /** Prévia da próxima fatura (null se não houver, ex.: cancelada). */
  getUpcomingInvoice(): Promise<{ upcoming: UpcomingInvoiceResponse | null }>;
  /** Prévia do impacto (rateio) de uma troca de plano antes de confirmar. */
  getChangePreview(planId: string): Promise<ChangePreviewResponse>;
}

export function createBillingUserServer(
  session: SecurityServer,
): BillingUserServer {
  return {
    getSubscription: () =>
      session.apiFetchSecurity<SubscriptionResponse | null>(
        BillingUserPaths.subscription,
      ),
    listPlans: () =>
      session.apiFetchSecurity<PlansCatalogResponse>(BillingUserPaths.plans),
    getUsageSummary: () =>
      session.apiFetchSecurity<UsageSummaryResponse | null>(
        BillingUserPaths.usageSummary,
      ),
    getUsageStatement: () =>
      session.apiFetchSecurity<UsageStatementResponse | null>(
        BillingUserPaths.usageStatement,
      ),
    createCheckout: (req) =>
      session.apiFetchSecurity<CheckoutSessionResponse>(
        BillingUserPaths.checkout,
        { method: "POST", body: JSON.stringify(req) },
      ),
    openPortal: () =>
      session.apiFetchSecurity<PortalSessionResponse>(BillingUserPaths.portal, {
        method: "POST",
      }),
    changePlan: (req) =>
      session.apiFetchSecurity<ChangePlanResponse>(BillingUserPaths.changePlan, {
        method: "POST",
        body: JSON.stringify(req),
      }),
    cancelScheduledChange: () =>
      session.apiFetchSecurity<CancelScheduledChangeResponse>(
        BillingUserPaths.cancelScheduledChange,
        { method: "POST" },
      ),
    cancelSubscription: () =>
      session.apiFetchSecurity<CancelSubscriptionResponse>(
        BillingUserPaths.cancel,
        { method: "POST" },
      ),
    reactivateSubscription: () =>
      session.apiFetchSecurity<ReactivateSubscriptionResponse>(
        BillingUserPaths.reactivate,
        { method: "POST" },
      ),
    listInvoices: (limit) =>
      session.apiFetchSecurity<BillingInvoiceEnvelope>(
        `${BillingUserPaths.invoices}${
          typeof limit === "number" ? `?limit=${encodeURIComponent(limit)}` : ""
        }`,
      ),
    getUpcomingInvoice: () =>
      session.apiFetchSecurity<{ upcoming: UpcomingInvoiceResponse | null }>(
        BillingUserPaths.upcoming,
      ),
    getChangePreview: (planId) =>
      session.apiFetchSecurity<ChangePreviewResponse>(
        `${BillingUserPaths.changePreview}?planId=${encodeURIComponent(planId)}`,
      ),
  };
}
