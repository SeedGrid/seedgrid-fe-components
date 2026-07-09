// Contrato PURO do motor de sessão (client-safe — só tipos, sem next/*). Fica na raiz
// pra outros pacotes (ex.: fe-login-tenancy) importarem o tipo SecurityServer sem
// puxar a implementação server (next/headers). A implementação vive em ./server.

import type { SecurityLoginResponse } from "./session-contract";

export type SecurityFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
};

export interface SecurityServer {
  /** Fetch cru contra o report-api com sessão (cookie→Bearer) e refresh em 401. */
  fetchWithSession(
    path: string,
    options?: SecurityFetchOptions,
  ): Promise<Response>;
  /** Canônico do fluxo de segurança: em erro lança ApiClientError (p/ problemResponse). */
  apiFetchSecurity<T>(path: string, options?: SecurityFetchOptions): Promise<T>;
  /** Variante retrocompat: em erro lança ApiRequestError (corpo cru). */
  apiFetchServer<T>(path: string, options?: SecurityFetchOptions): Promise<T>;
  /** Monta os headers (Authorization da sessão/service + tenancy) para uma request. */
  buildHeaders(headers?: HeadersInit): Promise<HeadersInit>;
  /** Grava os cookies de sessão a partir de um login/select-company OK. */
  applySessionCookies(
    data: Extract<SecurityLoginResponse, { status: "OK" }>,
  ): Promise<void>;
  /** Apaga os cookies de sessão. */
  clearAuthCookies(): Promise<void>;
  /** 401 = sessão inválida (desloga). 403 = autenticado sem permissão (NÃO desloga). */
  isInvalidSessionResponse(status: number, body: string): boolean;
}
