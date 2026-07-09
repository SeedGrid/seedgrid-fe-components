// Resultado de Server Action — client-safe. A action NÃO lança (o Next redige a
// mensagem de erro em produção): ela RETORNA este result, que serializa com segurança
// e carrega o problem+json do backend intacto até a UI.

/** Problem Details (RFC 7807) serializável — o corpo de erro do report-api. */
export interface ProblemDetail {
  status: number;
  title?: string;
  detail?: string;
  /** Violações de validação (se o backend enviar). */
  violations?: Array<{ field?: string; message?: string }>;
  [key: string]: unknown;
}

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; problem: ProblemDetail };

/** Lê a mensagem exibível de um ProblemDetail (detail → 1ª violação → title → status). */
export function readProblemMessage(problem: ProblemDetail): string {
  if (problem.detail) {
    return problem.detail;
  }
  const firstViolation = problem.violations?.find((v) => v.message)?.message;
  if (firstViolation) {
    return firstViolation;
  }
  return problem.title ?? `Erro ${problem.status}`;
}
