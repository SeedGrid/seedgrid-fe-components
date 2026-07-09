"use client";

import { CreditCard, Layers, Sparkles } from "lucide-react";

import type {
  AppShellNavItem,
  AppShellSection,
} from "@/components/layout/app-shell-navigation";
import { useI18n } from "@/i18n";
import { useCrudPermission } from "@/modules/security";

import { billingPlatformConfig } from "./config";

// Seção de navegação do backoffice de planos. Só aparece pra quem pode ler
// planos (PLAN_READ) — mesma convenção de recurso CRUD do fe-security.
export function useBillingPlatformAppShellSections(): AppShellSection[] {
  const { t } = useI18n();
  const planPermissions = useCrudPermission("PLAN");

  if (!planPermissions.canRead) {
    return [];
  }

  const items: AppShellNavItem[] = [
    {
      id: "platform-plans",
      label: t("billing.platform.nav.plans"),
      href: billingPlatformConfig.routes.plans,
      icon: <Layers size={16} />,
      badge: planPermissions.isReadOnly ? t("billing.platform.common.readonly") : undefined,
      order: 10,
    },
    {
      id: "platform-trial",
      label: t("billing.platform.nav.trial"),
      href: billingPlatformConfig.routes.trial,
      icon: <Sparkles size={16} />,
      order: 20,
    },
  ];

  return [
    {
      id: "platform",
      label: t("billing.platform.nav.group"),
      order: 40,
      items: [
        {
          id: "platform-billing",
          label: t("billing.platform.nav.group"),
          icon: <CreditCard size={18} />,
          order: 10,
          children: items,
        },
      ],
    },
  ];
}
