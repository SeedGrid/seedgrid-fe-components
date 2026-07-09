// Paths do Audit Log Controller (report-api). Contrato único front/back.

const seg = (value: string): string => encodeURIComponent(value);

export const AuditPaths = {
  /** GET — lista/paginação de logs (aceita os filtros de AuditLogFilters via query). */
  logs: "/audit-logs",
  /** GET — entidades distintas (combo de filtro). */
  entities: "/audit-logs/entities",
  /** GET — usuários distintos (combo de filtro). */
  users: "/audit-logs/users",
  /** GET — log por id. */
  byId: (id: number | string) => `/audit-logs/${seg(String(id))}`,
} as const;
