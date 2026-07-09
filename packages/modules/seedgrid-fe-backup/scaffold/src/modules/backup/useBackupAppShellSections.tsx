"use client";

import { Database } from "lucide-react";

import type {
  AppShellNavItem,
  AppShellSection,
} from "@/components/layout/app-shell-navigation";
import { useI18n } from "@/i18n";
import { usePermission } from "@/modules/security";

import { backupConfig } from "./config";

export function useBackupAppShellSections(): AppShellSection[] {
  const { t } = useI18n();
  const canReadJobs = usePermission("JOB_READ");

  const items: AppShellNavItem[] = [];

  if (canReadJobs) {
    items.push({
      id: "backup-exports",
      label: t("backup.exports.list.title"),
      href: backupConfig.routes.exports,
      icon: <Database size={16} />,
      order: 10,
    });
  }

  if (!items.length) {
    return [];
  }

  return [
    {
      id: "backup",
      label: t("backup.common.module_name"),
      order: 50,
      items: [
        {
          id: "backup-management",
          label: t("backup.common.module_name"),
          icon: <Database size={18} />,
          order: 10,
          children: items,
        },
      ],
    },
  ];
}
