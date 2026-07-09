// Helpers server-side do login-tenancy, sobre o motor de sessão do fe-security.
// SERVER-ONLY (roda dentro de action/route). O app expõe estes ao client via
// action/route e passa pro <CompanyScopePicker/>.
//
//   import { createSecurityServer } from "@seedgrid/fe-security/server";
//   import { createLoginTenancyServer } from "@seedgrid/fe-login-tenancy/server";
//   const session = createSecurityServer({ ... });
//   export const tenancy = createLoginTenancyServer(session);

import {
  SecurityPaths,
  isLoginSuccess,
  type SecurityLoginResponse,
} from "@seedgrid/fe-security";
import type { SecurityServer } from "@seedgrid/fe-security";

import type { MyCompany } from "../company";
import { LoginTenancyPaths } from "../paths";
import type {
  AccountTenancyStatus,
  ConfirmSignupRequest,
  ConfirmSignupResponse,
  EmailExistsResponse,
  InstitutionalSignupRequest,
  ResendSignupEmailRequest,
  SignupResponse,
} from "../signup";

const post = (body?: unknown) => ({
  method: "POST",
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

export interface SelectCompanyOutcome {
  /** true = token re-escopado e persistido (login concluído nessa empresa). */
  signedIn: boolean;
  /** Resposta crua (AuthResponseDTO) — carrega changePasswordRequired etc. se precisar. */
  response: SecurityLoginResponse;
}

export interface LoginTenancyServer {
  // ---- Empresa escopada (pós-login) ----
  /** Empresas do usuário corrente (GET /me/companies). */
  listMyCompanies(): Promise<MyCompany[]>;
  /**
   * Escopa a sessão na empresa (POST /me/select-company). Como o backend RE-EMITE um
   * par de tokens, em sucesso ESTE helper persiste os novos cookies via
   * session.applySessionCookies — não é passthrough.
   */
  selectCompany(companyPublicId: string): Promise<SelectCompanyOutcome>;

  // ---- Signup institucional de empresa (público, pré-auth) ----
  /** POST /public/signup — cadastra a empresa (dispara confirmação de e-mail). */
  signup(req: InstitutionalSignupRequest): Promise<SignupResponse>;
  /** GET /public/signup/email-exists — checa se o e-mail já está em uso. */
  emailExists(email: string): Promise<EmailExistsResponse>;
  /** POST /public/signup/confirm-email — confirma com o token do e-mail. */
  confirmSignup(req: ConfirmSignupRequest): Promise<ConfirmSignupResponse>;
  /** POST /public/signup/resend-email — reenvia o e-mail de confirmação. */
  resendSignupEmail(req: ResendSignupEmailRequest): Promise<void>;
  /** GET /public/accounttenancy/status — se o login-tenancy está habilitado. */
  getStatus(): Promise<AccountTenancyStatus>;
}

export function createLoginTenancyServer(
  session: SecurityServer,
): LoginTenancyServer {
  return {
    listMyCompanies: () =>
      session.apiFetchSecurity<MyCompany[]>(SecurityPaths.me.companies),

    async selectCompany(companyPublicId: string): Promise<SelectCompanyOutcome> {
      const response = await session.apiFetchSecurity<SecurityLoginResponse>(
        SecurityPaths.me.selectCompany,
        { method: "POST", body: JSON.stringify({ companyPublicId }) },
      );

      if (isLoginSuccess(response)) {
        // Persiste o par de tokens re-escopado (mesmo caminho de login/refresh).
        await session.applySessionCookies(response);
        return { signedIn: true, response };
      }

      return { signedIn: false, response };
    },

    signup: (req) =>
      session.apiFetchSecurity<SignupResponse>(LoginTenancyPaths.signup, post(req)),
    emailExists: (email) =>
      session.apiFetchSecurity<EmailExistsResponse>(
        LoginTenancyPaths.signupEmailExists(email),
      ),
    confirmSignup: (req) =>
      session.apiFetchSecurity<ConfirmSignupResponse>(
        LoginTenancyPaths.signupConfirmEmail,
        post(req),
      ),
    resendSignupEmail: (req) =>
      session.apiFetchSecurity<void>(
        LoginTenancyPaths.signupResendEmail,
        post(req),
      ),
    getStatus: () =>
      session.apiFetchSecurity<AccountTenancyStatus>(LoginTenancyPaths.status),
  };
}
