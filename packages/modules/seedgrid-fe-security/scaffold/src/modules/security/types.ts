export type PermissionValue = string;

export type SortOrder = 1 | -1 | 0;

export type SortState = {
  sortField: string | null;
  sortOrder: SortOrder;
};

export type PagedResult<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
  fallback?: boolean;
};

export type PermissionEnvelope = {
  permissions: PermissionValue[];
  roles: string[];
  login?: string;
  publicId?: string;
  name?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string | null;
  tokenType: string;
  expiresIn?: number | null;
  expiresAt?: number | null;
  allowedCompanies: number[];
  publicId?: string;
  name?: string;
  changePasswordRequired?: boolean;
};

export type AuthenticatedSession = AuthTokens &
  PermissionEnvelope & {
    login?: string;
  };

export type LoginCredentials = {
  login: string;
  password: string;
};

export type PendingTwoFactorSession = {
  login: string;
  tempToken: string;
  twoFactorToken?: string;
  method?: string | null;
};

export type ForgotPasswordPayload = {
  email: string;
  newPassword: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type PermissionSummary = {
  id?: number;
  publicId: string;
  name: string;
  description?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RoleSummary = {
  id?: number;
  publicId: string;
  name: string;
  description?: string | null;
  forIntegration?: boolean;
  permissions?: PermissionSummary[] | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RoleMutationPayload = {
  name: string;
  description?: string;
  forIntegration?: boolean;
  permissionIds: Array<string | number>;
};

export type CompanySummary = {
  id?: number;
  publicId: string;
  cnpj?: string | null;
  corporateName?: string | null;
  tradeName?: string | null;
  active?: boolean;
  addrStreet?: string | null;
  addrNumber?: string | null;
  addrComplement?: string | null;
  addrPostalCode?: string | null;
  addrCity?: string | null;
  addrState?: string | null;
  addrDistrict?: string | null;
  addrPhone?: string | null;
  repFirstName?: string | null;
  repLastName?: string | null;
  repCpf?: string | null;
  repPhone?: string | null;
  repWhatsapp?: string | null;
  repEmail?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type UserSummary = {
  id?: number;
  publicId: string;
  email: string;
  name?: string | null;
  whatsApp?: string | null;
  avatarStorageKey?: string | null;
  roles?: RoleSummary[];
  companies?: CompanySummary[];
  companyIds?: Array<number | string>;
  companyPublicIds?: string[];
  root?: boolean;
  active?: boolean;
  changePasswordRequired?: boolean;
  passwordExpiresAt?: string | null;
  emailConfirmedAt?: string | null;
  twoFactorEnabled?: boolean;
  twoFactorPrimaryMethod?: string | null;
  twoFactorEnabledAt?: string | null;
  twoFactorLastUsedAt?: string | null;
  twoFactorHasBackupCodes?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type UserMutationPayload = {
  email: string;
  name?: string;
  password?: string;
  whatsApp?: string;
  roleIds: number[];
  companyIds: number[];
  active: boolean;
  changePasswordRequired: boolean;
};

export type CompanyMutationPayload = {
  cnpj?: string;
  corporateName: string;
  tradeName: string;
  active: boolean;
  addrStreet?: string;
  addrNumber?: string;
  addrComplement?: string;
  addrPostalCode?: string;
  addrCity?: string;
  addrState?: string;
  addrDistrict?: string;
  addrPhone?: string;
  repFirstName?: string;
  repLastName?: string;
  repCpf?: string;
  repPhone?: string;
  repWhatsapp?: string;
  repEmail?: string;
};

export type TwoFactorMethod = "EMAIL" | "TOTP" | "BACKUP_CODE" | string;

export type TwoFactorStatus = {
  enabled: boolean;
  primaryMethod?: TwoFactorMethod | null;
  availableMethods: TwoFactorMethod[];
  hasBackupCodes?: boolean;
  unusedBackupCodesCount?: number;
};

export type TwoFactorEnableResponse = {
  status?: string;
  method?: TwoFactorMethod | null;
  primaryMethod?: TwoFactorMethod | null;
  backupCodes?: string[];
  secret?: string | null;
  otpauthUrl?: string | null;
  qrCode?: {
    format?: string | null;
    width?: number | null;
    height?: number | null;
    base64?: string | null;
  } | null;
};

export type DisableTwoFactorPayload = {
  twoFactorCode?: string;
  password?: string;
  backupCode?: string;
};

export type EntryRequest = {
  id: number | string;
  name?: string | null;
  email?: string | null;
  whatsApp?: string | null;
  message?: string | null;
  status?: string | null;
  requestedAt?: string | null;
  expiresAt?: string | null;
  approvedBy?: string | null;
  rejectedBy?: string | null;
  createdAt?: string | null;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  confirmedAt?: string | null;
};

export type SelfEnterRequestPayload = {
  name: string;
  email: string;
  password: string;
};

export type SelfEnterRequestEmailConfirmationPayload = {
  code: string;
};

export type SelfEnterInvitation = {
  id?: number | string;
  email: string;
  name?: string | null;
  status?: string | null;
  expiresAt?: string | null;
  confirmedAt?: string | null;
  consumedAt?: string | null;
  requestedAt?: string | null;
  createdAt?: string | null;
};

export type SelfEnterInvitationCompletionPayload = {
  name: string;
  email: string;
  password: string;
};

export type SelfEnterInvitationCreatePayload = {
  email: string;
  name?: string;
};

export type SelfEnterInvitationAdminError =
  | "duplicate_email"
  | "unknown";

export type ApiKeyListItem = {
  publicId: string;
  name: string;
  roleName?: string | null;
  active?: boolean;
  prefix?: string | null;
  masked?: string | null;
  expiresAt?: string | null;
  revokedAt?: string | null;
  lastUsedAt?: string | null;
  createdAt?: string | null;
};

export type ApiKeyCreatePayload = {
  roleName: string;
  name: string;
  expiresDays?: number | null;
};

export type ApiKeyCreateResponse = {
  publicId: string;
  name: string;
  key?: string | null;
  roleName?: string | null;
  expiresAt?: string | null;
  createdAt?: string | null;
};

export type PickListOption = {
  label: string;
  value: string | number;
  disabled?: boolean;
  data?: unknown;
};

export type FormMode = "create" | "edit" | "view";
