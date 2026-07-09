import type { SeedGridCliModuleManifest } from "@seedgrid/fe-core";

// Reference-adjacent implementation of the manifest read by the SeedGrid CLI
// (Rust). See seedgrid-cli/docs/adr/0004-module-manifest-contract.md.
//
// No `scaffold/` yet: the CLI's old template for this module
// (templates/modules/audit/src/modules/audit/index.ts.hbs) was a 6-line
// stub (`export const auditModule = { name, description }`) — no real
// screens were ever built for audit in the CLI, so there is nothing
// meaningful to extract. This package already has real logic (DTOs, paths,
// server engine); the audit list/detail screens themselves are a genuine
// gap (see the "example apps program" note tracked separately), not
// something lost in this extraction.
export const module: SeedGridCliModuleManifest = {
  id: "audit",
  requires: ["security"],
  configKey: "audit",
};
