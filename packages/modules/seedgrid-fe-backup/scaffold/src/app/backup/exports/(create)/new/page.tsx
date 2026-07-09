"use client";

import { useState } from "react";

import {
  SgButton,
  SgRadioGroup,
  SgStack,
  SgToggleSwitch,
  sgWhistle,
} from "@seedgrid/fe-components";
import { useRouter } from "next/navigation";

import { useI18n } from "@/i18n";
import { PageFrame, RouteGuard } from "@/modules/security";

import { backupConfig } from "@/modules/backup/config";
import { extractBackupApiMessage } from "@/modules/backup/services/backup-api";
import { backupService } from "@/modules/backup/services/backup-service";
import type { BackupFormat, ExportRequest, ExportScope } from "@/modules/backup/types";

// `as const` (em vez de `: Array<{ labelKey: string }>`): mantem labelKey/hintKey
// como literais, que sao chaves validas de i18n — t() so aceita a uniao de
// chaves conhecidas, entao um `string` alargado seria recusado (TS2345).
const FORMAT_OPTIONS = [
  {
    value: "CSV_ZIP",
    labelKey: "backup.exports.create.format_csv_zip",
    hintKey: "backup.exports.create.format_csv_zip_hint",
  },
  {
    value: "SQL_DUMP_ZIP",
    labelKey: "backup.exports.create.format_sql_dump_zip",
    hintKey: "backup.exports.create.format_sql_dump_zip_hint",
  },
] as const;

const SCOPE_OPTIONS = [
  {
    value: "DOMAIN",
    labelKey: "backup.exports.create.scope_domain",
    hintKey: "backup.exports.create.scope_domain_hint",
  },
  {
    value: "RAW",
    labelKey: "backup.exports.create.scope_raw",
    hintKey: "backup.exports.create.scope_raw_hint",
  },
  {
    value: "CUSTOM",
    labelKey: "backup.exports.create.scope_custom",
    hintKey: "backup.exports.create.scope_custom_hint",
  },
] as const;

export default function NewExportPage() {
  return (
    <RouteGuard permissions={["JOB_CREATE"]}>
      <NewExportScreen />
    </RouteGuard>
  );
}

function NewExportScreen() {
  const router = useRouter();
  const { t } = useI18n();

  const [format, setFormat] = useState<BackupFormat>("CSV_ZIP");
  const [scope, setScope] = useState<ExportScope>("DOMAIN");
  const [includeAttachments, setIncludeAttachments] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const formatRadioSource = FORMAT_OPTIONS.map((opt) => ({
    label: t(opt.labelKey),
    value: opt.value,
    description: t(opt.hintKey),
  }));

  const scopeRadioSource = SCOPE_OPTIONS.map((opt) => ({
    label: t(opt.labelKey),
    value: opt.value,
    description: t(opt.hintKey),
  }));

  async function handleSubmit() {
    setSubmitting(true);

    const request: ExportRequest = {
      format,
      scope,
      includeAttachments,
    };

    try {
      await backupService.createExportJob(request);
      sgWhistle.success({ message: t("backup.exports.create.success") });
      router.push(backupConfig.routes.exports);
    } catch (error) {
      sgWhistle.error({
        message:
          extractBackupApiMessage(error) ?? t("backup.exports.create.error"),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageFrame
      title={t("backup.exports.create.title")}
      description={t("backup.exports.create.description")}
      actions={
        <SgStack direction="row" gap={12}>
          <SgButton
            appearance="ghost"
            severity="secondary"
            label={t("backup.common.cancel")}
            onClick={() => router.push(backupConfig.routes.exports)}
            disabled={submitting}
          />
          <SgButton
            appearance="solid"
            severity="primary"
            shape="rounded"
            label={t("backup.exports.create.submit")}
            loading={submitting}
            onClick={() => void handleSubmit()}
          />
        </SgStack>
      }
    >
      <div className="max-w-2xl">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <SgStack gap={24}>
            <SgRadioGroup
              title={t("backup.exports.create.format_label")}
              source={formatRadioSource}
              value={format}
              orientation="vertical"
              selectionStyle="highlight"
              onChange={(val) => setFormat(val as BackupFormat)}
            />

            <hr className="border-slate-100" />

            <SgRadioGroup
              title={t("backup.exports.create.scope_label")}
              source={scopeRadioSource}
              value={scope}
              orientation="vertical"
              selectionStyle="highlight"
              onChange={(val) => setScope(val as ExportScope)}
            />

            <hr className="border-slate-100" />

            <SgToggleSwitch
              id="backup-include-attachments"
              label={t("backup.exports.create.attachments_label")}
              checked={includeAttachments}
              onChange={setIncludeAttachments}
            />
          </SgStack>
        </div>
      </div>
    </PageFrame>
  );
}
