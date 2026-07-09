import type { SeedGridCliModuleManifest } from "@seedgrid/fe-core";

// Reference-adjacent implementation of the manifest read by the SeedGrid CLI
// (Rust). See seedgrid-cli/docs/adr/0004-module-manifest-contract.md.
//
// `messages` is filled in because `backupMessages` was a pure object (zero
// `@/...` import) in the old CLI template and got promoted to lib as-is —
// see scaffold/README.md.
//
// `navigation` uses the scaffold-local hook via `@/modules/backup` — the
// wiring is plain string substitution into the app-shell-navigation markers,
// so a scaffold alias is fine even though `useBackupAppShellSections`
// hardcodes a scaffold route and calls `@/modules/security`/`@/i18n`. Same
// mechanism as fe-security's `navigation`. Without it the CLI never wires the
// backup menu into the app shell.
//
// No `provider` here: unlike fe-subdomain-tenancy's `TenantProvider`, this
// module has no standalone React context to wrap the app with.
export const module: SeedGridCliModuleManifest = {
  id: "backup",
  requires: ["security"],
  configKey: "backup",
  navigation: { import: "useBackupAppShellSections", from: "@/modules/backup" },
  messages: { import: "backupMessages", from: "@seedgrid/fe-backup" },
};
