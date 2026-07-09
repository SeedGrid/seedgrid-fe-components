// DTOs de billing da PLATAFORMA (cadastro de planos — backoffice). Fonte: admin-web.
// Client-safe. Monetário como number|string (backend pode serializar decimal como string).

// ---- Respostas ----

export interface PlanCurrentTerm {
  publicId: string;
  monthlyPrice: number | string;
  monthlyRequests: number;
  maxUsers: number | null;
  overagePrice: number | string;
  providerPriceId: string | null;
  effectiveFrom: string;
}

export type PlanEntry = {
  id: number;
  publicId: string;
  code: string;
  name: string;
  description: string | null;
  active: boolean;
  upgradePromptThresholdPercent: number;
  quotaWarningRemainingPercent: number;
  quotaCriticalRemainingPercent: number;
  createdAt: string;
  currentTerm: PlanCurrentTerm | null;
}

export type PlanTermStatus = "SCHEDULED" | "CURRENT" | "ENDED";

export type PlanTermEntry = {
  id: string;
  publicId: string;
  planId: string;
  monthlyPrice: number | string;
  monthlyRequests: number;
  maxUsers: number | null;
  overagePrice: number | string;
  featuresJson: string | null;
  providerPriceId: string | null;
  effectiveFrom: string;
  effectiveTo: string | null;
  status: PlanTermStatus;
  createdAt: string;
}

/** Trial é limitado só por cota (monthlyRequests); plano TRIAL tem tela própria. */
export interface TrialConfig {
  planPublicId: string;
  termPublicId: string;
  monthlyRequests: number;
}

// ---- Requests ----

/** POST /admin/plans e PUT /admin/plans/{id} (mesmo shape). */
export interface CreatePlanRequest {
  code?: string;
  /** Obrigatório. */
  name: string;
  description?: string;
  active?: boolean;
  upgradePromptThresholdPercent?: number;
  quotaWarningRemainingPercent?: number;
  quotaCriticalRemainingPercent?: number;
}

/**
 * POST /admin/plans/{id}/terms.
 *
 * Corrigido contra `CreatePlanTermRequest.java` (backend real): a edição de um term já
 * agendado é PATCH com `PatchPlanTermRequest` (todos os campos opcionais), NÃO PUT com este
 * mesmo shape — ver `PatchPlanTermRequest` abaixo. Este tipo é só pra criação.
 */
export interface CreatePlanTermRequest {
  /** Obrigatório. */
  monthlyPrice: number;
  monthlyRequests?: number;
  maxUsers?: number;
  /** Obrigatório. */
  overagePrice: number;
  featuresJson?: string;
  providerPriceId?: string;
  /** OffsetDateTime ISO. */
  effectiveFrom?: string;
}

/** Resposta de POST /admin/plans/{id}/terms — o term criado + resultado da publicação automática no Stripe. */
export interface CreatePlanTermResponse extends PlanTermEntry {
  published: boolean;
  publishError: string | null;
}

/**
 * PATCH /admin/plans/{id}/terms/{termId} — edição parcial de um term AGENDADO
 * (`effectiveFrom` no futuro). Só se persiste o que vier não-nulo. Espelha
 * `PatchPlanTermRequest.java`; NÃO confundir com `CreatePlanTermRequest` (criação).
 */
export interface PatchPlanTermRequest {
  monthlyPrice?: number;
  monthlyRequests?: number;
  maxUsers?: number;
  overagePrice?: number;
  featuresJson?: string;
  providerPriceId?: string;
  /** OffsetDateTime ISO. */
  effectiveFrom?: string;
}

/** POST /admin/plans/trial — só a cota é editável. */
export interface PatchTrialRequest {
  monthlyRequests?: number;
}
