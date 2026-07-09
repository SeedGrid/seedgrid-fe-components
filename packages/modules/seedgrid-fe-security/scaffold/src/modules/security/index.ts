// seedgrid:managed

export { AuthProvider, useAuthContext } from "./AuthProvider";
export { useAuth } from "./hooks/useAuth";
export { useCrudPermission, usePermission } from "./hooks/usePermission";
export { useDebouncedSearch } from "./hooks/useDebouncedSearch";
export { AppShell } from "./components/AppShell";
export { CompanyManagementGuard } from "./components/CompanyManagementGuard";
export { PageFrame, InlineNotice } from "./components/PageFrame";
export { RouteGuard } from "./components/RouteGuard";
export { securityConfig } from "./config";
export {
  isCompanyManagementEnabledForHostKind,
  resolveSecurityHostKind,
  useCompanyManagementEnabledForCurrentHost,
  useSecurityHostKind,
} from "./host-access";
export { resolvePostAuthPath } from "./navigation";
export { useSecurityAppShellSections } from "./useSecurityAppShellSections";
export { authService } from "./services/auth-service";
export {
  classifySelfEnterInvitationAdminError,
  classifySelfEnterInvitationError,
  isSelfEnterInvitationEmailMismatchError,
  securityService,
} from "./services/security-service";
export {
  extractApiMessage,
  isApiClientError,
} from "./services/security-api";
export type * from "./types";

// Promovidos pra lib versionada (@seedgrid/fe-security) — ver ADR 0004/0005 e
// scaffold/README.md pro criterio lib vs scaffold usado nesta extracao.
export { PickListField, StatusBadge } from "@seedgrid/fe-security/client";
export {
  buildCrudPermissions,
  createPermissionSet,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  normalizePermission,
  securityMessages,
} from "@seedgrid/fe-security";
