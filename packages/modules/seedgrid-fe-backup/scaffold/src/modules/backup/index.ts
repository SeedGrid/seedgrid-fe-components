// seedgrid:managed

export { backupConfig } from "./config";
export { useBackupAppShellSections } from "./useBackupAppShellSections";
export { configureBackupApi, extractBackupApiMessage, isApiClientError } from "./services/backup-api";
export { backupService } from "./services/backup-service";
export { ExportStatusBadge } from "./components/ExportStatusBadge";
export type { ArtifactInfo, BackupFormat, ExportRequest, ExportResponse, ExportScope } from "./types";

// Promovidos pra lib versionada (@seedgrid/fe-backup) — ver ADR 0004/0005 e
// scaffold/README.md pro critério lib vs scaffold usado nesta extração.
export {
  backupMessages,
  classifyExportStatus,
  isExportDownloadable,
  isExportInProgress,
  type ExportStatus,
  type ExportStatusGroup,
} from "@seedgrid/fe-backup";
