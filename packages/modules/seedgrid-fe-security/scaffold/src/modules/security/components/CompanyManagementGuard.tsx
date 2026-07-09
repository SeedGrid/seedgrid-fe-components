"use client";

import type { ReactNode } from "react";

import { SgButton } from "@seedgrid/fe-components";
import { useRouter } from "next/navigation";

import { useI18n } from "@/i18n";

import { securityConfig } from "../config";
import { useCompanyManagementEnabledForCurrentHost } from "../host-access";
import { InlineNotice, PageFrame } from "./PageFrame";

export function CompanyManagementGuard({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { t } = useI18n();
  const companiesEnabled = useCompanyManagementEnabledForCurrentHost();

  if (companiesEnabled == null) {
    return (
      <PageFrame
        title={t("security.guard.loading.title")}
        description={t("security.guard.loading.description")}
      >
        <InlineNotice>{t("security.guard.loading.message")}</InlineNotice>
      </PageFrame>
    );
  }

  if (!companiesEnabled) {
    return (
      <PageFrame
        title={t("security.guard.unauthorized.title")}
        description={t("security.guard.unauthorized.description")}
        actions={
          <SgButton
            appearance="outline"
            severity="primary"
            shape="rounded"
            label={t("security.guard.unauthorized.action")}
            onClick={() => {
              router.push(securityConfig.routes.dashboard);
            }}
          />
        }
      >
        <InlineNotice tone="warning">
          {t("security.guard.unauthorized.message")}
        </InlineNotice>
      </PageFrame>
    );
  }

  return <>{children}</>;
}
