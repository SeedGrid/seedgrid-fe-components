// Paths de subdomain-tenancy (espelho de RestControllerPath.java em
// seedgrid-quarkus-ext-subdomain-tenancy). Endpoints /public/* (pré-auth).

export const SubdomainTenancyPaths = {
  /** POST — cria tenant + usuário root. */
  tenants: "/public/tenants",
  /** POST — valida o e-mail do signup com o código. */
  validateEmail: "/public/tenants/validate-email",
  /** POST — reenvia o e-mail de confirmação (query ?subdomain=). */
  resendEmail: (subdomain: string) =>
    `/public/tenants/resend-email?subdomain=${encodeURIComponent(subdomain)}`,
} as const;
