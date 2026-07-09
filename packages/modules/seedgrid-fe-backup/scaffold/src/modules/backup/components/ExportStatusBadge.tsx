// seedgrid:managed

import { SgBadge } from "@seedgrid/fe-components";

import { useI18n } from "@/i18n";

import type { ExportStatus } from "@seedgrid/fe-backup";
import { classifyExportStatus } from "@seedgrid/fe-backup";

type SgBadgeSeverity =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

function resolveBadgeSeverity(status: ExportStatus): SgBadgeSeverity {
  const group = classifyExportStatus(status);

  switch (group) {
    case "pending":
      return "info";
    case "running":
      return "primary";
    case "done":
      return "success";
    case "failed":
      return "danger";
    case "terminal":
      return "neutral";
    default:
      return "neutral";
  }
}

interface ExportStatusBadgeProps {
  status: ExportStatus;
}

export function ExportStatusBadge({ status }: ExportStatusBadgeProps) {
  const { t } = useI18n();
  const key = `backup.exports.status.${status}` as const;

  return (
    <SgBadge
      value={t(key)}
      severity={resolveBadgeSeverity(status)}
      badgeStyle="soft"
      size="sm"
    />
  );
}
