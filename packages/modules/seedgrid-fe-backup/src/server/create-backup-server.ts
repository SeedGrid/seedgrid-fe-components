// Helpers server-side de backup, sobre o motor de sessão do fe-security. SERVER-ONLY.
//
//   const session = createSecurityServer({ ... });
//   export const backup = createBackupServer(session);

import type { SecurityServer } from "@seedgrid/fe-security";

import { BackupPaths } from "../paths";
import type { ExportRequest, ExportResponse } from "../backup";

export interface BackupServer {
  /** Cria um export job (POST /exports). */
  createExport(req: ExportRequest): Promise<ExportResponse>;
  /** Lista os export jobs (GET /exports). */
  listExports(): Promise<ExportResponse[]>;
  /** Status de um job — pra polling até DONE (GET /exports/{jobId}). */
  getExportStatus(jobId: string): Promise<ExportResponse>;
  /** Remove um job (DELETE /exports/{jobId}). */
  deleteExport(jobId: string): Promise<void>;
  /**
   * Baixa o zip (GET /exports/{jobId}/download). Devolve o Response CRU — o route
   * handler do app faz o stream pro browser (apiFetchSecurity faria .json()).
   */
  downloadExport(jobId: string): Promise<Response>;
}

export function createBackupServer(session: SecurityServer): BackupServer {
  return {
    createExport: (req) =>
      session.apiFetchSecurity<ExportResponse>(BackupPaths.exports, {
        method: "POST",
        body: JSON.stringify(req),
      }),
    listExports: () =>
      session.apiFetchSecurity<ExportResponse[]>(BackupPaths.exports),
    getExportStatus: (jobId) =>
      session.apiFetchSecurity<ExportResponse>(BackupPaths.byId(jobId)),
    deleteExport: (jobId) =>
      session.apiFetchSecurity<void>(BackupPaths.byId(jobId), {
        method: "DELETE",
      }),
    downloadExport: (jobId) =>
      session.fetchWithSession(BackupPaths.download(jobId)),
  };
}
