// Helpers server-side do signup de tenant (subdomain-tenancy). SERVER-ONLY.
// Endpoints públicos (pré-auth) — o session server manda sem Bearer (ou serviceToken).
//
//   const session = createSecurityServer({ ... });
//   export const tenants = createSubdomainTenancyServer(session);

import type { SecurityServer } from "@seedgrid/fe-security";

import { SubdomainTenancyPaths } from "../paths";
import type {
  TenantSignupRequest,
  TenantSignupResult,
  TenantValidateEmailRequest,
} from "../tenant-signup";

const post = (body?: unknown) => ({
  method: "POST",
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

export interface SubdomainTenancyServer {
  /** Cria o tenant + usuário root (dispara confirmação de e-mail). */
  signupTenant(req: TenantSignupRequest): Promise<TenantSignupResult>;
  /** Confirma o e-mail do signup com o código. */
  validateEmail(req: TenantValidateEmailRequest): Promise<void>;
  /** Reenvia o e-mail de confirmação. */
  resendEmail(subdomain: string): Promise<void>;
}

export function createSubdomainTenancyServer(
  session: SecurityServer,
): SubdomainTenancyServer {
  const P = SubdomainTenancyPaths;
  return {
    signupTenant: (req) =>
      session.apiFetchSecurity<TenantSignupResult>(P.tenants, post(req)),
    validateEmail: (req) =>
      session.apiFetchSecurity<void>(P.validateEmail, post(req)),
    resendEmail: (subdomain) =>
      session.apiFetchSecurity<void>(P.resendEmail(subdomain), post()),
  };
}
