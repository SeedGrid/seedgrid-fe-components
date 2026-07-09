import { securityConfig } from "../config";
import type {
  AuthenticatedSession,
  PendingTwoFactorSession,
} from "../types";

function readStorageValue<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(key);

    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as T;
  } catch {
    return null;
  }
}

function writeStorageValue<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function removeStorageValue(key: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(key);
}

export function readStoredSession() {
  return readStorageValue<AuthenticatedSession>(securityConfig.storage.sessionKey);
}

export function writeStoredSession(session: AuthenticatedSession) {
  writeStorageValue(securityConfig.storage.sessionKey, session);
}

export function clearStoredSession() {
  removeStorageValue(securityConfig.storage.sessionKey);
}

export function readPendingTwoFactorSession() {
  const session = readStorageValue<PendingTwoFactorSession>(
    securityConfig.storage.pendingTwoFactorKey
  );

  if (!session) {
    return null;
  }

  if (!session.tempToken && session.twoFactorToken) {
    return {
      ...session,
      tempToken: session.twoFactorToken,
    };
  }

  return session;
}

export function writePendingTwoFactorSession(
  session: PendingTwoFactorSession
) {
  writeStorageValue(securityConfig.storage.pendingTwoFactorKey, session);
}

export function clearPendingTwoFactorSession() {
  removeStorageValue(securityConfig.storage.pendingTwoFactorKey);
}
