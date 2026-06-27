// seedgrid:managed

// Extração da MENSAGEM amigável dos erros de API (RFC7807 application/problem+json).
//
// Lado de EXIBIÇÃO do httpclient: o `createApiClient` lança um `ApiClientError`
// (com `responseBody`) e já roteia a captura por `runGuarded`/`captureException`; na
// UI você chama `extractApiErrorMessage(error)` pra mostrar a mensagem certa.
//
// `extractApiErrorMessage` faz busca em largura na cadeia do erro
// (responseBody/cause/error/data/body), então acha o problem+json mesmo quando ele
// está aninhado, reembrulhado ou cruzou a fronteira de um bundle (deixou de
// satisfazer `instanceof`). Nunca devolve JSON cru nem `[object Object]`.
//
// Prioridade da mensagem: violations[].message -> errors[].message -> userMessage ->
// detail -> message -> error -> title (RFC7807 primeiro; campos genéricos no fim).

type ProblemViolation = {
  message?: unknown;
  userMessage?: unknown;
  error?: unknown;
  description?: unknown;
};

type ProblemDetails = {
  detail?: unknown;
  message?: unknown;
  error?: unknown;
  title?: unknown;
  userMessage?: unknown;
  violations?: unknown;
  errors?: unknown;
};

type ApiClientErrorLike = {
  cause?: unknown;
  body?: unknown;
  data?: unknown;
  error?: unknown;
  message?: unknown;
  detail?: unknown;
  status?: unknown;
  responseBody?: unknown;
};

/**
 * Type guard mantido por compatibilidade: qualquer objeto pode carregar um
 * `responseBody`/`detail` de onde extrair a mensagem.
 */
export function isApiClientErrorLike(
  error: unknown
): error is ApiClientErrorLike {
  return Boolean(error && typeof error === "object");
}

/**
 * Melhor mensagem amigável a partir de QUALQUER valor lançado por uma chamada de
 * API. Varre a cadeia do erro, então acha o problem+json mesmo aninhado/embrulhado.
 * Cai no `.message` do próprio erro só quando não há payload de problema.
 */
export function extractApiErrorMessage(error: unknown): string | null {
  const fromProblem = readProblemMessage(findProblemDetails(error));
  if (fromProblem) {
    return fromProblem;
  }
  // Sem mensagem no corpo: muitos erros (401/403/404/5xx) vêm SEM corpo. Em vez de
  // vazar o `.message` genérico do ApiClientError ("API request failed with status N"),
  // devolve uma mensagem amigável do HTTP status (ex.: 403 -> "Acesso negado").
  const status = httpStatusOf(error);
  if (status != null) {
    return messageForHttpStatus(status);
  }
  // Erro sem status (rede / hand-thrown): cai no próprio `.message`.
  return pickString(readErrorMessage(error));
}

/**
 * Mensagem amigável (pt-BR) para um HTTP status, usada quando o corpo do erro não
 * traz mensagem própria. Exposta para fluxos `fetch` crus (que têm o
 * `response.status` mas não um `ApiClientError`).
 */
export function messageForHttpStatus(status: number): string {
  switch (status) {
    case 400:
      return "Requisição inválida.";
    case 401:
      return "Sessão expirada. Faça login novamente.";
    case 403:
      return "Acesso negado.";
    case 404:
      return "Recurso não encontrado.";
    case 408:
    case 504:
      return "Tempo de resposta esgotado. Tente novamente.";
    case 409:
      return "Conflito com o estado atual do recurso.";
    case 422:
      return "Não foi possível processar os dados enviados.";
    case 429:
      return "Muitas requisições. Aguarde um momento e tente novamente.";
    case 503:
      return "Serviço temporariamente indisponível. Tente novamente.";
    default:
      if (status >= 500) {
        return "Erro no servidor. Tente novamente.";
      }
      return "Não foi possível concluir a operação.";
  }
}

function httpStatusOf(error: unknown): number | null {
  if (isRecord(error) && typeof error.status === "number") {
    return error.status;
  }
  return null;
}

/**
 * Mensagem a partir de UM corpo já em mãos (objeto problem+json, ou string JSON que
 * parseie em um). Texto simples não-JSON -> o próprio texto; objeto sem mensagem
 * útil -> null (nunca o JSON cru).
 */
export function readApiErrorMessage(body: unknown): string | null {
  const normalized = normalizeApiBody(body);
  if (!isRecord(normalized)) {
    return pickString(normalized);
  }
  return readProblemMessage(normalized as ProblemDetails);
}

function readProblemMessage(problem: ProblemDetails | null): string | null {
  if (!problem) {
    return null;
  }
  return (
    readViolationMessage(problem.violations) ??
    readViolationMessage(problem.errors) ??
    pickString(problem.userMessage) ??
    pickString(problem.detail) ??
    pickString(problem.message) ??
    pickString(problem.error) ??
    pickString(problem.title)
  );
}

function findProblemDetails(error: unknown): ProblemDetails | null {
  const queue: unknown[] = [error];
  const visited = new Set<unknown>();

  while (queue.length > 0) {
    const current = queue.shift();

    if (current == null) {
      continue;
    }

    // Uma string pode ser ela mesma o payload problem+json (corpo não desserializado).
    if (typeof current === "string") {
      const parsed = parseProblemDetails(current);
      if (parsed && hasProblemSignals(parsed)) {
        return parsed;
      }
      continue;
    }

    if (typeof current !== "object" || visited.has(current)) {
      continue;
    }
    visited.add(current);

    // Pula o `.message` genérico de Error pra alcançar o responseBody real — senão a
    // mensagem genérica ("Request failed with 400") mascararia o detail do RFC7807.
    if (current instanceof Error) {
      const candidate = current as ApiClientErrorLike;
      queue.push(candidate.responseBody, candidate.cause, candidate.data, candidate.body);
      continue;
    }

    if (hasProblemSignals(current as ProblemDetails)) {
      return current as ProblemDetails;
    }

    const candidate = current as ApiClientErrorLike;
    queue.push(
      candidate.responseBody,
      candidate.cause,
      candidate.error,
      candidate.data,
      candidate.body
    );
  }

  return null;
}

function hasProblemSignals(problem: ProblemDetails): boolean {
  return readProblemMessage(problem) != null;
}

function parseProblemDetails(value: unknown): ProblemDetails | null {
  if (isRecord(value)) {
    return value as ProblemDetails;
  }
  if (typeof value !== "string") {
    return null;
  }
  try {
    const parsed = JSON.parse(value) as unknown;
    return isRecord(parsed) ? (parsed as ProblemDetails) : null;
  } catch {
    return null;
  }
}

function normalizeApiBody(body: unknown): unknown {
  if (typeof body !== "string") {
    return body;
  }
  const trimmed = body.trim();
  if (!trimmed) {
    return body;
  }
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return body;
  }
}

function readViolationMessage(value: unknown): string | null {
  if (!Array.isArray(value)) {
    return null;
  }
  for (const violation of value) {
    if (!isRecord(violation)) {
      continue;
    }
    const entry = violation as ProblemViolation;
    const message =
      pickString(entry.message) ??
      pickString(entry.userMessage) ??
      pickString(entry.error) ??
      pickString(entry.description);
    if (message) {
      return message;
    }
  }
  return null;
}

function readErrorMessage(error: unknown): unknown {
  if (!isRecord(error) || !("message" in error)) {
    return null;
  }
  return (error as ApiClientErrorLike).message ?? null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function pickString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}
