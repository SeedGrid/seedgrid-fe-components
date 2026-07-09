// DTOs de API keys (espelham seedgrid-quarkus-ext-apikeys). Client-safe.
// Chaves são criadas por ROLE; o segredo completo só aparece UMA vez, na criação.

/** POST /apikeys/role/{roleName} (request). */
export interface ApiKeyCreateRequest {
  name: string;
  /** Validade em dias; ausente = sem expiração. */
  expiresDays?: number;
}

/** Resposta da CRIAÇÃO — única vez que `apiKey` (segredo cru) é exposto. */
export interface ApiKeyCreateResponse {
  publicId: string;
  name: string;
  prefix: string;
  masked: string;
  /** Segredo completo — mostre uma vez e não persista no front. */
  apiKey: string;
  expiresAt: string | null;
  createdAt: string;
}

/** Item de listagem (nunca traz o segredo; só prefix/masked). */
export interface ApiKeyListItem {
  publicId: string;
  name: string;
  prefix: string;
  masked: string;
  roleName: string;
  expiresAt: string | null;
  revokedAt: string | null;
  lastUsedAt: string | null;
  createdAt: string;
}

/** POST /apikeys/{publicId}/revoke (response). */
export interface ApiKeyRevokeResponse {
  publicId: string;
  revokedAt: string;
}
