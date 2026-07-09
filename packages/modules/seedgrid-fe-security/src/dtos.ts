// DTOs do SeedGrid Security (espelham o report-api). Separados dos DTOs de domínio do
// admin — aqui só entra o que é security-core. Client-safe (tipos puros).

/** Página genérica do backend (list endpoints). */
export interface PaginatedResult<T> {
  items: T[];
  totalRecords: number;
  page: number;
  size: number;
  sortField: string;
  sortOrder: "asc" | "desc";
  query: string;
}

export interface PermissionOption {
  publicId: string;
  name: string;
  description: string;
}

/** Resumo de role usado dentro de UserEntry. */
export interface RoleSummary {
  publicId: string;
  name: string;
}

export interface RoleEntry {
  id: number;
  publicId: string;
  name: string;
  description: string;
  active: boolean;
  forIntegration: boolean;
  createdAt: string;
  updatedAt: string;
  permissionsCount: number;
  permissions: PermissionOption[];
}

export interface UserEntry {
  id: number;
  publicId: string;
  email: string;
  name: string;
  whatsApp: string;
  active: boolean;
  root: boolean;
  changePasswordRequired: boolean;
  passwordExpiresAt: string | null;
  twoFactorEnabled: boolean;
  emailConfirmed: boolean;
  companiesCount: number;
  createdAt: string;
  updatedAt: string;
  roles: RoleSummary[];
}

// AuditLogEntry vive no módulo próprio @seedgrid/fe-audit (audit não é security-core).

export type TwoFactorMethod = "TOTP" | "EMAIL" | "WHATSAPP";

export interface TwoFactorStatus {
  enabled: boolean;
  primaryMethod: TwoFactorMethod | null;
  availableMethods: TwoFactorMethod[];
  hasBackupCodes: boolean;
  unusedBackupCodesCount: number;
}

/**
 * Resposta de /2f/enable, /2f/totp/confirm e /2f/setup/confirm. Campos variam por
 * etapa: enable TOTP traz qrCode/secret; confirm traz backupCodes; EMAIL/WHATSAPP
 * enable traz apenas metadata de confirmação.
 */
export interface TwoFactorEnableResponse {
  status: string;
  method?: TwoFactorMethod;
  primaryMethod?: TwoFactorMethod;
  secret?: string;
  otpauthUrl?: string;
  qrCode?: {
    format: string;
    width: number;
    height: number;
    base64: string;
  } | null;
  backupCodes?: string[];
  metadata?: {
    email?: string;
    whatsApp?: string;
    [key: string]: unknown;
  };
}

export interface PickListOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  data?: unknown;
}
