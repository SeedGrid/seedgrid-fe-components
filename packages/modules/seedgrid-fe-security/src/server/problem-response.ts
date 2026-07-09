// Converte o erro lançado por uma chamada server-side (ApiClientError) na resposta que
// o route handler do Next devolve ao client. Repassa o `responseBody` (problem+json
// original do report-api) com o `status` upstream, como application/problem+json —
// assim o `extractApiErrorMessage` do lado client recupera a mensagem íntegra.

import { NextResponse } from "next/server";
import { ApiClientError } from "@seedgrid/fe-core";

export function problemResponse(error: unknown): NextResponse {
  if (error instanceof ApiClientError) {
    const { responseBody, status } = error;

    if (typeof responseBody === "string") {
      return new NextResponse(responseBody, {
        status,
        headers: { "Content-Type": "application/problem+json" },
      });
    }

    if (responseBody != null) {
      return NextResponse.json(responseBody, {
        status,
        headers: { "Content-Type": "application/problem+json" },
      });
    }

    return NextResponse.json(
      { status, title: error.message },
      { status, headers: { "Content-Type": "application/problem+json" } },
    );
  }

  const detail =
    error instanceof Error
      ? error.message
      : "Não foi possível conectar à API.";

  return NextResponse.json(
    { status: 502, title: "Bad Gateway", detail },
    { status: 502, headers: { "Content-Type": "application/problem+json" } },
  );
}
