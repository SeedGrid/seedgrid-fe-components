// Helpers server-side de cadastro de planos, sobre o motor de sessão do fe-security.
// SERVER-ONLY (action/route).
//
//   const session = createSecurityServer({ ... });
//   export const plans = createBillingPlatformServer(session);

import type { PaginatedResult, SecurityServer } from "@seedgrid/fe-security";

import { BillingPlatformPaths } from "../paths";
import type {
  CreatePlanRequest,
  CreatePlanTermRequest,
  CreatePlanTermResponse,
  PatchPlanTermRequest,
  PatchTrialRequest,
  PlanEntry,
  PlanTermEntry,
  TrialConfig,
} from "../billing-platform";

const post = (body: unknown) => ({
  method: "POST",
  body: JSON.stringify(body),
});
const put = (body: unknown) => ({ method: "PUT", body: JSON.stringify(body) });
const patch = (body: unknown) => ({ method: "PATCH", body: JSON.stringify(body) });

export interface BillingPlatformServer {
  // Planos
  listPlans(): Promise<PaginatedResult<PlanEntry>>;
  createPlan(req: CreatePlanRequest): Promise<PlanEntry>;
  getPlan(id: string): Promise<PlanEntry>;
  updatePlan(id: string, req: CreatePlanRequest): Promise<PlanEntry>;
  deletePlan(id: string): Promise<void>;
  // Terms
  listTerms(id: string): Promise<PaginatedResult<PlanTermEntry>>;
  createTerm(id: string, req: CreatePlanTermRequest): Promise<CreatePlanTermResponse>;
  /** Só termos AGENDADOS (effectiveFrom no futuro) podem ser editados — o backend rejeita os demais. */
  updateTerm(
    id: string,
    termId: string,
    req: PatchPlanTermRequest,
  ): Promise<PlanTermEntry>;
  deleteTerm(id: string, termId: string): Promise<void>;
  archiveTerm(id: string, termId: string): Promise<PlanTermEntry>;
  publishTerm(id: string, termId: string): Promise<PlanTermEntry>;
  // Trial
  getTrial(): Promise<TrialConfig>;
  updateTrial(req: PatchTrialRequest): Promise<TrialConfig>;
}

export function createBillingPlatformServer(
  session: SecurityServer,
): BillingPlatformServer {
  const api = session.apiFetchSecurity.bind(session);
  const P = BillingPlatformPaths;

  return {
    listPlans: () => api<PaginatedResult<PlanEntry>>(P.plans),
    createPlan: (req) => api<PlanEntry>(P.plans, post(req)),
    getPlan: (id) => api<PlanEntry>(P.planById(id)),
    updatePlan: (id, req) => api<PlanEntry>(P.planById(id), put(req)),
    deletePlan: (id) => api<void>(P.planById(id), { method: "DELETE" }),

    listTerms: (id) => api<PaginatedResult<PlanTermEntry>>(P.terms(id)),
    createTerm: (id, req) => api<CreatePlanTermResponse>(P.terms(id), post(req)),
    updateTerm: (id, termId, req) =>
      api<PlanTermEntry>(P.termById(id, termId), patch(req)),
    deleteTerm: (id, termId) =>
      api<void>(P.termById(id, termId), { method: "DELETE" }),
    archiveTerm: (id, termId) =>
      api<PlanTermEntry>(P.archiveTerm(id, termId), { method: "POST" }),
    publishTerm: (id, termId) =>
      api<PlanTermEntry>(P.publishTerm(id, termId), { method: "POST" }),

    getTrial: () => api<TrialConfig>(P.trial),
    updateTrial: (req) => api<TrialConfig>(P.trial, post(req)),
  };
}
