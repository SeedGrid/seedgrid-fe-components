"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  SgButton,
  SgCombobox,
  SgGrid,
  SgInputPassword,
  SgInputText,
  SgPanel,
  SgStack,
  sgWhistle,
} from "@seedgrid/fe-components";

import { useI18n } from "@/i18n";
import {
  InlineNotice,
  PageFrame,
  RouteGuard,
  StatusBadge,
  extractApiMessage,
  securityService,
  type TwoFactorEnableResponse,
  type TwoFactorStatus,
} from "@/modules/security";

export default function TwoFactorSettingsPage() {
  return (
    <RouteGuard>
      <TwoFactorSettingsScreen />
    </RouteGuard>
  );
}

type TwoFactorSettingsFormValues = {
  totpCode: string;
  disableTwoFactorCode: string;
  disablePassword: string;
  backupCode: string;
};

function TwoFactorSettingsScreen() {
  const { t } = useI18n();
  const [status, setStatus] = useState<TwoFactorStatus | null>(null);
  const [enableResponse, setEnableResponse] =
    useState<TwoFactorEnableResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("EMAIL");
  const { getValues, register, resetField } = useForm<TwoFactorSettingsFormValues>({
    defaultValues: {
      totpCode: "",
      disableTwoFactorCode: "",
      disablePassword: "",
      backupCode: "",
    },
  });
  const disablePasswordInputProps = {
    autoComplete: "current-password",
  };

  useEffect(() => {
    void loadStatus();
  }, []);

  async function loadStatus() {
    setLoading(true);

    try {
      const nextStatus = await securityService.getTwoFactorStatus();
      setStatus(nextStatus);
      setSelectedMethod(nextStatus.availableMethods[0] ?? "EMAIL");
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t("security.two_factor.error"),
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleEnable() {
    setPending(true);

    try {
      const response = await securityService.enableTwoFactor(selectedMethod, true);
      setEnableResponse(response);

      if (response.backupCodes?.length && selectedMethod !== "TOTP") {
        sgWhistle.success({ message: t("security.two_factor.success_enable") });
        await loadStatus();
      }
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t("security.two_factor.error"),
      });
    } finally {
      setPending(false);
    }
  }

  async function handleConfirmTotp() {
    setPending(true);

    try {
      const response = await securityService.confirmTotp(getValues("totpCode").trim());
      setEnableResponse(response);
      sgWhistle.success({ message: t("security.two_factor.success_confirm") });
      resetField("totpCode");
      await loadStatus();
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t("security.two_factor.error"),
      });
    } finally {
      setPending(false);
    }
  }

  async function handleDisable() {
    const requiresTotpCode = status?.primaryMethod === "TOTP";
    const disablePassword = getValues("disablePassword");
    const backupCode = getValues("backupCode");
    const disableTwoFactorCode = getValues("disableTwoFactorCode");

    if (
      !disablePassword.trim() &&
      !backupCode.trim() &&
      (!requiresTotpCode || !disableTwoFactorCode.trim())
    ) {
      sgWhistle.error({
        message: t(
          requiresTotpCode
            ? "security.two_factor.disable_validation_totp"
            : "security.two_factor.disable_validation"
        ),
      });
      return;
    }

    setPending(true);

    try {
      await securityService.disableTwoFactor({
        twoFactorCode: disableTwoFactorCode.trim() || undefined,
        password: disablePassword.trim() || undefined,
        backupCode: backupCode.trim() || undefined,
      });
      sgWhistle.success({ message: t("security.two_factor.success_disable") });
      resetField("disableTwoFactorCode");
      resetField("disablePassword");
      resetField("backupCode");
      setEnableResponse(null);
      await loadStatus();
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t("security.two_factor.error"),
      });
    } finally {
      setPending(false);
    }
  }

  function handleDownloadBackupCodesCsv() {
    const backupCodes = enableResponse?.backupCodes ?? [];

    if (!backupCodes.length || typeof window === "undefined") {
      return;
    }

    const csvContent = ["code", ...backupCodes].join("\n");
    const csvBlob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const downloadUrl = window.URL.createObjectURL(csvBlob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");

    link.href = downloadUrl;
    link.download = `seedgrid-2fa-backup-codes-${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  return (
    <PageFrame
      title={t("security.two_factor.title")}
      description={t("security.two_factor.description")}
    >
      {loading ? (
        <InlineNotice>{t("security.common.loading")}</InlineNotice>
      ) : status ? (
        <SgStack gap={16}>
          <SgGrid minItemWidth={320} gap={16}>
            <InlineNotice>
              <SgStack gap={12}>
                <div className="font-medium">{t("security.two_factor.status")}</div>
                <StatusBadge
                  active={status.enabled}
                  activeLabel={t("security.common.enabled")}
                  inactiveLabel={t("security.common.disabled")}
                />
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    {t("security.two_factor.primary_method")}
                  </div>
                  <div>{status.primaryMethod ?? "-"}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    {t("security.two_factor.available_methods")}
                  </div>
                  <div>{status.availableMethods.join(", ") || "-"}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    {t("security.two_factor.backup_codes")}
                  </div>
                  <div>{status.unusedBackupCodesCount ?? 0}</div>
                </div>
              </SgStack>
            </InlineNotice>

            <SgStack gap={16}>
              {!status.enabled ? (
                <SgGrid minItemWidth={220} gap={16} align="end">
                  <SgCombobox
                    id="security-2fa-method"
                    label={t("security.two_factor.method")}
                    source={status.availableMethods}
                    value={selectedMethod}
                    onValueChange={(value) => setSelectedMethod(String(value))}
                  />
                  <SgButton
                    appearance="solid"
                    severity="primary"
                    shape="rounded"
                    label={t("security.two_factor.enable")}
                    loading={pending}
                    disabled={pending}
                    onClick={handleEnable}
                  />
                </SgGrid>
              ) : (
                <SgGrid minItemWidth={280} gap={16}>
                  {status.primaryMethod === "TOTP" ? (
                    <SgInputText
                      id="security-2fa-disable-code"
                      name="disableTwoFactorCode"
                      label={t("security.two_factor.code")}
                      register={register}
                    />
                  ) : null}
                  <SgInputPassword
                    id="security-2fa-disable-password"
                    name="disablePassword"
                    label={t("security.two_factor.password")}
                    register={register}
                    minSize={0}
                    showStrengthBar={false}
                    commonPasswordCheck={false}
                    upperRequired={false}
                    lowerRequired={false}
                    numberRequired={false}
                    specialCharacterRequired={false}
                    prohibitsRepeatedCharactersInSequence={false}
                    prohibitsSequentialAscCharacters={false}
                    prohibitsSequentialDescCharacters={false}
                    inputProps={disablePasswordInputProps}
                  />
                  <SgInputText
                    id="security-2fa-backup-code"
                    name="backupCode"
                    label={t("security.two_factor.backup_code")}
                    register={register}
                  />
                  <SgPanel borderStyle="none" className="min-h-0 min-w-0">
                    <InlineNotice>
                      {t(
                        status.primaryMethod === "TOTP"
                          ? "security.two_factor.disable_hint_totp"
                          : "security.two_factor.disable_hint"
                      )}
                    </InlineNotice>
                  </SgPanel>
                  <SgStack direction="row" justify="end">
                    <SgButton
                      appearance="outline"
                      severity="danger"
                      shape="rounded"
                      label={t("security.two_factor.disable")}
                      loading={pending}
                      disabled={pending}
                      onClick={handleDisable}
                    />
                  </SgStack>
                </SgGrid>
              )}

              {enableResponse?.qrCode?.base64 ? (
                <SgGrid minItemWidth={280} gap={24}>
                  <SgPanel className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <img
                      alt={t("security.two_factor.qr_code")}
                      className="h-48 w-48 rounded-2xl object-contain"
                      src={`data:image/png;base64,${enableResponse.qrCode.base64}`}
                    />
                  </SgPanel>
                  <SgStack gap={16}>
                    <SgInputText
                      id="security-2fa-totp-code"
                      name="totpCode"
                      label={t("security.two_factor.code")}
                      register={register}
                    />
                    <SgStack direction="row" justify="end">
                      <SgButton
                        appearance="solid"
                        severity="primary"
                        shape="rounded"
                        label={t("security.two_factor.confirm_totp")}
                        loading={pending}
                        disabled={pending}
                        onClick={handleConfirmTotp}
                      />
                    </SgStack>
                  </SgStack>
                </SgGrid>
              ) : null}

              {enableResponse?.backupCodes?.length ? (
                <InlineNotice tone="success">
                  <SgStack gap={12}>
                    <SgStack direction="row" wrap justify="between" align="center" gap={12}>
                      <div className="font-medium">
                        {t("security.two_factor.backup_codes")}
                      </div>
                      <SgButton
                        appearance="solid"
                        severity="primary"
                        shape="rounded"
                        label={t("security.two_factor.download_backup_codes_csv")}
                        onClick={handleDownloadBackupCodesCsv}
                      />
                    </SgStack>
                    <div>{t("security.two_factor.backup_codes_hint")}</div>
                    <SgGrid columns={2} gap={8}>
                      {enableResponse.backupCodes.map((code) => (
                        <div
                          key={code}
                          className="rounded-xl border border-emerald-200 bg-white px-3 py-2 font-mono text-sm"
                        >
                          {code}
                        </div>
                      ))}
                    </SgGrid>
                  </SgStack>
                </InlineNotice>
              ) : null}
            </SgStack>
          </SgGrid>
        </SgStack>
      ) : null}
    </PageFrame>
  );
}
