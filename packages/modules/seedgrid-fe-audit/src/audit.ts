// DTOs de audit (espelham o Audit Log Controller do report-api). Client-safe.

/** Operações auditadas (AuditOperationEnum). */
export type AuditOperation = "CREATE" | "UPDATE" | "DELETE" | "READ" | "OTHER";

/** Registro de auditoria (schema AuditLog). */
export interface AuditLogEntry {
  id: number;
  entity: string;
  /** AuditOperationEnum; `string` tolera valores futuros. */
  operation: AuditOperation | string;
  description: string | null;
  techOperation: string | null;
  origin: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  /** LocalDateTime ISO. */
  operationDateTime: string;
  userName: string | null;
  /** Estado antes/depois (JSON serializado, pra o diff na tela de detalhe). */
  beforeState: string | null;
  afterState: string | null;
  metadata?: Record<string, string>;
}

/** Filtros do GET /audit-logs (+ page/size quando paginado). */
export interface AuditLogFilters {
  description?: string;
  entity?: string;
  idFrom?: number;
  idTo?: number;
  metaKey?: string;
  metaValue?: string;
  operation?: AuditOperation | string;
  /** LocalDate "yyyy-MM-dd". */
  operationDateFrom?: string;
  operationDateTo?: string;
  userName?: string;
  page?: number;
  size?: number;
}

/** Opção de entidade pro combo de filtro (GET /audit-logs/entities). */
export interface AuditLogEntityOption {
  id: number;
  entity: string;
}

/** Opção de usuário pro combo de filtro (GET /audit-logs/users). */
export interface AuditLogUserOption {
  id: number;
  userName: string;
}
