import type {
  ApiKeyCreatePayload,
  ApiKeyCreateResponse,
  ApiKeyListItem,
  ChangePasswordPayload,
  CompanyMutationPayload,
  CompanySummary,
  DisableTwoFactorPayload,
  EntryRequest,
  PagedResult,
  PermissionSummary,
  RoleMutationPayload,
  RoleSummary,
  SelfEnterInvitation,
  SelfEnterInvitationCompletionPayload,
  SelfEnterInvitationCreatePayload,
  SelfEnterRequestEmailConfirmationPayload,
  SelfEnterRequestPayload,
  SortState,
  TwoFactorEnableResponse,
  TwoFactorStatus,
  UserMutationPayload,
  UserSummary,
} from "../types";
import {
  createPagedResult,
  hasActiveSearch,
  normalizeSearchTerm,
} from "../utils";
import { securityConfig } from "../config";
import {
  extractApiMessage,
  isApiClientError,
  securityApi,
} from "./security-api";

type PageRequest<T> = {
  page?: number;
  size?: number;
  search?: string;
  sort?: SortState;
  path: string;
  searchParamNames?: string[];
  extraQuery?: Record<string, string | number | boolean | null | undefined>;
};

export const securityService = {
  async listUsersPage(request: {
    page?: number;
    size?: number;
    search?: string;
    sort?: SortState;
  }) {
    return loadPage<UserSummary>({
      ...request,
      path: "/users",
      searchParamNames: ["search", "name", "email"],
    });
  },

  async getUser(publicId: string) {
    return securityApi.get<UserSummary>(`/users/${publicId}`, {
      retry: false,
    });
  },

  async createUser(payload: UserMutationPayload) {
    return securityApi.post<UserSummary>("/users", {
      body: payload,
      retry: false,
    });
  },

  async updateUser(publicId: string, payload: Partial<UserMutationPayload>) {
    return securityApi.patch<UserSummary>(`/users/${publicId}`, {
      body: payload,
      retry: false,
    });
  },

  buildUserAvatarUrl(publicId: string, cacheBust?: string | number | null) {
    const normalizedPublicId = publicId.trim();

    if (!normalizedPublicId) {
      return "";
    }

    const baseUrl = `/api/security/users/${encodeURIComponent(normalizedPublicId)}/avatar`;

    if (cacheBust === undefined || cacheBust === null || `${cacheBust}`.trim() === "") {
      return baseUrl;
    }

    return `${baseUrl}?v=${encodeURIComponent(String(cacheBust))}`;
  },

  async fetchUserAvatarObjectUrl(
    publicId: string,
    cacheBust?: string | number | null
  ) {
    const normalizedPublicId = publicId.trim();

    if (!normalizedPublicId || typeof URL === "undefined") {
      return null;
    }

    try {
      const response = await securityApi.get<Response>(
        `/users/${encodeURIComponent(normalizedPublicId)}/avatar`,
        {
          parseAs: "response",
          query:
            cacheBust === undefined ||
            cacheBust === null ||
            `${cacheBust}`.trim() === ""
              ? undefined
              : { v: String(cacheBust) },
          retry: false,
          captureExceptions: false,
        }
      );
      const blob = await response.blob();

      if (!blob.size) {
        return null;
      }

      return URL.createObjectURL(blob);
    } catch {
      return null;
    }
  },

  async uploadUserAvatar(
    publicId: string,
    payload: {
      filename: string;
      contentType: string;
      base64: string;
    }
  ) {
    return securityApi.post<UserSummary>(`/users/${publicId}/avatar`, {
      body: payload,
      retry: false,
    });
  },

  async deleteUser(publicId: string) {
    return securityApi.delete<void>(`/users/${publicId}`, {
      retry: false,
    });
  },

  async listRolesPage(request: {
    page?: number;
    size?: number;
    search?: string;
    sort?: SortState;
  }) {
    return loadPage<RoleSummary>({
      ...request,
      path: "/roles",
      searchParamNames: ["search", "name"],
    });
  },

  async listRoles() {
    return securityApi.get<RoleSummary[]>("/roles", {
      retry: false,
    });
  },

  async getRole(publicId: string) {
    return securityApi.get<RoleSummary>(`/roles/${publicId}`, {
      retry: false,
    });
  },

  async listPermissions() {
    const response = await securityApi.get<unknown>("/permissions", {
      retry: false,
    });

    return normalizeCollectionResponse<PermissionSummary>(response);
  },

  async createRole(payload: RoleMutationPayload) {
    return securityApi.post<RoleSummary>("/roles", {
      body: payload,
      retry: false,
    });
  },

  async updateRole(publicId: string, payload: Partial<RoleMutationPayload>) {
    return securityApi.patch<RoleSummary>(`/roles/${publicId}`, {
      body: payload,
      retry: false,
    });
  },

  async deleteRole(publicId: string) {
    return securityApi.delete<void>(`/roles/${publicId}`, {
      retry: false,
    });
  },

  async listIntegrationRoles() {
    const response = await securityApi.get<unknown>("/roles/integration", {
      retry: false,
    });

    return normalizeCollectionResponse<RoleSummary>(response);
  },

  async listCompaniesPage(request: {
    page?: number;
    size?: number;
    search?: string;
    sort?: SortState;
  }) {
    return loadPage<CompanySummary>({
      ...request,
      path: "/companies",
      searchParamNames: ["search", "tradeName", "corporateName"],
    });
  },

  async listAllCompanies() {
    return securityApi.get<CompanySummary[]>("/companies", {
      retry: false,
    });
  },

  async getCompany(publicId: string) {
    return securityApi.get<CompanySummary>(`/companies/${publicId}`, {
      retry: false,
    });
  },

  async createCompany(payload: CompanyMutationPayload) {
    return securityApi.post<CompanySummary>("/companies", {
      body: payload,
      retry: false,
    });
  },

  async updateCompany(
    publicId: string,
    payload: Partial<CompanyMutationPayload>
  ) {
    return securityApi.patch<CompanySummary>(`/companies/${publicId}`, {
      body: payload,
      retry: false,
    });
  },

  async deleteCompany(publicId: string) {
    return securityApi.delete<void>(`/companies/${publicId}`, {
      retry: false,
    });
  },

  async getTwoFactorStatus() {
    return securityApi.get<TwoFactorStatus>("/2f/status", {
      retry: false,
    });
  },

  async enableTwoFactor(method: string, includeQrImage = true) {
    return securityApi.post<TwoFactorEnableResponse>("/2f/enable", {
      query: {
        includeQrImage,
      },
      body: {
        method,
      },
      retry: false,
    });
  },

  async confirmTotp(code: string) {
    return securityApi.post<TwoFactorEnableResponse>("/2f/totp/confirm", {
      body: {
        code,
      },
      retry: false,
    });
  },

  async disableTwoFactor(payload: DisableTwoFactorPayload) {
    return securityApi.post<{ status?: string }>("/2f/disable", {
      body: payload,
      retry: false,
    });
  },

  async changePassword(payload: ChangePasswordPayload) {
    return securityApi.put<UserSummary>("/users/change-password", {
      body: payload,
      retry: false,
    });
  },

  async createSelfEnterRequest(payload: SelfEnterRequestPayload) {
    return securityApi.public.post<EntryRequest>("/public/self-enter/requests", {
      body: payload,
      retry: false,
    });
  },

  async confirmSelfEnterRequestEmail(
    id: string | number,
    payload: SelfEnterRequestEmailConfirmationPayload
  ) {
    return securityApi.public.post<EntryRequest>(
      `/public/self-enter/requests/${id}/confirm-email`,
      {
        body: payload,
        retry: false,
      }
    );
  },

  async resendSelfEnterRequestEmail(id: string | number) {
    return securityApi.public.post<EntryRequest>(
      `/public/self-enter/requests/${id}/resend-email`,
      {
        retry: false,
      }
    );
  },

  async getSelfEnterInvitation(token: string) {
    return securityApi.public.get<SelfEnterInvitation>(
      `/public/self-enter/invitations/${encodeURIComponent(token)}`,
      {
        retry: false,
      }
    );
  },

  async createSelfEnterInvitation(payload: SelfEnterInvitationCreatePayload) {
    return securityApi.post<EntryRequest>("/self-enter/invitations", {
      body: payload,
      retry: false,
    });
  },

  async listSelfEnterInvitationsPage(request: {
    page?: number;
    size?: number;
    search?: string;
    sort?: SortState;
  }) {
    return loadPage<EntryRequest>({
      ...request,
      path: "/self-enter/invitations",
      searchParamNames: ["search", "name", "email"],
    });
  },

  async resendSelfEnterInvitation(id: string | number) {
    return securityApi.post<{ message?: string; requestId?: string }>(
      `/self-enter/invitations/${id}/resend`,
      {
        retry: false,
      }
    );
  },

  async completeSelfEnterInvitation(
    token: string,
    payload: SelfEnterInvitationCompletionPayload
  ) {
    return securityApi.public.post<EntryRequest>(
      `/public/self-enter/invitations/${encodeURIComponent(token)}/complete`,
      {
        body: payload,
        retry: false,
      }
    );
  },

  async listSelfEnterRequestsPage(request: {
    page?: number;
    size?: number;
    search?: string;
    sort?: SortState;
  }) {
    return loadPage<EntryRequest>({
      ...request,
      path: "/self-enter/requests/to-approve",
      searchParamNames: ["search", "name", "email"],
    });
  },

  async approveSelfEnterRequest(id: string | number) {
    return securityApi.post<{ message?: string }>(
      `/self-enter/requests/${id}/approve`,
      {
        retry: false,
      }
    );
  },

  async rejectSelfEnterRequest(id: string | number) {
    return securityApi.post<{ message?: string }>(
      `/self-enter/requests/${id}/reject`,
      {
        retry: false,
      }
    );
  },

  async listApiKeysPage(request: {
    page?: number;
    size?: number;
    search?: string;
    roleName?: string;
    sort?: SortState;
  }) {
    const normalizedRoleName = request.roleName?.trim();

    if (normalizedRoleName) {
      const response = await securityApi.get<ApiKeyListItem[]>(
        `/apikeys/role/${encodeURIComponent(normalizedRoleName)}`,
        {
          retry: false,
        }
      );

      return normalizePagedResponse<ApiKeyListItem>(
        response,
        request.page,
        request.size
      );
    }

    return loadPage<ApiKeyListItem>({
      ...request,
      path: "/apikeys",
      searchParamNames: ["search", "description", "name"],
    });
  },

  async createApiKey(payload: ApiKeyCreatePayload) {
    return securityApi.post<ApiKeyCreateResponse>(
      `/apikeys/role/${encodeURIComponent(payload.roleName)}`,
      {
        body: {
          name: payload.name,
          expiresDays: payload.expiresDays ?? null,
        },
        retry: false,
      }
    );
  },

  async revokeApiKey(publicId: string) {
    return securityApi.post<{ revoked?: boolean; revokedAt?: string }>(
      `/apikeys/${publicId}/revoke`,
      {
        retry: false,
      }
    );
  },
};

async function loadPage<T>({
  page,
  size,
  search,
  sort,
  path,
  searchParamNames = ["search"],
  extraQuery = {},
}: PageRequest<T>): Promise<PagedResult<T>> {
  const normalizedSearch = normalizeSearchTerm(search ?? "");

  const response = await securityApi.get<unknown>(path, {
    query: buildPagedQuery({
      page,
      size,
      search: normalizedSearch,
      searchParamNames,
      sort,
      extraQuery,
    }),
    retry: false,
    captureExceptions: false,
  });

  return normalizePagedResponse<T>(response, page, size);
}

function buildPagedQuery({
  page,
  size,
  search,
  searchParamNames,
  sort,
  extraQuery,
}: {
  page?: number;
  size?: number;
  search: string;
  searchParamNames: string[];
  sort?: SortState;
  extraQuery: Record<string, string | number | boolean | null | undefined>;
}) {
  const shouldPaginate =
    typeof page === "number" &&
    Number.isFinite(page) &&
    typeof size === "number" &&
    Number.isFinite(size);

  return {
    page: shouldPaginate ? page : undefined,
    size: shouldPaginate ? size : undefined,
    sortField: sort?.sortField ?? undefined,
    sortOrder: sort?.sortOrder ?? undefined,
    ...buildSearchQuery(search, searchParamNames),
    ...extraQuery,
  };
}

function buildSearchQuery(search: string, searchParamNames: string[]) {
  if (!hasActiveSearch(search)) {
    return {};
  }

  return searchParamNames.reduce<Record<string, string>>((query, paramName) => {
    query[paramName] = search;
    return query;
  }, {});
}

function normalizePagedResponse<T>(
  value: unknown,
  fallbackPage?: number,
  fallbackSize?: number
): PagedResult<T> {
  const emptyPage =
    typeof fallbackPage === "number" && Number.isFinite(fallbackPage)
      ? fallbackPage
      : 0;
  const emptySize =
    typeof fallbackSize === "number" && Number.isFinite(fallbackSize)
      ? fallbackSize
      : 0;

  if (!value || typeof value !== "object") {
    return createPagedResult([], 0, emptyPage, emptySize);
  }

  const items = normalizeCollectionResponse<T>(value);

  if (Array.isArray(value)) {
    return createPagedResult(items, items.length, emptyPage, items.length);
  }

  const record = value as Record<string, unknown>;
  const total =
    typeof record.total === "number" && Number.isFinite(record.total)
      ? record.total
      : items.length;
  const page =
    typeof record.page === "number" && Number.isFinite(record.page)
      ? record.page
      : emptyPage;
  const size =
    typeof record.size === "number" && Number.isFinite(record.size)
      ? record.size
      : typeof fallbackSize === "number" && Number.isFinite(fallbackSize)
        ? fallbackSize
        : items.length;

  return createPagedResult(items, total, page, size);
}

function normalizeCollectionResponse<T>(value: unknown) {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (Array.isArray(record.items)) {
      return record.items as T[];
    }
  }

  return [] as T[];
}

const SELF_ENTER_INVITATION_CONSUMED_PATTERNS = [
  "already used",
  "already been used",
  "already consumed",
  "consumed",
  "ja foi usado",
  "ja utilizada",
  "ja utilizado",
  "consumido",
  "consumida",
  "ya fue usado",
  "ya ha sido usado",
  "consumido",
  "utilise",
  "deja utilise",
];

const SELF_ENTER_INVITATION_INVALID_PATTERNS = [
  "invalid",
  "expired",
  "not found",
  "unknown invitation",
  "invalido",
  "invalida",
  "expirado",
  "expirada",
  "nao encontrado",
  "nao encontrada",
  "nao existe",
  "no encontrado",
  "no encontrada",
  "expiro",
  "expire",
  "introuvable",
];

const SELF_ENTER_INVITATION_EMAIL_MISMATCH_PATTERNS = [
  "email does not match",
  "email mismatch",
  "email must match",
  "email diferente",
  "email diverge",
  "email nao corresponde",
  "email no coincide",
  "correo no coincide",
];

const SELF_ENTER_INVITATION_ADMIN_DUPLICATE_PATTERNS = [
  "already exists",
  "active entry request already exists",
  "usuario ja existe",
  "recurso ja existe",
  "ja existe uma solicitacao ativa",
  "ja existe um usuario",
];

export function classifySelfEnterInvitationError(error: unknown) {
  if (isApiClientError(error)) {
    if (error.status === 409) {
      return "consumed" as const;
    }

    if (error.status === 404 || error.status === 410) {
      return "invalid" as const;
    }
  }

  const normalizedMessage = normalizeComparableMessage(extractApiMessage(error));

  if (!normalizedMessage) {
    return "unknown" as const;
  }

  if (includesAnyPattern(normalizedMessage, SELF_ENTER_INVITATION_CONSUMED_PATTERNS)) {
    return "consumed" as const;
  }

  if (includesAnyPattern(normalizedMessage, SELF_ENTER_INVITATION_INVALID_PATTERNS)) {
    return "invalid" as const;
  }

  return "unknown" as const;
}

export function isSelfEnterInvitationEmailMismatchError(error: unknown) {
  const normalizedMessage = normalizeComparableMessage(extractApiMessage(error));

  return (
    normalizedMessage !== null &&
    includesAnyPattern(
      normalizedMessage,
      SELF_ENTER_INVITATION_EMAIL_MISMATCH_PATTERNS
    )
  );
}

export function classifySelfEnterInvitationAdminError(error: unknown) {
  if (isApiClientError(error) && error.status === 409) {
    return "duplicate_email" as const;
  }

  const normalizedMessage = normalizeComparableMessage(extractApiMessage(error));

  if (
    normalizedMessage !== null &&
    includesAnyPattern(
      normalizedMessage,
      SELF_ENTER_INVITATION_ADMIN_DUPLICATE_PATTERNS
    )
  ) {
    return "duplicate_email" as const;
  }

  return "unknown" as const;
}

function normalizeComparableMessage(message: string | null) {
  if (!message) {
    return null;
  }

  return message
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

function includesAnyPattern(message: string, patterns: string[]) {
  return patterns.some((pattern) => message.includes(pattern));
}
