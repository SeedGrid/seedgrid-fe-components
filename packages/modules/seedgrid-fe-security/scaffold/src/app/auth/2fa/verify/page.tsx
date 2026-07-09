"use client";

import type { InputHTMLAttributes } from "react";
import { useRef, useState } from "react";

import {
  SgButton,
  SgCard,
  SgInputOTP,
  SgPanel,
  SgStack,
  SgWhistleHost,
  sgWhistle,
} from "@seedgrid/fe-components";
import { useRouter } from "next/navigation";
import {
  type Control,
  type FieldErrors,
  type FieldValues,
  type RegisterOptions,
  useForm,
} from "react-hook-form";

import { useI18n } from "@/i18n";
import { useSgTheme } from "@/theme";
import {
  InlineNotice,
  extractApiMessage,
  resolvePostAuthPath,
  securityConfig,
  useAuth,
} from "@/modules/security";
import { authService } from "@/modules/security/services/auth-service";
import { readStoredSession } from "@/modules/security/services/session-storage";

type TwoFactorVerifyFormValues = {
  code: string;
};

const TWO_FACTOR_CODE_LENGTH = 6;

export default function TwoFactorVerifyPage() {
  const router = useRouter();
  const { t } = useI18n();
  const translate = t as unknown as (
    key: string,
    values?: Record<string, unknown>
  ) => string;
  const { currentMode } = useSgTheme();
  const isDarkMode = currentMode === "dark";
  const auth = useAuth();
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const lastSubmittedCodeRef = useRef<string | null>(null);
  const pendingMethod = auth.pendingTwoFactor?.method?.trim().toUpperCase() ?? "";
  const canResendEmail = pendingMethod === "EMAIL";
  const { control, handleSubmit, reset, setValue } =
    useForm<TwoFactorVerifyFormValues>({
      defaultValues: {
        code: "",
      },
    });
  const codeRules = {
    required: translate("security.auth.two_factor.validation.code_required"),
  };
  const otpControl = control as unknown as Control<FieldValues>;
  const otpRules = codeRules as RegisterOptions<FieldValues>;
  const otpInputProps: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue"
  > = {
    autoComplete: "one-time-code",
    inputMode: "text",
  };

  function normalizeCode(value: string) {
    return value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  }

  const methodHint =
    pendingMethod === "EMAIL"
      ? translate("security.auth.two_factor.hint_email")
      : pendingMethod === "TOTP"
        ? translate("security.auth.two_factor.hint_totp")
        : pendingMethod === "WHATSAPP"
          ? translate("security.auth.two_factor.hint_whatsapp")
          : translate("security.auth.two_factor.hint_generic");

  async function handleVerify(values: TwoFactorVerifyFormValues) {
    const normalizedCode = normalizeCode(values.code);

    if (normalizedCode.length !== TWO_FACTOR_CODE_LENGTH || pending) {
      return;
    }

    setPending(true);

    try {
      lastSubmittedCodeRef.current = normalizedCode;
      await auth.verifyTwoFactor(normalizedCode);
      sgWhistle.success({
        message: translate("security.auth.two_factor.success"),
      });
      reset();
      const nextPermissions = readStoredSession()?.permissions ?? [];
      router.push(await resolvePostAuthPath(nextPermissions));
    } catch (error) {
      lastSubmittedCodeRef.current = null;
      sgWhistle.error({
        message:
          extractApiMessage(error) ??
          translate("security.auth.two_factor.error"),
      });
    } finally {
      setPending(false);
    }
  }

  async function handleAutoSubmit(rawValue: string) {
    const normalizedCode = normalizeCode(rawValue);

    if (
      normalizedCode.length !== TWO_FACTOR_CODE_LENGTH ||
      pending ||
      lastSubmittedCodeRef.current === normalizedCode
    ) {
      return;
    }

    setValue("code", normalizedCode, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    await handleSubmit(handleVerify, handleInvalidSubmit)();
  }

  function handleInvalidSubmit(errors: FieldErrors<TwoFactorVerifyFormValues>) {
    const firstMessage = errors.code?.message;

    if (firstMessage) {
      sgWhistle.error({ message: firstMessage });
    }
  }

  async function handleResendEmail() {
    const pendingSession = auth.pendingTwoFactor;

    if (!pendingSession || resending) {
      return;
    }

    setResending(true);

    try {
      await authService.resendTwoFactor(pendingSession);
      sgWhistle.success({
        message: translate("security.auth.two_factor.resend_success"),
      });
      reset({ code: "" });
      lastSubmittedCodeRef.current = null;
    } catch (error) {
      sgWhistle.error({
        message:
          extractApiMessage(error) ??
          translate("security.auth.two_factor.resend_error"),
      });
    } finally {
      setResending(false);
    }
  }

  return (
    <div
      className={`flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 ${
        isDarkMode
          ? "bg-slate-950 text-slate-100"
          : "bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.12),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef4fb_100%)] text-slate-900"
      }`}
    >
      <SgCard
        cardStyle="elevated"
        size="lg"
        className={`w-full max-w-md rounded-[2rem] border shadow-2xl ${
          isDarkMode
            ? "border-slate-800 bg-slate-900/95 shadow-black/30"
            : "border-white/70 bg-white/95 shadow-slate-900/10"
        }`}
      >
        <form
          noValidate
          onSubmit={handleSubmit(handleVerify, handleInvalidSubmit)}
        >
          <SgStack gap={24}>
            <SgWhistleHost className="w-full" max={1} newestOnTop />

            <SgStack gap={8} className="text-center">
              <h1
                className={`text-2xl font-semibold ${
                  isDarkMode ? "text-slate-50" : "text-slate-950"
                }`}
              >
                {translate("security.auth.two_factor.title")}
              </h1>
              <p
                className={`text-sm leading-6 ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {translate("security.auth.two_factor.description")}
              </p>
              <p
                className={`text-xs leading-5 ${
                  isDarkMode ? "text-slate-500" : "text-slate-500"
                }`}
              >
                {methodHint}
              </p>
            </SgStack>

            {!auth.pendingTwoFactor ? (
              <InlineNotice tone="warning">
                {translate("security.auth.two_factor.missing")}
              </InlineNotice>
            ) : null}

            <SgPanel
              borderStyle="none"
              className={`rounded-[1.5rem] px-3 py-4 ${
                isDarkMode ? "bg-slate-950/70" : "bg-slate-50/70"
              }`}
            >
              <SgInputOTP
                id="security-two-factor-code"
                control={otpControl}
                name="code"
                rules={otpRules}
                label={translate("security.auth.two_factor.code")}
                mask="### ###"
                inputProps={otpInputProps}
                onRawChange={(rawValue) => {
                  if (normalizeCode(rawValue).length < TWO_FACTOR_CODE_LENGTH) {
                    lastSubmittedCodeRef.current = null;
                  }
                }}
                onComplete={(value) => {
                  void handleAutoSubmit(value);
                }}
                groupClassName="justify-center"
              />
            </SgPanel>

            <SgStack direction="row" justify="between" align="center" gap={12}>
              <SgButton
                appearance="outline"
                severity="secondary"
                shape="rounded"
                label={translate("security.common.back")}
                onClick={() => {
                  window.location.assign(securityConfig.routes.login);
                }}
              />

              {canResendEmail ? (
                <SgButton
                  appearance="ghost"
                  severity="primary"
                  shape="rounded"
                  label={translate("security.auth.two_factor.resend")}
                  loading={resending}
                  disabled={resending || pending || !auth.pendingTwoFactor}
                  onClick={() => {
                    void handleResendEmail();
                  }}
                />
              ) : (
                <div />
              )}
            </SgStack>
          </SgStack>
        </form>
      </SgCard>
    </div>
  );
}
