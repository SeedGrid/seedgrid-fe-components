import type { SeedGridCliModuleManifest } from "@seedgrid/fe-core";

// Reference-adjacent implementation of the manifest read by the SeedGrid CLI
// (Rust). See seedgrid-cli/docs/adr/0004-module-manifest-contract.md.
//
// `navigation` uses the scaffold-local hook via `@/modules/billing-user`
// (overview / plans / invoices submenu), gated by BILLING_READ. Same
// mechanism as fe-security's `navigation`.
export const module: SeedGridCliModuleManifest = {
  id: "billing-user",
  requires: ["security"],
  configKey: "billing-user",
  navigation: { import: "useBillingUserAppShellSections", from: "@/modules/billing-user" },
  messages: { import: "billingUserMessages", from: "@seedgrid/fe-billing-user" },
};
