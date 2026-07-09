import { appEnvironment } from "@/config/environment";

function resolveApiBaseUrl() {
  // Client-side: route through Next.js proxy to avoid CORS on error responses.
  // The proxy at /api/[[...path]] forwards server-side to the backend.
  if (globalThis.window !== undefined) {
    return "/api";
  }

  return appEnvironment.hosts.apiOrigin;
}

function resolveBooleanFlag(value: string | undefined) {
  return value?.trim().toLowerCase() === "true";
}

export const securityConfig = {
  apiBaseUrl: resolveApiBaseUrl(),
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50],
  },
  search: {
    debounceMs: 1000,
    minLength: 3,
  },
  storage: {
    sessionKey: `${appEnvironment.persistence.scope}:security:session`,
    pendingTwoFactorKey: `${appEnvironment.persistence.scope}:security:pending-2fa`,
  },
  features: {
    selfEnterEnabled: resolveBooleanFlag(
      process.env.NEXT_PUBLIC_SECURITY_SELF_ENTER_ENABLED
    ),
  },
  routes: {
    dashboard: "/",
    profile: "/security/profile",
    login: "/auth/login",
    welcome: "/auth/welcome",
    forgotPassword: "/auth/forgot-password",
    forgotPasswordConfirm: "/auth/forgot-password/confirm",
    forgotPasswordSuccess: "/auth/forgot-password/success",
    verifyTwoFactor: "/auth/2fa/verify",
    users: "/security/users",
    companies: "/security/companies",
    roles: "/security/roles",
    twoFactor: "/security/2fa",
    apiKeys: "/security/api-keys",
    changePassword: "/users/change-password",
    selfEnterPublic: "/auth/self-enter",
    selfEnterApproval: "/self-enter/requests/to-approve",
    selfEnterInvitations: "/self-enter/invitations",
  },
} as const;
