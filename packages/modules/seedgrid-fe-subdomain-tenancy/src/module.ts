import type { SeedGridCliModuleManifest } from "@seedgrid/fe-core";

// Reference-adjacent implementation of the manifest read by the SeedGrid CLI
// (Rust). See seedgrid-cli/docs/adr/0004-module-manifest-contract.md.
//
// `variantGroup: "tenancy"` — mutually exclusive with `login-tenancy`
// (chosen once at `seedgrid init`).
//
// `TenantProvider` has zero app coupling (pure React context, no `@/...`
// imports) so it was promoted to lib — unlike fe-security's `AuthProvider`,
// which hardcodes scaffold routes and had to stay in scaffold.
export const module: SeedGridCliModuleManifest = {
  id: "subdomain-tenancy",
  requires: ["security"],
  variantGroup: "tenancy",
  configKey: "subdomain-tenancy",
  provider: [{ import: "TenantProvider", from: "@seedgrid/fe-subdomain-tenancy/client" }],
};
