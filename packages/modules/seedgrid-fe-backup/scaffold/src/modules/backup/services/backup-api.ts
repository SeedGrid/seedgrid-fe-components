// seedgrid:managed

import {
  ApiClientError,
  createApiClient,
  extractApiErrorMessage,
  type ApiRequestOptions,
} from "@/modules/core";
import { getMessages, translate } from "@/i18n";

import { backupConfig } from "../config";

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
  baseUrl: backupConfig.apiBaseUrl,
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

export function configureBackupApi(nextRuntime: Partial<AuthRuntime>) {
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

export const backupApi = {
  get: <T = unknown>(path: string, options?: ApiRequestOptions) =>
    privateClient.get<T>(path, options),
  post: <T = unknown>(path: string, options?: ApiRequestOptions) =>
    privateClient.post<T>(path, options),
  delete: <T = unknown>(path: string, options?: ApiRequestOptions) =>
    privateClient.delete<T>(path, options),
};

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

export function extractBackupApiMessage(error: unknown): string | null {
  if (error instanceof ApiClientError) {
    return normalizeReadableErrorMessage(
      readApiMessage(error.responseBody) ?? extractApiErrorMessage(error)
    );
  }

  return normalizeReadableErrorMessage(extractApiErrorMessage(error));
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
  const normalized = pickString(message);

  if (!normalized) {
    return null;
  }

  if (isServerConnectionError(normalized)) {
    return translate(
      getMessages(resolveRuntimeLocale()),
      "backup.common.server_connection_error"
    );
  }

  if (isHtmlContent(normalized)) {
    return null;
  }

  return normalized;
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
    if (documentLocale) return documentLocale;
  }

  if (typeof navigator !== "undefined") {
    const browserLocale =
      navigator.language?.trim() || navigator.languages?.[0]?.trim();
    if (browserLocale) return browserLocale;
  }

  return undefined;
}

function pickString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}
