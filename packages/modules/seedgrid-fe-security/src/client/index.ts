// Barrel CLIENT (@seedgrid/fe-security/client). React + next/navigation (hooks client).
// Não importe daqui em código server-only.

export {
  PermissionProvider,
  usePermissions,
  type PermissionContextValue,
  type PermissionProviderProps,
} from "./permission-provider";
export { StatusBadge } from "./status-badge";
export { PickListField } from "./pick-list-field";
