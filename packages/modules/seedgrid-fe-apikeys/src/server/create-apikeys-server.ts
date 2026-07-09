// Helpers server-side de API keys, sobre o motor de sessão do fe-security. SERVER-ONLY.
//
//   const session = createSecurityServer({ ... });
//   export const apiKeys = createApiKeysServer(session);

import type { SecurityServer } from "@seedgrid/fe-security";

import { ApiKeyPaths } from "../paths";
import type {
  ApiKeyCreateRequest,
  ApiKeyCreateResponse,
  ApiKeyListItem,
  ApiKeyRevokeResponse,
} from "../apikeys";

export interface ApiKeysServer {
  /** Cria uma chave para a role — resposta traz o segredo cru (uma vez). */
  createForRole(
    roleName: string,
    req: ApiKeyCreateRequest,
  ): Promise<ApiKeyCreateResponse>;
  /** Lista as chaves de uma role. */
  listByRole(roleName: string): Promise<ApiKeyListItem[]>;
  /** Lista as chaves do usuário corrente. */
  listMine(): Promise<ApiKeyListItem[]>;
  /** Revoga uma chave. */
  revoke(publicId: string): Promise<ApiKeyRevokeResponse>;
}

export function createApiKeysServer(session: SecurityServer): ApiKeysServer {
  const P = ApiKeyPaths;
  return {
    createForRole: (roleName, req) =>
      session.apiFetchSecurity<ApiKeyCreateResponse>(P.byRole(roleName), {
        method: "POST",
        body: JSON.stringify(req),
      }),
    listByRole: (roleName) =>
      session.apiFetchSecurity<ApiKeyListItem[]>(P.byRole(roleName)),
    listMine: () => session.apiFetchSecurity<ApiKeyListItem[]>(P.base),
    revoke: (publicId) =>
      session.apiFetchSecurity<ApiKeyRevokeResponse>(P.revoke(publicId), {
        method: "POST",
      }),
  };
}
