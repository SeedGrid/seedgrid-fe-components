"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  SgButton,
  SgConfirmationDialog,
  SgDatatable,
  SgStack,
  sgWhistle,
} from "@seedgrid/fe-components";
import { Download, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/i18n";
import { PageFrame, RouteGuard } from "@/modules/security";

import { backupConfig } from "@/modules/backup/config";
import { ExportStatusBadge } from "@/modules/backup/components/ExportStatusBadge";
import { extractBackupApiMessage } from "@/modules/backup/services/backup-api";
import { backupService } from "@/modules/backup/services/backup-service";
import { isExportDownloadable, isExportInProgress } from "@seedgrid/fe-backup";
import type { ExportResponse } from "@/modules/backup/types";

export default function ExportsListPage() {
  return (
    <RouteGuard permissions={["JOB_READ"]}>
      <ExportsListScreen />
    </RouteGuard>
  );
}

function ExportsListScreen() {
  const router = useRouter();
  const { t } = useI18n();

  const [exports, setExports] = useState<ExportResponse[]>([]);
  const [page, setPage] = useState(0);
  // <number>: defaultPageSize e literal, sem anotacao o setRows(number)
  // falharia (TS2345 SetStateAction<literal>).
  const [rows, setRows] = useState<number>(backupConfig.pagination.defaultPageSize);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<ExportResponse | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadExports = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);

      try {
        const data = await backupService.listExportJobs({ page, size: rows });
        setExports(data);
      } catch (error) {
        if (!silent) {
          sgWhistle.error({
            message:
              extractBackupApiMessage(error) ??
              t("backup.exports.list.load_error"),
          });
        }
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [page, rows, t]
  );

  useEffect(() => {
    void loadExports();
  }, [loadExports]);

  // Poll while any job is in progress
  useEffect(() => {
    const hasInProgress = exports.some((e) => isExportInProgress(e.status));

    if (hasInProgress) {
      pollingRef.current = setInterval(() => {
        void loadExports(true);
      }, backupConfig.polling.intervalMs);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [exports, loadExports]);

  async function handleDownload(job: ExportResponse) {
    setDownloadingId(job.jobId);

    try {
      const downloadUrl = `/api/backup/exports/${encodeURIComponent(job.jobId)}/download`;
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = "";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } catch (error) {
      sgWhistle.error({
        message:
          extractBackupApiMessage(error) ??
          t("backup.exports.list.download_error"),
      });
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleDelete() {
    if (!selectedJob) return;

    try {
      await backupService.deleteExportJob(selectedJob.jobId);
      sgWhistle.success({ message: t("backup.exports.list.delete_success") });
      setSelectedJob(null);
      await loadExports();
    } catch (error) {
      sgWhistle.error({
        message:
          extractBackupApiMessage(error) ??
          t("backup.exports.list.delete_error"),
      });
    }
  }

  function formatBytes(bytes?: number | null) {
    if (bytes == null) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return "-";
    try {
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  }

  const columns = useMemo(
    () => [
      {
        field: "jobId",
        header: t("backup.exports.list.column.job_id"),
        body: (row: ExportResponse) => (
          <span className="font-mono text-xs text-slate-500">
            {row.jobId.slice(0, 8)}…
          </span>
        ),
      },
      {
        field: "format",
        header: t("backup.exports.list.column.format"),
        body: (row: ExportResponse) =>
          t(`backup.exports.format.${row.format}`),
      },
      {
        field: "scope",
        header: t("backup.exports.list.column.scope"),
        body: (row: ExportResponse) =>
          t(`backup.exports.scope.${row.scope}`),
      },
      {
        field: "status",
        header: t("backup.exports.list.column.status"),
        body: (row: ExportResponse) => (
          <SgStack direction="row" gap={8} align="center">
            <ExportStatusBadge status={row.status} />
            {isExportInProgress(row.status) && row.progress != null ? (
              <span className="text-xs text-slate-500">{row.progress}%</span>
            ) : null}
          </SgStack>
        ),
      },
      {
        field: "createdAt",
        header: t("backup.exports.list.column.created_at"),
        body: (row: ExportResponse) => formatDate(row.createdAt),
      },
      {
        field: "totalSizeBytes",
        header: t("backup.exports.list.column.size"),
        body: (row: ExportResponse) => formatBytes(row.totalSizeBytes),
      },
      {
        header: t("backup.common.actions"),
        body: (row: ExportResponse) => (
          <SgStack direction="row" gap={8} wrap data-sg-stop-row-select="true">
            {isExportDownloadable(row.status) ? (
              <SgButton
                appearance="ghost"
                severity="success"
                iconOnly
                leftIcon={<Download size={16} />}
                title={t("backup.exports.list.action.download")}
                aria-label={t("backup.exports.list.action.download")}
                loading={downloadingId === row.jobId}
                onClick={() => void handleDownload(row)}
                className="border border-emerald-200/80 bg-emerald-50/45 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
              />
            ) : null}
            <SgButton
              appearance="ghost"
              severity="danger"
              iconOnly
              leftIcon={<Trash2 size={16} />}
              title={
                isExportInProgress(row.status)
                  ? t("backup.exports.list.action.cancel")
                  : t("backup.exports.list.action.delete")
              }
              aria-label={t("backup.exports.list.action.delete")}
              onClick={() => setSelectedJob(row)}
              className="border border-rose-200/80 bg-rose-50/45 text-rose-600 hover:border-rose-200 hover:bg-rose-50/70 hover:text-rose-700"
            />
          </SgStack>
        ),
      },
    ],
    [t, downloadingId]
  );

  return (
    <PageFrame
      title={t("backup.exports.list.title")}
      description={t("backup.exports.list.description")}
      actions={
        <SgStack direction="row" gap={8}>
          <SgButton
            appearance="ghost"
            severity="secondary"
            label={t("backup.common.refresh")}
            onClick={() => void loadExports()}
            disabled={loading}
          />
          <SgButton
            appearance="solid"
            severity="primary"
            shape="rounded"
            leftIcon={<Plus size={16} />}
            label={t("backup.exports.list.new")}
            onClick={() => router.push(backupConfig.routes.newExport)}
          />
        </SgStack>
      }
    >
      <SgStack gap={16}>
        <SgDatatable<ExportResponse>
          title=" "
          value={exports}
          columns={columns}
          dataKey="jobId"
          lazy
          paginator
          rows={rows}
          first={page * rows}
          loading={loading}
          emptyMessage={t("backup.exports.list.empty")}
          onPage={(event) => {
            setRows(event.rows ?? backupConfig.pagination.defaultPageSize);
            setPage(event.page ?? 0);
          }}
        />
      </SgStack>

      <SgConfirmationDialog
        open={Boolean(selectedJob)}
        severity="danger"
        title={t("backup.exports.list.delete_title")}
        message={t("backup.exports.list.delete_message")}
        onCancel={() => setSelectedJob(null)}
        onConfirm={() => void handleDelete()}
      />
    </PageFrame>
  );
}
