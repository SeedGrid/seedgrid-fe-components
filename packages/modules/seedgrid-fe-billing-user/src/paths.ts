// Paths de billing do usuário (report-api). Contrato único front/back.
//
// Corrigido contra os `@Path` reais (`MeBillingResource`, `BillingCheckoutResource`,
// `SubscriptionResource`, `UsageResource`, `PlansCatalogResource`): `checkout` e `portal`
// tinham prefixo errado (`/billing/...` em vez de `/me/billing/...`) — chamada real teria
// batido em rota inexistente (404). Adicionados os endpoints de troca/cancelamento de
// assinatura (`MeBillingResource`) que existem no backend mas não tinham contrato no client.

export const BillingUserPaths = {
  /** GET — assinatura corrente (pode devolver null). */
  subscription: "/me/subscription",
  /** GET — catálogo de planos assináveis. */
  plans: "/me/plans",
  /** GET — resumo de uso do ciclo. */
  usageSummary: "/me/usage/summary",
  /** GET — extrato detalhado de uso. Requer permissão STATEMENT_READ (403 sem ela). */
  usageStatement: "/me/usage/statement",
  /** POST { planId } — cria sessão de checkout no provedor (1ª assinatura). */
  checkout: "/me/billing/checkout",
  /** POST (sem corpo) — cria sessão do customer portal. */
  portal: "/me/billing/portal",
  /** POST { planId } — troca de plano de assinatura já ATIVA (upgrade/downgrade). */
  changePlan: "/me/billing/change-plan",
  /** POST (sem corpo) — cancela uma troca de plano agendada (downgrade). Idempotente. */
  cancelScheduledChange: "/me/billing/cancel-scheduled-change",
  /** POST (sem corpo) — agenda cancelamento da assinatura ao fim do ciclo vigente. */
  cancel: "/me/billing/cancel",
  /** POST (sem corpo) — reverte um cancelamento agendado. */
  reactivate: "/me/billing/reactivate",
  /** GET ?limit= — extrato de faturas/cobranças do provedor. */
  invoices: "/me/billing/invoices",
  /** GET — prévia da próxima fatura (preço fixo + excedente acumulado). */
  upcoming: "/me/billing/upcoming",
  /** GET ?planId= — prévia do impacto (rateio) de uma troca de plano antes de confirmar. */
  changePreview: "/me/billing/change-preview",
} as const;
