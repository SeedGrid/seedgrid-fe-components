"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import { SgButton } from "@seedgrid/fe-components";
import { usePathname, useRouter } from "next/navigation";

import { useI18n } from "@/i18n";

import { securityConfig } from "../config";
import { useAuth } from "../hooks/useAuth";
import { InlineNotice, PageFrame } from "./PageFrame";

type RouteGuardProps = {
  children: ReactNode;
  permissions?: string[];
  permissionMode?: "all" | "any";
};

export function RouteGuard({
  children,
  permissions,
  permissionMode = "all",
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isInitializing && !auth.isAuthenticated) {
      router.replace(securityConfig.routes.login);
      return;
    }

    if (
      !auth.isInitializing &&
      auth.isAuthenticated &&
      auth.session?.changePasswordRequired &&
      pathname !== securityConfig.routes.changePassword
    ) {
      router.replace(securityConfig.routes.changePassword);
    }
  }, [auth.isAuthenticated, auth.isInitializing, auth.session?.changePasswordRequired, pathname, router]);

  if (auth.isInitializing) {
    return (
      <PageFrame
        title={t("security.guard.loading.title")}
        description={t("security.guard.loading.description")}
      >
        <InlineNotice>{t("security.guard.loading.message")}</InlineNotice>
      </PageFrame>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <PageFrame
        title={t("security.guard.redirecting.title")}
        description={t("security.guard.redirecting.description")}
      >
        <InlineNotice>{t("security.guard.redirecting.message")}</InlineNotice>
      </PageFrame>
    );
  }

  if (
    auth.session?.changePasswordRequired &&
    pathname !== securityConfig.routes.changePassword
  ) {
    return (
      <PageFrame
        title={t("security.guard.redirecting.title")}
        description={t("security.guard.redirecting.description")}
      >
        <InlineNotice>{t("security.guard.redirecting.message")}</InlineNotice>
      </PageFrame>
    );
  }

  const isAllowed = !permissions?.length
    ? true
    : permissionMode === "any"
      ? auth.hasAnyPermission(permissions)
      : auth.hasAllPermissions(permissions);

  if (!isAllowed) {
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
              router.push(securityConfig.routes.login);
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
