// Barrel do módulo billing-platform no app gerado. Reexporta a config local e
// o contrato/tipos da lib (@seedgrid/fe-billing-platform).

export { billingPlatformConfig } from "./config";
export { useBillingPlatformAppShellSections } from "./useBillingPlatformAppShellSections";

export type {
  PlanEntry,
  PlanCurrentTerm,
  PlanTermEntry,
  PlanTermStatus,
  TrialConfig,
  CreatePlanRequest,
  CreatePlanTermRequest,
  CreatePlanTermResponse,
  PatchPlanTermRequest,
  PatchTrialRequest,
} from "@seedgrid/fe-billing-platform";
