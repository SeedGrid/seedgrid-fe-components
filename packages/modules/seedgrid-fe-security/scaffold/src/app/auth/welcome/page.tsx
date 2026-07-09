"use client";

import { useEffect, useState } from "react";

import { SgButton, SgPanel, SgStack } from "@seedgrid/fe-components";
import { useSearchParams } from "next/navigation";

import { useI18n } from "@/i18n";
import {
  InlineNotice,
  PageFrame,
  authService,
  extractApiMessage,
  securityConfig,
} from "@/modules/security";

export default function WelcomePage() {
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const [confirmed, setConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token")?.trim();

    if (!token) {
      setErrorMessage(t("security.welcome.invalid_token"));
      return;
    }

    let active = true;

    void (async () => {
      try {
        await authService.confirmEmail(token);

        if (!active) {
          return;
        }

        setConfirmed(true);
      } catch (error) {
        if (!active) {
          return;
        }

        setErrorMessage(
          extractApiMessage(error) ?? t("security.welcome.error")
        );
      }
    })();

    return () => {
      active = false;
    };
  }, [searchParams, t]);

  return (
    <PageFrame
      title={t("security.welcome.title")}
      description={t("security.welcome.description")}
    >
      <SgPanel borderStyle="none" className="mx-auto w-full max-w-xl">
        <SgStack gap={16}>
        {errorMessage ? (
          <InlineNotice tone="danger">{errorMessage}</InlineNotice>
        ) : confirmed ? (
          <InlineNotice tone="success">{t("security.welcome.success")}</InlineNotice>
        ) : (
          <InlineNotice>{t("security.welcome.loading")}</InlineNotice>
        )}

        {(confirmed || errorMessage) ? (
          <SgStack direction="row" justify="center">
            <SgButton
              appearance="solid"
              severity="primary"
              shape="rounded"
              label={t("security.welcome.enter")}
              onClick={() => {
                window.location.assign(securityConfig.routes.login);
              }}
            />
          </SgStack>
        ) : null}
        </SgStack>
      </SgPanel>
    </PageFrame>
  );
}
