// Erros do motor de sessão server-side. `ApiClientError` (repasse do problem+json)
// vem do @seedgrid/fe-core e é usado pelo apiFetchSecurity/problemResponse.

/** Erro de request com corpo cru (usado pelo apiFetchServer, retrocompat). */
export class ApiRequestError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, body: string) {
    super(body || `API request failed: ${status}`);
    this.name = "ApiRequestError";
    this.status = status;
    this.body = body;
  }
}

/** Falha de conexão com o report-api (rede indisponível, DNS, etc.). */
export class ApiConnectionError extends Error {
  readonly path: string;

  constructor(path: string, cause?: unknown) {
    super(`Não foi possível conectar à API em ${path}.`);
    this.name = "ApiConnectionError";
    this.path = path;
    this.cause = cause;
  }
}

export function isApiConnectionError(error: unknown): error is ApiConnectionError {
  return error instanceof ApiConnectionError;
}
