// Converte um erro server-side (ApiClientError do motor de sessão, ou falha de rede)
// num ProblemDetail serializável. Base compartilhada por route handler e Server Action.

import { ApiClientError } from "@seedgrid/fe-core";
import type { ProblemDetail } from "../session-result";

export function toProblem(error: unknown): ProblemDetail {
  if (error instanceof ApiClientError) {
    const body = error.responseBody;

    // problem+json do report-api: repassa o corpo inteiro (detail/violations/title),
    // preservando o status do body quando presente.
    if (body && typeof body === "object") {
      return { status: error.status, ...(body as Record<string, unknown>) };
    }
    if (typeof body === "string") {
      return { status: error.status, detail: body };
    }
    return { status: error.status, title: error.message };
  }

  return {
    status: 502,
    title: "Bad Gateway",
    detail: error instanceof Error ? error.message : "Erro de conexão.",
  };
}
