// Paths de cadastro de planos (report-api, /admin/plans). Contrato único front/back.

const seg = (value: string): string => encodeURIComponent(value);

export const BillingPlatformPaths = {
  /** GET lista · POST cria plano. */
  plans: "/admin/plans",
  /** GET lê / POST atualiza a config do trial. */
  trial: "/admin/plans/trial",
  /** GET lê · PUT atualiza · DELETE remove plano. */
  planById: (id: string) => `/admin/plans/${seg(id)}`,
  /** GET lista · POST cria term do plano. */
  terms: (id: string) => `/admin/plans/${seg(id)}/terms`,
  /** PATCH atualiza (só term agendado) · DELETE remove term. */
  termById: (id: string, termId: string) =>
    `/admin/plans/${seg(id)}/terms/${seg(termId)}`,
  /** POST arquiva um term. */
  archiveTerm: (id: string, termId: string) =>
    `/admin/plans/${seg(id)}/terms/${seg(termId)}/archive`,
  /** POST publica um term. */
  publishTerm: (id: string, termId: string) =>
    `/admin/plans/${seg(id)}/terms/${seg(termId)}/publish`,
} as const;
