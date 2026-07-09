// Helpers server-side de audit, sobre o motor de sessão do fe-security. SERVER-ONLY
// (roda em action/route). Só leitura — audit não muta nada.
//
//   const session = createSecurityServer({ ... });
//   export const audit = createAuditServer(session);

import type { PaginatedResult, SecurityServer } from "@seedgrid/fe-security";

import { AuditPaths } from "../paths";
import type {
  AuditLogEntry,
  AuditLogEntityOption,
  AuditLogFilters,
  AuditLogUserOption,
} from "../audit";

function buildQuery(filters: AuditLogFilters): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export interface AuditServer {
  /** Busca paginada de logs (passe page/size). Filtros viram query string. */
  searchLogs(
    filters?: AuditLogFilters,
  ): Promise<PaginatedResult<AuditLogEntry>>;
  /** Entidades distintas pro combo de filtro. */
  listEntities(): Promise<AuditLogEntityOption[]>;
  /** Usuários distintos pro combo de filtro. */
  listUsers(): Promise<AuditLogUserOption[]>;
  /** Log por id (detalhe before/after). */
  getById(id: number | string): Promise<AuditLogEntry>;
}

export function createAuditServer(session: SecurityServer): AuditServer {
  return {
    searchLogs: (filters = {}) =>
      session.apiFetchSecurity<PaginatedResult<AuditLogEntry>>(
        `${AuditPaths.logs}${buildQuery(filters)}`,
      ),
    listEntities: () =>
      session.apiFetchSecurity<AuditLogEntityOption[]>(AuditPaths.entities),
    listUsers: () =>
      session.apiFetchSecurity<AuditLogUserOption[]>(AuditPaths.users),
    getById: (id) =>
      session.apiFetchSecurity<AuditLogEntry>(AuditPaths.byId(id)),
  };
}
