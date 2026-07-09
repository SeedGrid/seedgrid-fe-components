// Classificação derivada de ExportStatus (espelha o types.ts.hbs do antigo
// seedgrid-cli/templates/modules/backup). Puro, zero import "@/...". Opera
// sobre o ExportStatus já declarado em backup.ts (não redeclara o tipo).

import type { ExportStatus } from "./backup";

export type ExportStatusGroup = "pending" | "running" | "done" | "failed" | "terminal";

export function classifyExportStatus(status: ExportStatus): ExportStatusGroup {
  switch (status) {
    case "REQUESTED":
    case "QUEUED":
      return "pending";
    case "RUNNING":
      return "running";
    case "DONE":
    case "DONE_NOTIFIED":
      return "done";
    case "FAILED":
      return "failed";
    case "EXPIRED":
    case "CANCELLED":
      return "terminal";
    default:
      return "terminal";
  }
}

export function isExportInProgress(status: ExportStatus): boolean {
  return status === "REQUESTED" || status === "QUEUED" || status === "RUNNING";
}

export function isExportDownloadable(status: ExportStatus): boolean {
  return status === "DONE" || status === "DONE_NOTIFIED";
}
