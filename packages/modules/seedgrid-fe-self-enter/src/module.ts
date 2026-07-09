import type { SeedGridCliModuleManifest } from "@seedgrid/fe-core";

// Reference-adjacent implementation of the manifest read by the SeedGrid CLI
// (Rust). See seedgrid-cli/docs/adr/0004-module-manifest-contract.md.
//
// No provider/navigation/messages here: the self-enter menu entries and
// dashboard shortcut already live inside fe-security's own scaffold
// (`useSecurityAppShellSections.tsx`/`SecurityDashboard.tsx`), gated behind
// a `{{#if security_self_enter_enabled}}` conditional driven by
// `config.is_module_enabled("self-enter")`. This module only ships its own
// 3 standalone screens (public request, invitations, approvals).
export const module: SeedGridCliModuleManifest = {
  id: "self-enter",
  requires: ["security"],
  configKey: "self-enter",
};
