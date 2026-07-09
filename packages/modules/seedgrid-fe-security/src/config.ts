// Config injetável do motor de sessão server-side. Tudo que era hardcode do admin-web
// (nomes de cookie, base URL, service-token, X-Company-Id) entra por aqui. A lib NÃO
// lê process.env: o APP lê o env que quiser e passa os valores no config.

/** Nomes dos cookies httpOnly que guardam a sessão. */
export interface SecuritySessionCookieNames {
  /** Access token. Ex.: "sg_admin_token". */
  token: string;
  /** Refresh token. Ex.: "sg_admin_refresh_token". */
  refresh: string;
  /** Flag de troca de senha obrigatória. Ex.: "sg_admin_password_change_required". */
  passwordChangeRequired: string;
}

export interface SecurityServerConfig {
  /** Base URL do report-api (ex.: "http://localhost:8080"). O app lê do env e passa aqui. */
  apiBaseUrl: string;

  /** Nomes dos cookies de sessão. */
  cookies: SecuritySessionCookieNames;

  /**
   * Flag `secure` dos cookies. Default: `process.env.NODE_ENV === "production"`.
   * Passe explicitamente para não depender do NODE_ENV.
   */
  secureCookies?: boolean;

  /**
   * Service token (server-to-server) usado como Authorization APENAS quando não há
   * sessão de usuário no cookie. Corresponde ao antigo SEEDGRID_REPORT_API_TOKEN.
   */
  serviceToken?: string;

  /**
   * PONTO DE PLUG DA TENANCY. Headers extras resolvidos por request e mesclados em
   * toda chamada ao report-api:
   * - account-tenancy injeta `X-Company-Id` (empresa escopada);
   * - multi-tenancy injeta o header de tenant resolvido por host/subdomínio;
   * - security-core (sem tenancy) omite.
   */
  resolveTenancyHeaders?: () => Promise<HeadersInit> | HeadersInit;
}
