"use client";

import { CreditCard, FileText, LayoutGrid, Receipt } from "lucide-react";

import type { AppShellSection } from "@/components/layout/app-shell-navigation";
import { useI18n } from "@/i18n";
import { usePermission } from "@/modules/security";

import { billingUserConfig } from "./config";

// Seção de navegação da assinatura do usuário. Gated por BILLING_READ (mesma
// permissão que as telas usam no RouteGuard).
export function useBillingUserAppShellSections(): AppShellSection[] {
  const { t } = useI18n();
  const canRead = usePermission("BILLING_READ");

  if (!canRead) {
    return [];
  }

  return [
    {
      id: "billing",
      label: t("billing.user.nav.group"),
      order: 30,
      items: [
        {
          id: "billing-user",
          label: t("billing.user.nav.group"),
          icon: <CreditCard size={18} />,
          order: 10,
          children: [
            {
              id: "billing-overview",
              label: t("billing.user.nav.overview"),
              href: billingUserConfig.routes.overview,
              icon: <LayoutGrid size={16} />,
              order: 10,
            },
            {
              id: "billing-plans",
              label: t("billing.user.nav.plans"),
              href: billingUserConfig.routes.plans,
              icon: <FileText size={16} />,
              order: 20,
            },
            {
              id: "billing-invoices",
              label: t("billing.user.nav.invoices"),
              href: billingUserConfig.routes.invoices,
              icon: <Receipt size={16} />,
              order: 30,
            },
          ],
        },
      ],
    },
  ];
}
