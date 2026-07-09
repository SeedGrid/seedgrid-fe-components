import type { SeedGridCliModuleManifest } from "@seedgrid/fe-core";

// Reference-adjacent implementation of the manifest read by the SeedGrid CLI
// (Rust). See seedgrid-cli/docs/adr/0004-module-manifest-contract.md.
//
// `variantGroup: "tenancy"` — mutually exclusive with `subdomain-tenancy`
// (chosen once at `seedgrid init`).
//
// No source screens existed for this module anywhere (neither CLI templates
// nor admin-web) — the scaffold screens were designed from scratch on top of
// the already-built lib (`CompanyScopePicker`, `createLoginTenancyServer`).
// See scaffold/README.md for what was assumed and needs review.
export const module: SeedGridCliModuleManifest = {
  id: "login-tenancy",
  requires: ["security"],
  variantGroup: "tenancy",
  configKey: "login-tenancy",
  messages: { import: "loginTenancyMessages", from: "@seedgrid/fe-login-tenancy" },
  // Fecha o gap login → select-company: registra um resolver pós-login no
  // navigation.ts do fe-security que, quando o usuário tem >1 empresa, manda
  // pro select-company em vez do dashboard. Sem inverter a dependência
  // (security não conhece login-tenancy; o CLI é que faz o wiring).
  postAuthResolver: {
    import: "resolveLoginTenancyPostAuthPath",
    from: "@/modules/login-tenancy",
  },
};
