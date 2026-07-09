import type { SeedGridCliModuleManifest } from "@seedgrid/fe-core";

// Reference implementation of the manifest read by the SeedGrid CLI (Rust).
// See seedgrid-cli/docs/adr/0004-module-manifest-contract.md.
//
// `provider.from` is a scaffold-relative app alias (`@/modules/security`),
// not an npm import: `AuthProvider` runs the full login/session/redirect
// flow and only exists in scaffold (it hardcodes scaffold routes — see
// scaffold/README.md for the lib-vs-scaffold split found while extracting
// this module). The wiring mechanism is plain string substitution into a
// marker, so it doesn't care whether `from` resolves to an npm package or an
// app-local alias — this field just needs to be *some* valid import
// specifier for the generated app.
//
// `@seedgrid/fe-security/client` also exports `PermissionProvider`, a
// lighter permission-only context (ported from admin-web's
// `AdminAccessProvider`) for apps that already have their own login/session
// flow and only want permission checks. That's a different consumption
// pattern from CLI-scaffolded apps, so it is not referenced here.
//
// `navigation` uses the scaffold-local hook via the `@/modules/security` alias
// — same mechanism as `provider` above (plain string substitution into the
// app-shell-navigation markers, so a scaffold alias is fine even though the
// hook hardcodes scaffold routes). Without this the CLI never wires
// `...useSecurityAppShellSections()` into the app shell and the generated app
// ships with an EMPTY navigation menu.
//
// `env` lists only what is verified today (the service-token fallback read
// directly from `admin-web/lib/seedgrid-report-api-server.ts`). The base API
// URL is resolved per-tenant from the hostname, not a static env var, so it
// is not listed here.
export const module: SeedGridCliModuleManifest = {
  id: "security",
  configKey: "security",
  env: ["SEEDGRID_REPORT_API_TOKEN"],
  provider: [{ import: "AuthProvider", from: "@/modules/security" }],
  navigation: { import: "useSecurityAppShellSections", from: "@/modules/security" },
  messages: { import: "securityMessages", from: "@seedgrid/fe-security" },
};
