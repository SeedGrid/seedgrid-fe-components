"use client";

import { SgButton, SgPanel, SgStack } from "@seedgrid/fe-components";

import { useI18n } from "@/i18n";
import { PageFrame, securityConfig } from "@/modules/security";

export default function ForgotPasswordSuccessPage() {
  const { t } = useI18n();

  return (
    <PageFrame
      title={t("security.forgot_password.success_page.title")}
      description={t("security.forgot_password.success_page.description")}
    >
      <SgPanel borderStyle="none" className="mx-auto w-full max-w-xl">
        <SgStack direction="row" justify="center">
          <SgButton
            appearance="solid"
            severity="primary"
            shape="rounded"
            label={t("security.forgot_password.success_page.enter")}
            onClick={() => {
              window.location.assign(securityConfig.routes.login);
            }}
          />
        </SgStack>
      </SgPanel>
    </PageFrame>
  );
}
