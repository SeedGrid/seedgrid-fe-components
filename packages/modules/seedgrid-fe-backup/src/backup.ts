// DTOs de backup/export (espelham seedgrid-quarkus-ext-backup). Client-safe.
// Modelo de JOB: cria um export → poll do status → baixa o zip quando DONE → deleta.

/** Espelha BackupFormat.java (seedgrid-quarkus-ext-backup) — só 2 valores reais. */
export type BackupFormat = "CSV_ZIP" | "SQL_DUMP_ZIP";

export type ExportScope = "CUSTOM" | "DOMAIN" | "RAW";

export type ExportStatus =
  | "REQUESTED"
  | "QUEUED"
  | "RUNNING"
  | "DONE"
  | "DONE_NOTIFIED"
  | "FAILED"
  | "CANCELLED"
  | "EXPIRED";

/** POST /exports (request). */
export interface ExportRequest {
  format: BackupFormat;
  scope: ExportScope;
  includeAttachments?: boolean;
  /** Opções livres específicas do formato/escopo. */
  options?: Record<string, unknown>;
}

/** Artefato gerado pelo export (arquivo baixável). */
export interface ArtifactInfo {
  id: number;
  type: string;
  filename: string;
  sizeBytes: number;
  sha256: string;
  mimeType?: string;
}

/**
 * Status/resultado de um export job (ExportResponse). `type` (nao `interface`)
 * de proposito: e usado como linha do SgDatatable, cujo generico exige
 * `extends Record<string, unknown>` — um type alias fechado satisfaz isso, uma
 * interface (aberta a merge) nao.
 */
export type ExportResponse = {
  jobId: string;
  status: ExportStatus;
  /** 0..100. */
  progress?: number | null;
  currentStep?: string | null;
  format: BackupFormat;
  scope: ExportScope;
  databaseSchema?: string | null;
  createdAt: string;
  startedAt?: string | null;
  finishedAt?: string | null;
  expiresAt?: string | null;
  errorMessage?: string | null;
  totalSizeBytes?: number | null;
  /** true quando o zip está pronto pra download. */
  downloadable?: boolean;
  artifacts?: ArtifactInfo[];
}
