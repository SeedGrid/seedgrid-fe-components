// seedgrid:managed

import { ApiClientError } from "@/modules/core";

import type {
  AuthTokens,
  ForgotPasswordPayload,
  LoginCredentials,
  PendingTwoFactorSession,
  PermissionEnvelope,
} from "../types";
import { securityApi } from "./security-api";

const SESSION_ROUTE_BASE = "/api/security/session";

export type LoginOutcome =
  | {
      kind: "authenticated";
      tokens: AuthTokens;
    }
  | {
      kind: "two_factor_required";
      pending: PendingTwoFactorSession;
    };

export const authService = {
  async signIn(credentials: LoginCredentials): Promise<LoginOutcome> {
    const response = await callSessionRoute<unknown>(`${SESSION_ROUTE_BASE}/login`, {
      method: "POST",
      body: credentials,
    });

    const accessToken = pickString(response, "accessToken", "token");
    const tempToken = pickString(response, "tempToken", "twoFactorToken");
    const status = pickString(response, "status");

    if (!accessToken && tempToken && (status?.includes("2F") ?? true)) {
      return {
        kind: "two_factor_required",
        pending: {
          login: credentials.login,
          tempToken,
          method: pickString(response, "method"),
        },
      };
    }

    return {
      kind: "authenticated",
      tokens: parseAuthTokens(response),
    };
  },

  async verifyTwoFactor(
    pendingSession: PendingTwoFactorSession,
    code: string
  ) {
    const normalizedCode = code.trim();

    const response = await callSessionRoute<unknown>(
      `${SESSION_ROUTE_BASE}/2fa/verify`,
      {
        method: "POST",
        body: {
          tempToken:
            pendingSession.tempToken || pendingSession.twoFactorToken || "",
          code: normalizedCode,
          twoFactorCode: normalizedCode,
          backupCode: normalizedCode,
        },
      }
    );

    return parseAuthTokens(response);
  },

  async resendTwoFactor(pendingSession: PendingTwoFactorSession) {
    return callSessionRoute<unknown>(`${SESSION_ROUTE_BASE}/2fa/resend`, {
      method: "POST",
      body: {
        tempToken:
          pendingSession.tempToken || pendingSession.twoFactorToken || "",
      },
    });
  },

  async refresh() {
    const response = await callSessionRoute<unknown>(`${SESSION_ROUTE_BASE}/refresh`, {
      method: "POST",
    });

    return parseAuthTokens(response);
  },

  async logout() {
    await callSessionRoute<unknown>(`${SESSION_ROUTE_BASE}/logout`, {
      method: "POST",
    });
  },

  async forgotPassword(payload: ForgotPasswordPayload) {
    return securityApi.public.post<unknown>("/public/auth/forgot-password", {
      body: payload,
      retry: false,
    });
  },

  async confirmPasswordReset(token: string) {
    const encodedToken = encodeURIComponent(token.trim());

    return securityApi.public.get<unknown>(
      `/public/auth/reset-password?token=${encodedToken}`,
      {
        retry: false,
      }
    );
  },

  async confirmEmail(token: string) {
    const encodedToken = encodeURIComponent(token.trim());

    return securityApi.public.get<unknown>(
      `/public/auth/confirm-email?token=${encodedToken}`,
      {
        retry: false,
      }
    );
  },

  async loadPermissions(accessToken?: string): Promise<PermissionEnvelope> {
    const response = await securityApi.get<unknown>("/me/permissions", {
      requireAuth: !accessToken,
      retry: false,
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    });

    return {
      permissions: readStringArray(response, "permissions"),
      roles: readStringArray(response, "roles"),
      login:
        pickString(response, "login", "username", "email", "userName") ??
        undefined,
      publicId: pickString(response, "publicId") ?? undefined,
      name: pickString(response, "name", "fullName") ?? undefined,
    };
  },
};

function parseAuthTokens(response: unknown): AuthTokens {
  const accessToken = pickString(response, "accessToken", "token");

  if (!accessToken) {
    throw new Error("Security authentication response is missing access token.");
  }

  const expiresIn = pickNumber(response, "expiresIn");
  const accessTokenClaims = parseJwtClaims(accessToken);

  return {
    accessToken,
    refreshToken: pickString(response, "refreshToken"),
    tokenType: pickString(response, "tokenType") ?? "Bearer",
    expiresIn,
    expiresAt:
      typeof expiresIn === "number" ? Date.now() + expiresIn * 1000 : null,
    allowedCompanies: readNumberArray(accessTokenClaims, "allowedCompanies"),
    publicId:
      pickString(response, "publicId") ??
      pickString(
        accessTokenClaims,
        "publicId",
        "userPublicId",
        "uid",
        "sub"
      ) ??
      undefined,
    name:
      pickString(response, "name", "fullName") ??
      pickString(accessTokenClaims, "name", "fullName", "given_name") ??
      undefined,
    changePasswordRequired: pickBoolean(response, "changePasswordRequired") ?? undefined,
  };
}

function parseJwtClaims(token: string) {
  const parts = token.split(".");

  if (parts.length < 2) {
    return null;
  }

  try {
    const normalizedPayload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      "="
    );
    const decodedPayload = atob(paddedPayload);

    return JSON.parse(decodedPayload) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function callSessionRoute<T>(
  path: string,
  init: {
    method?: string;
    body?: unknown;
  } = {}
): Promise<T> {
  const headers = new Headers();

  if (init.body != null) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    method: init.method ?? "GET",
    headers,
    body: init.body == null ? undefined : JSON.stringify(init.body),
    cache: "no-store",
    credentials: "same-origin",
  });

  if (response.ok) {
    if (response.status === 204) {
      return null as T;
    }

    return (await response.json()) as T;
  }

  throw new ApiClientError(
    `API request failed with status ${response.status}`,
    response.status,
    await readResponseBody(response)
  );
}

async function readResponseBody(response: Response) {
  const contentType = response.headers.get("Content-Type") ?? "";
  console.log("[readResponseBody] contentType:", contentType);

  if (isJsonContentType(contentType)) {
    const json = await response.json();
    console.log("[readResponseBody] response json:", JSON.stringify(json, null, 2));
    return json;
  }

  const text = await response.text();
  console.log("[readResponseBody] response text:", text);
  return text;
}

function isJsonContentType(contentType: string) {
  const normalized = contentType.trim().toLowerCase();

  return normalized.includes("/json") || normalized.includes("+json");
}

function pickBoolean(value: unknown, ...keys: string[]): boolean | null {
  const candidate = keys.length > 0 ? readValue(value, keys) : value;

  return typeof candidate === "boolean" ? candidate : null;
}

function pickString(value: unknown, ...keys: string[]): string | null {
  const candidate = keys.length > 0 ? readValue(value, keys) : value;

  return typeof candidate === "string" && candidate.trim().length > 0
    ? candidate.trim()
    : null;
}

function pickNumber(value: unknown, ...keys: string[]) {
  const candidate = keys.length > 0 ? readValue(value, keys) : value;

  return typeof candidate === "number" && Number.isFinite(candidate)
    ? candidate
    : null;
}

function readStringArray(value: unknown, key: string) {
  if (!value || typeof value !== "object") {
    return [] as string[];
  }

  const candidate = (value as Record<string, unknown>)[key];

  return Array.isArray(candidate)
    ? candidate.filter((entry): entry is string => typeof entry === "string")
    : [];
}

function readNumberArray(value: unknown, key: string) {
  if (!value || typeof value !== "object") {
    return [] as number[];
  }

  const candidate = (value as Record<string, unknown>)[key];

  return Array.isArray(candidate)
    ? candidate.filter(
        (entry): entry is number =>
          typeof entry === "number" && Number.isFinite(entry)
      )
    : [];
}

function readValue(value: unknown, keys: string[]) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  for (const key of keys) {
    const candidate = record[key];

    if (candidate !== undefined && candidate !== null) {
      return candidate;
    }
  }

  return null;
}
