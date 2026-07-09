"use client";

import { useEffect, useState } from "react";

import { SgButton, SgPanel, SgStack } from "@seedgrid/fe-components";
import { useRouter, useSearchParams } from "next/navigation";

import { useI18n } from "@/i18n";
import {
  InlineNotice,
  PageFrame,
  authService,
  extractApiMessage,
  securityConfig,
} from "@/modules/security";

export default function ForgotPasswordConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token")?.trim();

    if (!token) {
      setErrorMessage(t("security.forgot_password.confirm.invalid_token"));
      return;
    }

    let active = true;

    void (async () => {
      try {
        await authService.confirmPasswordReset(token);

        if (!active) {
          return;
        }

        router.replace(securityConfig.routes.forgotPasswordSuccess);
      } catch (error) {
        if (!active) {
          return;
        }

        setErrorMessage(
          extractApiMessage(error) ?? t("security.forgot_password.confirm.error")
        );
      }
    })();

    return () => {
      active = false;
    };
  }, [router, searchParams, t]);

  return (
    <PageFrame
      title={t("security.forgot_password.confirm.title")}
      description={t("security.forgot_password.confirm.description")}
    >
      {errorMessage ? (
        <SgPanel borderStyle="none" className="mx-auto w-full max-w-xl">
          <SgStack gap={16}>
          <InlineNotice tone="danger">{errorMessage}</InlineNotice>
          <SgStack direction="row" wrap gap={12}>
            <SgButton
              appearance="solid"
              severity="primary"
              shape="rounded"
              label={t("security.forgot_password.confirm.request_new")}
              onClick={() => {
                window.location.assign(securityConfig.routes.forgotPassword);
              }}
            />
            <SgButton
              appearance="outline"
              severity="secondary"
              shape="rounded"
              label={t("security.forgot_password.success_page.enter")}
              onClick={() => {
                window.location.assign(securityConfig.routes.login);
              }}
            />
          </SgStack>
          </SgStack>
        </SgPanel>
      ) : (
        <SgPanel borderStyle="none" className="mx-auto w-full max-w-xl">
          <InlineNotice>{t("security.forgot_password.confirm.loading")}</InlineNotice>
        </SgPanel>
      )}
    </PageFrame>
  );
}
