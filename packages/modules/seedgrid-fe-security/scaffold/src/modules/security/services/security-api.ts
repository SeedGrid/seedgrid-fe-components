import {
  ApiClientError,
  createApiClient,
  extractApiErrorMessage,
  type ApiRequestOptions,
} from "@/modules/core";
import { getMessages, translate } from "@/i18n";

import { securityConfig } from "../config";

type AuthRuntime = {
  getAccessToken: () => Promise<string | null>;
  refreshAccessToken: () => Promise<string | null>;
  onAuthFailure: () => void | Promise<void>;
};

const runtime: AuthRuntime = {
  getAccessToken: async () => null,
  refreshAccessToken: async () => null,
  onAuthFailure: async () => {},
};

let pendingRefresh: Promise<string | null> | null = null;

const privateClient = createApiClient({
  baseUrl: securityConfig.apiBaseUrl,
  getAccessToken: () => runtime.getAccessToken(),
  refreshAccessToken: () => {
    if (!pendingRefresh) {
      pendingRefresh = runtime.refreshAccessToken().finally(() => {
        pendingRefresh = null;
      });
    }
    return pendingRefresh;
  },
  onAuthFailure: () => runtime.onAuthFailure(),
});

const publicClient = createApiClient({
  baseUrl: securityConfig.apiBaseUrl,
});

export function configureSecurityApi(nextRuntime: Partial<AuthRuntime>) {
  if (typeof nextRuntime.getAccessToken === "function") {
    runtime.getAccessToken = nextRuntime.getAccessToken;
  }

  if (typeof nextRuntime.refreshAccessToken === "function") {
    runtime.refreshAccessToken = nextRuntime.refreshAccessToken;
  }

  if (typeof nextRuntime.onAuthFailure === "function") {
    runtime.onAuthFailure = nextRuntime.onAuthFailure;
  }
}

export const securityApi = {
  get: <T = unknown>(path: string, options?: ApiRequestOptions) =>
    privateClient.get<T>(path, options),
  post: <T = unknown>(path: string, options?: ApiRequestOptions) =>
    privateClient.post<T>(path, options),
  put: <T = unknown>(path: string, options?: ApiRequestOptions) =>
    privateClient.put<T>(path, options),
  patch: <T = unknown>(path: string, options?: ApiRequestOptions) =>
    privateClient.patch<T>(path, options),
  delete: <T = unknown>(path: string, options?: ApiRequestOptions) =>
    privateClient.delete<T>(path, options),
  public: {
    get: <T = unknown>(path: string, options?: ApiRequestOptions) =>
      publicClient.get<T>(path, {
        ...options,
        requireAuth: false,
      }),
    post: <T = unknown>(path: string, options?: ApiRequestOptions) =>
      publicClient.post<T>(path, {
        ...options,
        requireAuth: false,
      }),
    put: <T = unknown>(path: string, options?: ApiRequestOptions) =>
      publicClient.put<T>(path, {
        ...options,
        requireAuth: false,
      }),
    patch: <T = unknown>(path: string, options?: ApiRequestOptions) =>
      publicClient.patch<T>(path, {
        ...options,
        requireAuth: false,
      }),
    delete: <T = unknown>(path: string, options?: ApiRequestOptions) =>
      publicClient.delete<T>(path, {
        ...options,
        requireAuth: false,
      }),
  },
};

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

export function extractApiMessage(error: unknown) {
  if (isApiClientError(error)) {
    const message = readApiMessage(error.responseBody) ?? extractApiErrorMessage(error);
    return normalizeReadableErrorMessage(message);
  }

  // Erros que atravessam a fronteira server->client (server actions/RSC) sao
  // serializados e PERDEM o prototype de ApiClientError, entao `instanceof`
  // falha aqui. Mas o formato { responseBody } / { cause: { responseBody } }
  // sobrevive — le dele o problem+json (violations/detail/...) antes de cair no
  // fallback generico, senao o usuario veria "API request failed with status
  // 400" em vez da mensagem de validacao real.
  const duckTypedMessage = readDuckTypedApiMessage(error);
  if (duckTypedMessage) {
    return normalizeReadableErrorMessage(duckTypedMessage);
  }

  return normalizeReadableErrorMessage(extractApiErrorMessage(error));
}

// Le a mensagem do corpo de um erro "parecido com ApiClientError" (sem depender
// de instanceof): tenta `error.responseBody` e, em seguida, `error.cause.responseBody`
// (o body pode vir ja como objeto ou como string JSON — readApiMessage trata os dois).
function readDuckTypedApiMessage(error: unknown): string | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  const record = error as Record<string, unknown>;
  const fromBody = readApiMessage(record.responseBody);
  if (fromBody) {
    return fromBody;
  }

  if (record.cause && typeof record.cause === "object") {
    const cause = record.cause as Record<string, unknown>;
    const fromCause = readApiMessage(cause.responseBody);
    if (fromCause) {
      return fromCause;
    }
  }

  return null;
}

function readApiMessage(body: unknown): string | null {
  const normalizedBody = normalizeApiBody(body);

  if (!normalizedBody || typeof normalizedBody !== "object") {
    return pickString(normalizedBody);
  }

  const record = normalizedBody as Record<string, unknown>;

  if (Array.isArray(record.violations)) {
    for (const entry of record.violations) {
      const violationMessage = readRecordMessage(entry);

      if (violationMessage) {
        return violationMessage;
      }
    }
  }

  if (Array.isArray(record.errors)) {
    for (const entry of record.errors) {
      const nestedMessage = readRecordMessage(entry);

      if (nestedMessage) {
        return nestedMessage;
      }
    }
  }

  return (
    pickString(record.userMessage) ??
    pickString(record.detail) ??
    pickString(record.message) ??
    pickString(record.error) ??
    pickString(record.title)
  );
}

function normalizeApiBody(body: unknown) {
  if (typeof body !== "string") {
    return body;
  }

  const normalized = body.trim();

  if (!normalized) {
    return body;
  }

  try {
    return JSON.parse(normalized) as unknown;
  } catch {
    return body;
  }
}

function readRecordMessage(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  return (
    pickString(record.userMessage) ??
    pickString(record.message) ??
    pickString(record.error) ??
    pickString(record.description)
  );
}

function normalizeReadableErrorMessage(message: string | null) {
  const normalizedMessage = pickString(message);

  if (!normalizedMessage) {
    return null;
  }

  if (isServerConnectionError(normalizedMessage)) {
    return translate(
      getMessages(resolveRuntimeLocale()),
      "security.common.server_connection_error"
    );
  }

  if (isHtmlContent(normalizedMessage)) {
    return null;
  }

  return normalizedMessage;
}

function isHtmlContent(message: string) {
  const trimmed = message.trimStart();

  return trimmed.startsWith("<!") || trimmed.startsWith("<html") || trimmed.startsWith("<HTML");
}

function isServerConnectionError(message: string) {
  const normalized = message.trim().toLowerCase();

  return (
    normalized === "fetch failed" ||
    normalized === "failed to fetch" ||
    normalized.includes("networkerror") ||
    normalized.includes("network request failed") ||
    normalized.includes("load failed")
  );
}

function resolveRuntimeLocale() {
  if (typeof document !== "undefined") {
    const documentLocale = document.documentElement.lang?.trim();

    if (documentLocale) {
      return documentLocale;
    }
  }

  if (typeof navigator !== "undefined") {
    const browserLocale =
      navigator.language?.trim() || navigator.languages?.[0]?.trim();

    if (browserLocale) {
      return browserLocale;
    }
  }

  return undefined;
}

function pickString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}
