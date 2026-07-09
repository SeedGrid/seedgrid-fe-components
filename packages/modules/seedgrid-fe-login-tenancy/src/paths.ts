// Paths específicos do login-tenancy (ext-login-tenancy RestControllerPath). Endpoints
// /public/* (pré-auth). As operações de empresa escopada (me/companies, me/select-company)
// ficam em SecurityPaths.me (fe-security).

export const LoginTenancyPaths = {
  /** POST — signup institucional de empresa. */
  signup: "/public/signup",
  /** GET — verifica se o e-mail já existe. */
  signupEmailExists: (email: string) =>
    `/public/signup/email-exists?email=${encodeURIComponent(email)}`,
  /** POST — confirma o e-mail do signup com o token. */
  signupConfirmEmail: "/public/signup/confirm-email",
  /** POST — reenvia o e-mail de confirmação. */
  signupResendEmail: "/public/signup/resend-email",
  /** GET — status do login-tenancy (habilitado?). */
  status: "/public/accounttenancy/status",
} as const;
