// seedgrid:managed

export {
  buildCreatePublicTenantPayload,
  createEmptyPublicTenantSignupForm,
  type CreatePublicTenantActionResult,
  type CreatePublicTenantPayload,
  type PublicTenantSignupFormValues,
} from "./signup/types";

// Promovidos pra lib versionada (@seedgrid/fe-subdomain-tenancy) — ver ADR
// 0004/0005 e o scaffold README do fe-security pro criterio lib vs scaffold
// usado nesta extracao (mesma regra: import `@/...` real = scaffold).
export {
  RESERVED_SUBDOMAINS,
  isReservedSubdomain,
  normalizeSubdomain,
  validateSubdomain,
} from "@seedgrid/fe-subdomain-tenancy";
export { TenantProvider, useTenantContext } from "@seedgrid/fe-subdomain-tenancy/client";
