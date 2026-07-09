// DTOs de billing do USUÁRIO (gerenciar a própria assinatura). Espelham o report-client
// (fonte de verdade — os GETs são untyped no OpenAPI). Client-safe.
// Valores monetários vêm como number|string (o backend pode serializar decimal como string).

export interface SubscriptionCycle {
  id: string;
  periodStart: string;
  periodEnd: string;
  includedRequests: number;
  usedRequests: number;
  remainingRequests: number;
  overageRequests: number;
}

export interface SubscriptionPlanRef {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  isTrial?: boolean;
  upgradePromptThresholdPercent?: number;
  quotaWarningRemainingPercent?: number;
  quotaCriticalRemainingPercent?: number;
}

export interface SubscriptionPlanTerm {
  id: string;
  monthlyPrice: number | string;
  monthlyRequests: number;
  maxUsers?: number | null;
  overagePrice: number | string;
  effectiveFrom?: string;
  effectiveTo?: string | null;
  featuresJson?: string | null;
}

export interface SubscriptionPendingChange {
  planId: string | null;
  planCode: string | null;
  planName: string | null;
  monthlyPrice: number | string | null;
  monthlyRequests: number | null;
  effectiveAt: string | null;
}

/** GET /me/subscription. Pode ser null se não houver assinatura. */
export interface SubscriptionResponse {
  tenantId: string;
  subscriptionId: string;
  status: string;
  startsAt: string;
  endsAt: string | null;
  billingDay: number | null;
  plan: SubscriptionPlanRef | null;
  planTerm: SubscriptionPlanTerm | null;
  billingCycle: SubscriptionCycle;
  /** Downgrade agendado que entra em vigor no próximo ciclo. */
  pendingChange: SubscriptionPendingChange | null;
  /** Cancelamento agendado: acesso até cancelEffectiveAt; pode reativar até lá. */
  cancelAtPeriodEnd: boolean;
  cancelEffectiveAt: string | null;
}

export interface UsageAlert {
  id: string;
  tenantId: string;
  billingCycleId: string;
  thresholdPercent: number;
  triggeredAt: string;
  channel: string;
  recipient: string | null;
  payloadJson: string | null;
  message: string;
}

/** GET /me/usage/summary. */
export interface UsageSummaryResponse {
  tenantId: string;
  subscriptionId: string;
  plan: Pick<
    SubscriptionPlanRef,
    | "id"
    | "code"
    | "name"
    | "isTrial"
    | "upgradePromptThresholdPercent"
    | "quotaWarningRemainingPercent"
    | "quotaCriticalRemainingPercent"
  > | null;
  planTerm: {
    id: string;
    monthlyPrice: number | string;
    monthlyRequests: number;
    overagePrice: number | string;
  } | null;
  cycle: SubscriptionCycle;
  alerts?: UsageAlert[];
}

export interface UsageStatementEntry {
  id: string;
  tenantId: string;
  billingCycleId: string;
  aiRequestId: string | null;
  occurredAt: string;
  operationType: string;
  description: string | null;
  /** Frase que o usuário digitou e gerou o consumo. */
  userPrompt?: string | null;
  requestStatus?: string | null;
  balanceBefore: number;
  consumedRequests: number;
  balanceAfter: number;
  isOverage: boolean;
  overageUnitPrice: number | string | null;
  planTermId: string | null;
  chatId: string | null;
  reportId: string | null;
  metadataJson: string | null;
}

/** GET /me/usage/statement. */
export interface UsageStatementResponse {
  tenantId: string;
  entries: UsageStatementEntry[];
}

/** Item do catálogo de planos assináveis (GET /me/plans). */
export interface PlanCatalogItem {
  planId: string;
  planTermId: string;
  code: string;
  name: string;
  description: string | null;
  monthlyPrice: number | string;
  monthlyRequests: number;
  maxUsers: number | null;
  overagePrice: number | string;
  featuresJson: string | null;
  /** Só assina se houver priceId configurado no provedor. */
  checkoutEnabled: boolean;
  /** Plano da assinatura ativa atual. */
  current: boolean;
  /** Já há downgrade agendado pra este plano. */
  pendingDowngrade?: boolean;
}

export interface PlansPendingChange {
  planId: string;
  planName: string;
  effectiveAt: string | null;
}

export interface PlansCatalogResponse {
  items: PlanCatalogItem[];
  pendingChange?: PlansPendingChange | null;
}

/**
 * POST /me/billing/checkout (request).
 *
 * Corrigido contra `BillingCheckoutResource.CreateCheckoutRequest` (backend real):
 * o único campo aceito é `planId` (`@NotBlank`, é o `publicId` do `PlanEntity`, não um
 * "planCode"). `customerEmail`/`successUrl`/`cancelUrl` NÃO são enviados pelo client —
 * o backend resolve o e-mail do usuário autenticado e as URLs de config
 * (`seedgrid.report.billing.checkout.{success,cancel}-url`). O shape anterior
 * (`planCode?`, `customerEmail?`, `successUrl?`, `cancelUrl?`, tudo opcional) não batia
 * com nenhum campo real do request.
 */
export interface CheckoutRequest {
  planId: string;
}

/** POST /me/billing/checkout (response). */
export interface CheckoutSessionResponse {
  provider: string | null;
  checkoutUrl: string;
  checkoutSessionId: string | null;
}

/**
 * POST /me/billing/portal (response).
 *
 * Sem tipo de request: `MeBillingResource.portal()` não declara `@Consumes` nem parâmetro
 * de corpo — o endpoint não aceita nenhum payload do client (customerId/returnUrl são
 * resolvidos no servidor a partir da assinatura ativa e de
 * `seedgrid.report.billing.portal.return-url`). O `PortalRequest` antigo
 * (`customerReference?`, `returnUrl?`, `metadata?`) não correspondia a nada aceito pelo
 * backend e foi removido — ver `scaffold/README.md`.
 */
export interface PortalSessionResponse {
  provider: string | null;
  portalUrl: string;
}

/**
 * POST /me/billing/change-plan (request). Troca a assinatura EXISTENTE (upgrade ou
 * downgrade) — não confundir com {@link CheckoutRequest} (1ª assinatura via checkout).
 * `planId` é o `publicId` do `PlanEntity` (mesma convenção de {@link CheckoutRequest}).
 */
export interface ChangePlanRequest {
  planId: string;
}

/**
 * POST /me/billing/change-plan (response). Upgrade aplica na hora (rateio cobrado já);
 * downgrade é agendado pro fim do ciclo atual — `effectiveAt` só vem preenchido nesse caso.
 */
export interface ChangePlanResponse {
  planCode: string;
  status: "PLAN_CHANGED" | "DOWNGRADE_SCHEDULED";
  effectiveAt?: string | null;
}

/** POST /me/billing/cancel-scheduled-change (response). Idempotente. */
export interface CancelScheduledChangeResponse {
  status: "NO_PENDING_CHANGE" | "SCHEDULED_CHANGE_CANCELED";
}

/** POST /me/billing/cancel (response). Mantém acesso até o fim do ciclo vigente. */
export interface CancelSubscriptionResponse {
  status: "CANCELLATION_SCHEDULED";
}

/** POST /me/billing/reactivate (response). Só vale enquanto ainda vigente. */
export interface ReactivateSubscriptionResponse {
  status: "REACTIVATED";
}

/**
 * GET /me/billing/change-preview (response). Prévia do impacto de uma troca de plano
 * ANTES de confirmar via {@link ChangePlanRequest}. Downgrade nunca cobra na hora
 * (`immediate: false`, `amountDue: 0`).
 */
export interface ChangePreviewResponse {
  downgrade: boolean;
  immediate: boolean;
  amountDue: number | null;
  currency: string | null;
}

/** Item de linha da prévia de fatura (GET /me/billing/upcoming). */
export interface UpcomingInvoiceLine {
  description: string | null;
  amount: number | null;
  quantity: number | null;
}

/** GET /me/billing/upcoming (response, campo `upcoming`). Vem `null` se não houver próxima fatura. */
export interface UpcomingInvoiceResponse {
  amountDue: number | null;
  total: number | null;
  currency: string | null;
  nextPaymentAttempt: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  lines: UpcomingInvoiceLine[];
}

/**
 * GET /me/billing/invoices?limit=. (response). O item de `invoices` é repassado cru do
 * provedor pela lib `seedgrid-billing` (`BillingService.listInvoices`, agnóstica de
 * Stripe/etc.) — o shape exato não foi confirmado no OpenAPI nem no fonte disponível
 * (a lib não estava no escopo inspecionado), então fica como registro aberto até
 * alguém confirmar o DTO real e apertar o tipo.
 */
export interface BillingInvoiceEnvelope {
  invoices: Record<string, unknown>[];
}
