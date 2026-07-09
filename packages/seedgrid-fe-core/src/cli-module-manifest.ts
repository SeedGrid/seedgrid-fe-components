/**
 * Contract read by the SeedGrid CLI (Rust) to wire an `@seedgrid/fe-*` package
 * into a generated app. See seedgrid-cli/docs/adr/0004-module-manifest-contract.md.
 *
 * Each package exports one `SeedGridCliModuleManifest` from `src/module.ts`.
 * A postbuild step serializes it to `dist/module.json`, which is the only
 * artifact the CLI actually reads (no JS runtime involved on the CLI side).
 *
 * Not to be confused with `SeedGridModuleManifest` in `./module` (an unrelated,
 * currently unused runtime registry draft).
 */

export interface SeedGridCliModuleImportRef {
  import: string;
  from: string;
}

export interface SeedGridCliModuleManifest {
  id: string;
  requires?: string[];
  variantGroup?: string;
  configKey: string;
  env?: string[];
  provider?: SeedGridCliModuleImportRef[];
  navigation?: SeedGridCliModuleImportRef;
  messages?: SeedGridCliModuleImportRef;
  /**
   * Resolver de rota pós-login, registrado no `navigation.ts` do fe-security.
   * `import` deve ser uma função `(permissions: Iterable<string>) => Promise<string | null> | string | null`
   * que devolve a rota pra onde mandar o usuário logo após o login (ou null pra
   * deixar o próximo resolver / o dashboard decidir). Ex.: `login-tenancy` manda
   * pro select-company quando o usuário tem mais de uma empresa.
   */
  postAuthResolver?: SeedGridCliModuleImportRef;
}
