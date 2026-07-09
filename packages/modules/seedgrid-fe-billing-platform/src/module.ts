import type { SeedGridCliModuleManifest } from "@seedgrid/fe-core";

// Reference-adjacent implementation of the manifest read by the SeedGrid CLI
// (Rust). See seedgrid-cli/docs/adr/0004-module-manifest-contract.md.
//
// Scaffold built from scratch (NOT adapted from admin-web's rxjs/Shell stack)
// following the SeedGrid CLI convention (PageFrame/RouteGuard/useI18n): the 4
// backoffice screens — plan list, plan editor, plan terms, trial — plus the
// server bootstrap, API routes and nav section. Gated by the `PLAN` CRUD
// resource permission (PLAN_READ/CREATE/UPDATE/DELETE), same convention as
// fe-security's USER/ROLE/COMPANY. See scaffold/README.md for what was
// assumed/built from scratch.
//
// `navigation` uses the scaffold-local hook via `@/modules/billing-platform`
// (plain string substitution into the app-shell markers). `messages` ships the
// i18n bundle from the lib. The DTOs/paths/server engine were verified against
// the real backend (AdminPlanResource.java).
export const module: SeedGridCliModuleManifest = {
  id: "billing-platform",
  requires: ["security"],
  configKey: "billing-platform",
  navigation: {
    import: "useBillingPlatformAppShellSections",
    from: "@/modules/billing-platform",
  },
  messages: { import: "billingPlatformMessages", from: "@seedgrid/fe-billing-platform" },
};
