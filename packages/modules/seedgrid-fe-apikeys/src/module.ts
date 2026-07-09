import type { SeedGridCliModuleManifest } from "@seedgrid/fe-core";

// Reference-adjacent implementation of the manifest read by the SeedGrid CLI
// (Rust). See seedgrid-cli/docs/adr/0004-module-manifest-contract.md.
//
// No provider/navigation/messages here: the api-keys menu entry and
// dashboard shortcut already live inside fe-security's own scaffold
// (`useSecurityAppShellSections.tsx`/`SecurityDashboard.tsx`), gated behind
// a `{{#if security_api_keys_enabled}}` conditional driven by
// `config.is_module_enabled("api-keys")`. This module only ships its own
// standalone screen.
export const module: SeedGridCliModuleManifest = {
  id: "api-keys",
  requires: ["security"],
  configKey: "api-keys",
};
