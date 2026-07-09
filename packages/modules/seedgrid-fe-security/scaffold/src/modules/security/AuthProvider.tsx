"use client";

// seedgrid:managed

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import { captureException } from "@/modules/core";

import {
  createPermissionSet,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from "@seedgrid/fe-security";
import { securityConfig } from "./config";
import { authService, type LoginOutcome } from "./services/auth-service";
import {
  configureSecurityApi,
  isApiClientError,
} from "./services/security-api";
import {
  clearPendingTwoFactorSession,
  clearStoredSession,
  readPendingTwoFactorSession,
  readStoredSession,
  writePendingTwoFactorSession,
  writeStoredSession,
} from "./services/session-storage";
import type {
  AuthenticatedSession,
  ForgotPasswordPayload,
  LoginCredentials,
  PendingTwoFactorSession,
  PermissionEnvelope,
} from "./types";

type AuthContextValue = {
  status: "anonymous" | "authenticated" | "initializing";
  session: AuthenticatedSession | null;
  permissions: string[];
  roles: string[];
  pendingTwoFactor: PendingTwoFactorSession | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginOutcome>;
  verifyTwoFactor: (code: string) => Promise<void>;
  forgotPassword: (payload: ForgotPasswordPayload) => Promise<void>;
  reloadPermissions: () => Promise<PermissionEnvelope>;
  refreshSession: () => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function isPublicRoute(pathname?: string | null) {
  const normalizedPathname = pathname?.trim() || "";

  return (
    normalizedPathname === securityConfig.routes.login ||
    normalizedPathname === securityConfig.routes.forgotPassword ||
    normalizedPathname === securityConfig.routes.forgotPasswordConfirm ||
    normalizedPathname === securityConfig.routes.forgotPasswordSuccess ||
    normalizedPathname === securityConfig.routes.verifyTwoFactor ||
    normalizedPathname === securityConfig.routes.selfEnterPublic ||
    normalizedPathname === "/signup" ||
    normalizedPathname.startsWith("/public/")
  );
}

function shouldCaptureAuthError(error: unknown) {
  return !(isApiClientError(error) && error.status === 401);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [status, setStatus] = useState<AuthContextValue["status"]>("initializing");
  const [session, setSession] = useState<AuthenticatedSession | null>(null);
  const [pendingTwoFactor, setPendingTwoFactor] =
    useState<PendingTwoFactorSession | null>(null);
  const currentRouteIsPublic = useMemo(
    () => isPublicRoute(pathname),
    [pathname]
  );

  const applyAuthenticatedSession = useCallback(
    (
      nextSession: Omit<AuthenticatedSession, "permissions" | "roles">,
      permissionEnvelope: PermissionEnvelope
    ) => {
      const normalizedPermissions = Array.from(
        createPermissionSet(permissionEnvelope.permissions)
      );
      const authenticatedSession: AuthenticatedSession = {
        ...nextSession,
        permissions: normalizedPermissions,
        roles: permissionEnvelope.roles,
      };

      setSession(authenticatedSession);
      setStatus("authenticated");
      writeStoredSession(authenticatedSession);
      setPendingTwoFactor(null);
      clearPendingTwoFactorSession();
    },
    []
  );

  const clearClientAuthState = useCallback(() => {
    clearStoredSession();
    clearPendingTwoFactorSession();
    setSession(null);
    setPendingTwoFactor(null);
    setStatus("anonymous");
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      await captureException(error, {
        area: "client",
        source: "security.auth.logout",
      });
    } finally {
      clearClientAuthState();
    }
  }, [clearClientAuthState]);

  const handleAuthFailure = useCallback(() => {
    clearClientAuthState();
    void authService.logout();

    if (typeof window === "undefined") {
      return;
    }

    if (isPublicRoute(window.location.pathname)) {
      return;
    }

    window.location.replace(securityConfig.routes.login);
  }, [clearClientAuthState]);

  const refreshSessionInternal = useCallback(async (redirectOnFailure: boolean) => {
    const currentSession = readStoredSession() ?? session;

    try {
      const refreshedTokens = await authService.refresh();
      const permissionEnvelope = await authService.loadPermissions(
        refreshedTokens.accessToken
      );

      applyAuthenticatedSession(
        {
          ...refreshedTokens,
          login: permissionEnvelope.login ?? currentSession?.login,
          publicId:
            refreshedTokens.publicId ??
            permissionEnvelope.publicId ??
            currentSession?.publicId,
          name:
            refreshedTokens.name ??
            permissionEnvelope.name ??
            currentSession?.name,
        },
        permissionEnvelope
      );

      return true;
    } catch (error) {
      if (shouldCaptureAuthError(error)) {
        await captureException(error, {
          area: "client",
          source: "security.auth.refreshSession",
        });
      }

      if (redirectOnFailure) {
        handleAuthFailure();
      } else {
        clearClientAuthState();
      }

      return false;
    }
  }, [applyAuthenticatedSession, clearClientAuthState, handleAuthFailure]);

  const refreshSession = useCallback(
    async () => refreshSessionInternal(true),
    [refreshSessionInternal]
  );

  const reloadPermissions = useCallback(async () => {
    const currentSession = readStoredSession() ?? session;

    if (!currentSession) {
      return {
        permissions: [],
        roles: [],
      };
    }

    const permissionEnvelope = await authService.loadPermissions(
      currentSession.accessToken
    );

    applyAuthenticatedSession(
      {
        ...currentSession,
        login: permissionEnvelope.login ?? currentSession.login,
        publicId: permissionEnvelope.publicId ?? currentSession.publicId,
        name: permissionEnvelope.name ?? currentSession.name,
      },
      permissionEnvelope
    );

    return permissionEnvelope;
  }, [applyAuthenticatedSession, session]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const outcome = await authService.signIn(credentials);

      if (outcome.kind === "two_factor_required") {
        setPendingTwoFactor(outcome.pending);
        writePendingTwoFactorSession(outcome.pending);
        setStatus("anonymous");
        return outcome;
      }

      const permissionEnvelope = await authService.loadPermissions(
        outcome.tokens.accessToken
      );

      applyAuthenticatedSession(
        {
          ...outcome.tokens,
          login: permissionEnvelope.login ?? credentials.login,
          publicId: outcome.tokens.publicId ?? permissionEnvelope.publicId,
          name: outcome.tokens.name ?? permissionEnvelope.name,
        },
        permissionEnvelope
      );

      return outcome;
    },
    [applyAuthenticatedSession]
  );

  const verifyTwoFactor = useCallback(
    async (code: string) => {
      const pendingSession = pendingTwoFactor ?? readPendingTwoFactorSession();

      if (!pendingSession) {
        throw new Error("No pending two-factor session was found.");
      }

      const tokens = await authService.verifyTwoFactor(pendingSession, code);
      const permissionEnvelope = await authService.loadPermissions(
        tokens.accessToken
      );

      applyAuthenticatedSession(
        {
          ...tokens,
          login: permissionEnvelope.login ?? pendingSession.login,
          publicId: tokens.publicId ?? permissionEnvelope.publicId,
          name: tokens.name ?? permissionEnvelope.name,
        },
        permissionEnvelope
      );
    },
    [applyAuthenticatedSession, pendingTwoFactor]
  );

  const forgotPassword = useCallback(async (payload: ForgotPasswordPayload) => {
    await authService.forgotPassword(payload);
  }, []);

  useEffect(() => {
    configureSecurityApi({
      getAccessToken: async () => readStoredSession()?.accessToken ?? null,
      refreshAccessToken: async () => {
        const refreshed = await refreshSession();
        return refreshed ? readStoredSession()?.accessToken ?? null : null;
      },
      onAuthFailure: handleAuthFailure,
    });
  }, [handleAuthFailure, refreshSession]);

  useEffect(() => {
    const existingPendingSession = readPendingTwoFactorSession();

    if (existingPendingSession) {
      setPendingTwoFactor(existingPendingSession);
    }

    const existingSession = readStoredSession();

    if (!existingSession) {
      if (currentRouteIsPublic) {
        setStatus("anonymous");
        return;
      }

      void (async () => {
        const refreshed = await refreshSessionInternal(false);

        if (!refreshed) {
          setStatus("anonymous");
        }
      })();

      return;
    }

    setSession(existingSession);

    void (async () => {
      try {
        const permissionEnvelope = await authService.loadPermissions(
          existingSession.accessToken
        );

        if (existingSession.publicId && existingSession.name) {
          applyAuthenticatedSession(existingSession, permissionEnvelope);
          return;
        }

        const refreshed = await refreshSessionInternal(false);

        if (!refreshed) {
          applyAuthenticatedSession(existingSession, permissionEnvelope);
        }
      } catch (error) {
        if (shouldCaptureAuthError(error)) {
          await captureException(error, {
            area: "client",
            source: "security.auth.bootstrap",
          });
        }

        const refreshed = await refreshSessionInternal(!currentRouteIsPublic);

        if (!refreshed) {
          setStatus("anonymous");
        }
      }
    })();
  }, [
    applyAuthenticatedSession,
    currentRouteIsPublic,
    refreshSessionInternal,
  ]);

  const permissionSet = useMemo(
    () => createPermissionSet(session?.permissions ?? []),
    [session?.permissions]
  );

  const value: AuthContextValue = {
    status,
    session,
    permissions: session?.permissions ?? [],
    roles: session?.roles ?? [],
    pendingTwoFactor,
    isAuthenticated: status === "authenticated" && Boolean(session),
    isInitializing: status === "initializing",
    login,
    verifyTwoFactor,
    forgotPassword,
    reloadPermissions,
    refreshSession,
    logout,
    hasPermission: (permission) => hasPermission(permissionSet, permission),
    hasAnyPermission: (permissions) =>
      hasAnyPermission(permissionSet, permissions),
    hasAllPermissions: (permissions) =>
      hasAllPermissions(permissionSet, permissions),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return context;
}
