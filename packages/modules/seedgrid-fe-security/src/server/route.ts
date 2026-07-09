// Helper de route handler (leituras GET — cacheáveis). Roda o motor de sessão e
// devolve um NextResponse: sucesso → json; erro → application/problem+json (repassa o
// problem+json do report-api íntegro, pro extractApiErrorMessage do client ler).
//
// Uso no route handler:
//   export async function GET() {
//     return toRouteResponse(() => security.apiFetchSecurity(SecurityPaths.users.base));
//   }

import { NextResponse } from "next/server";

import { problemResponse } from "./problem-response";

export async function toRouteResponse<T>(
  run: () => Promise<T>,
): Promise<NextResponse> {
  try {
    const data = await run();
    if (data === null || data === undefined) {
      return new NextResponse(null, { status: 204 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return problemResponse(error);
  }
}
