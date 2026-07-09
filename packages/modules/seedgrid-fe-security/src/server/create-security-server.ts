// Motor de sessão server-side do SeedGrid Security (portado do admin-web
// lib/seedgrid-report-api-server.ts, com os hardcodes parametrizados via
// SecurityServerConfig). SERVER-ONLY: usa next/headers.
//
// O app cria uma instância uma vez e importa os helpers ligados nos route handlers:
//   export const security = createSecurityServer({ apiBaseUrl, cookies, ... });

import { cookies } from "next/headers";
import { ApiClientError } from "@seedgrid/fe-core";

import { SecurityPaths } from "../paths";
import type { SecurityServerConfig } from "../config";
import {
  isLoginSuccess,
  type SecurityLoginResponse,
} from "../session-contract";
import { ApiConnectionError, ApiRequestError } from "./errors";
import type {
  SecurityFetchOptions as FetchOptions,
  SecurityServer,
} from "../server-contract";

export function createSecurityServer(
  config: SecurityServerConfig,
): SecurityServer {
  const secure = config.secureCookies ?? process.env.NODE_ENV === "production";

  async function buildHeaders(headers?: HeadersInit): Promise<HeadersInit> {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(config.cookies.token)?.value;
    const tenancy = config.resolveTenancyHeaders
      ? await config.resolveTenancyHeaders()
      : undefined;

    return {
      ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
      ...(!sessionToken && config.serviceToken
        ? { Authorization: `Bearer ${config.serviceToken}` }
        : {}),
      ...tenancy,
      ...headers,
    };
  }

  async function safeFetch(
    path: string,
    options: FetchOptions = {},
  ): Promise<Response> {
    try {
      return await fetch(`${config.apiBaseUrl}${path}`, {
        ...options,
        headers: await buildHeaders({
          "Content-Type": "application/json",
          ...options.headers,
        }),
        cache: "no-store",
      });
    } catch (error) {
      throw new ApiConnectionError(path, error);
    }
  }

  async function applySessionCookies(
    data: Extract<SecurityLoginResponse, { status: "OK" }>,
  ): Promise<void> {
    const cookieStore = await cookies();
    const opts = { httpOnly: true, path: "/", sameSite: "lax" as const, secure };

    cookieStore.set(config.cookies.token, data.token, opts);

    if (typeof data.refreshToken === "string") {
      cookieStore.set(config.cookies.refresh, data.refreshToken, opts);
    }

    if (data.changePasswordRequired) {
      cookieStore.set(config.cookies.passwordChangeRequired, "1", opts);
    } else {
      cookieStore.delete(config.cookies.passwordChangeRequired);
    }
  }

  async function clearAuthCookies(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(config.cookies.token);
    cookieStore.delete(config.cookies.refresh);
    cookieStore.delete(config.cookies.passwordChangeRequired);
  }

  async function tryRefreshSession(): Promise<boolean> {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(config.cookies.refresh)?.value;

    if (!refreshToken) {
      await clearAuthCookies();
      return false;
    }

    let response: Response;
    try {
      response = await fetch(`${config.apiBaseUrl}${SecurityPaths.auth.refresh}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      });
    } catch (error) {
      await clearAuthCookies();
      throw new ApiConnectionError(SecurityPaths.auth.refresh, error);
    }

    if (!response.ok) {
      await clearAuthCookies();
      return false;
    }

    const payload = (await response.json()) as SecurityLoginResponse;
    if (!isLoginSuccess(payload)) {
      await clearAuthCookies();
      return false;
    }

    await applySessionCookies(payload);
    return true;
  }

  async function fetchWithSession(
    path: string,
    options: FetchOptions = {},
  ): Promise<Response> {
    let response = await safeFetch(path, options);
    if (response.status !== 401) {
      return response;
    }

    const refreshed = await tryRefreshSession();
    if (!refreshed) {
      return response;
    }

    response = await safeFetch(path, options);
    return response;
  }

  function isInvalidSessionResponse(status: number, body: string): boolean {
    // Apenas 401 = sessão inválida/expirada (limpa cookies → login). 403 NÃO: é
    // autenticado SEM permissão (sessão válida) — a tela só mostra "Acesso negado",
    // nunca desloga. Tratar 403 como inválido fazia clicar num item proibido jogar o
    // usuário pro /login.
    if (status === 401) {
      return true;
    }

    const normalized = body.toLocaleLowerCase("pt-BR");
    return (
      normalized.includes("usuario nao encontrado") ||
      normalized.includes("usuário não encontrado")
    );
  }

  function parseResponseBody(text: string): unknown {
    const trimmed = text.trim();
    if (!trimmed) {
      return null;
    }
    try {
      return JSON.parse(trimmed) as unknown;
    } catch {
      return text;
    }
  }

  async function apiFetchServer<T>(
    path: string,
    options: FetchOptions = {},
  ): Promise<T> {
    const response = await fetchWithSession(path, options);

    if (!response.ok) {
      const text = await response.text();
      if (isInvalidSessionResponse(response.status, text)) {
        await clearAuthCookies();
      }
      throw new ApiRequestError(response.status, text);
    }

    return (await response.json()) as T;
  }

  async function apiFetchSecurity<T>(
    path: string,
    options: FetchOptions = {},
  ): Promise<T> {
    const response = await fetchWithSession(path, options);

    if (!response.ok) {
      const text = await response.text();
      if (isInvalidSessionResponse(response.status, text)) {
        await clearAuthCookies();
      }
      throw new ApiClientError(
        `API request failed with status ${response.status}`,
        response.status,
        parseResponseBody(text),
      );
    }

    if (response.status === 204) {
      return null as T;
    }

    return (await response.json()) as T;
  }

  return {
    fetchWithSession,
    apiFetchSecurity,
    apiFetchServer,
    buildHeaders,
    applySessionCookies,
    clearAuthCookies,
    isInvalidSessionResponse,
  };
}
