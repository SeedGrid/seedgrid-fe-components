"use client";

import type { FormEvent, InputHTMLAttributes } from "react";
import { useEffect, useMemo, useState } from "react";

import {
  SgButton,
  SgInputEmail,
  SgInputOTP,
  SgInputPassword,
  SgInputText,
  SgPanel,
  SgStack,
  toast,
} from "@seedgrid/fe-components";
import { useSearchParams } from "next/navigation";
import {
  type Control,
  type FieldValues,
  type RegisterOptions,
  useForm,
} from "react-hook-form";

import { useI18n } from "@/i18n";
import {
  InlineNotice,
  PageFrame,
  classifySelfEnterInvitationError,
  extractApiMessage,
  isSelfEnterInvitationEmailMismatchError,
  securityConfig,
  securityService,
} from "@/modules/security";

type InvitationState = "idle" | "loading" | "ready" | "invalid" | "consumed";

type PublicFlowStage = "form" | "confirm" | "success";

type ConfirmationFormValues = {
  code: string;
};

const CONFIRMATION_CODE_LENGTH = 6;

export default function PublicSelfEnterRequestPage() {
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const token = searchParams.get("token")?.trim() ?? "";
  const isInvitationMode = token.length > 0;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [publicStage, setPublicStage] = useState<PublicFlowStage>("form");
  const [requestId, setRequestId] = useState<string | number | null>(null);
  const [invitationState, setInvitationState] = useState<InvitationState>(
    isInvitationMode ? "loading" : "idle"
  );
  const [invitationErrorMessage, setInvitationErrorMessage] =
    useState<string | null>(null);
  const [resendingCode, setResendingCode] = useState(false);
  const { control, handleSubmit: handleConfirmationSubmit, reset } =
    useForm<ConfirmationFormValues>({
      defaultValues: {
        code: "",
      },
    });
  const confirmationControl = control as unknown as Control<FieldValues>;
  const confirmationRules = {
    required: t("security.self_enter.public.confirm.validation.code_required"),
  } as RegisterOptions<FieldValues>;
  const confirmationInputProps: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue"
  > = {
    autoComplete: "one-time-code",
    inputMode: "numeric",
  };
  const pageTitle = isInvitationMode
    ? t("security.self_enter.invitation.title")
    : t("security.self_enter.public.title");
  const pageDescription = isInvitationMode
    ? t("security.self_enter.invitation.description")
    : t("security.self_enter.public.description");
  const nameInputProps = {
    value: name,
    onChange: (event: { target: { value: string } }) =>
      setName(event.target.value),
  };
  const emailInputProps = {
    value: email,
    onChange: (event: { target: { value: string } }) =>
      setEmail(event.target.value),
  };
  const passwordInputProps = {
    value: password,
    onChange: (event: { target: { value: string } }) =>
      setPassword(event.target.value),
    autoComplete: "new-password",
  };
  const submitLabel = isInvitationMode
    ? t("security.self_enter.invitation.submit")
    : t("security.self_enter.public.submit");
  const inviteInfoMessage = useMemo(() => {
    if (!isInvitationMode || invitationState !== "ready") {
      return null;
    }

    return t("security.self_enter.invitation.notice");
  }, [invitationState, isInvitationMode, t]);

  useEffect(() => {
    if (publicStage !== "success") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      window.location.assign(securityConfig.routes.login);
    }, 1200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [publicStage]);

  useEffect(() => {
    setPassword("");
    reset({ code: "" });
    setPublicStage("form");
    setRequestId(null);

    if (!isInvitationMode) {
      setInvitationState("idle");
      setInvitationErrorMessage(null);
      return;
    }

    let active = true;

    setInvitationState("loading");
    setInvitationErrorMessage(null);

    void (async () => {
      try {
        const response = await securityService.getSelfEnterInvitation(token);

        if (!active) {
          return;
        }

        setName(response.name?.trim() ?? "");
        setEmail(response.email?.trim() ?? "");
        setInvitationState("ready");
      } catch (error) {
        if (!active) {
          return;
        }

        const errorKind = classifySelfEnterInvitationError(error);
        const fallbackMessage =
          errorKind === "consumed"
            ? t("security.self_enter.invitation.consumed")
            : t("security.self_enter.invitation.invalid");

        setInvitationState(errorKind === "consumed" ? "consumed" : "invalid");
        setInvitationErrorMessage(extractApiMessage(error) ?? fallbackMessage);
      }
    })();

    return () => {
      active = false;
    };
  }, [isInvitationMode, reset, t, token]);

  async function handleRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isInvitationMode && !securityConfig.features.selfEnterEnabled) {
      return;
    }

    setPending(true);

    try {
      if (isInvitationMode) {
        await securityService.completeSelfEnterInvitation(token, {
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        });
        toast.success(t("security.self_enter.invitation.success"));
        setPublicStage("success");
      } else {
        const response = await securityService.createSelfEnterRequest({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        });

        setRequestId(response.id);
        setPublicStage("confirm");
        toast.success(t("security.self_enter.public.confirm.code_sent"));
      }

      setPassword("");
    } catch (error) {
      const invitationError = isInvitationMode
        ? isSelfEnterInvitationEmailMismatchError(error)
          ? t("security.self_enter.invitation.email_mismatch")
          : t("security.self_enter.invitation.error")
        : t("security.self_enter.public.error");

      toast.error(extractApiMessage(error) ?? invitationError);
    } finally {
      setPending(false);
    }
  }

  async function handleConfirmEmail(values: ConfirmationFormValues) {
    if (!requestId || pending) {
      return;
    }

    const normalizedCode = normalizeConfirmationCode(values.code);

    if (normalizedCode.length !== CONFIRMATION_CODE_LENGTH) {
      return;
    }

    setPending(true);

    try {
      await securityService.confirmSelfEnterRequestEmail(requestId, {
        code: normalizedCode,
      });
      setPublicStage("success");
      toast.success(t("security.self_enter.public.approval_pending"));
    } catch (error) {
      toast.error(
        extractApiMessage(error) ??
          t("security.self_enter.public.confirm.error")
      );
    } finally {
      setPending(false);
    }
  }

  async function handleResendEmail() {
    if (!requestId || resendingCode) {
      return;
    }

    setResendingCode(true);

    try {
      await securityService.resendSelfEnterRequestEmail(requestId);
      reset({ code: "" });
      toast.success(t("security.self_enter.public.confirm.resend_success"));
    } catch (error) {
      toast.error(
        extractApiMessage(error) ??
          t("security.self_enter.public.confirm.resend_error")
      );
    } finally {
      setResendingCode(false);
    }
  }

  function normalizeConfirmationCode(value: string) {
    return value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  }

  function renderInvitationState() {
    if (invitationState === "loading") {
      return (
        <InlineNotice>{t("security.self_enter.invitation.loading")}</InlineNotice>
      );
    }

    if (invitationState === "invalid") {
      return (
        <InlineNotice tone="danger">
          {invitationErrorMessage ?? t("security.self_enter.invitation.invalid")}
        </InlineNotice>
      );
    }

    if (invitationState === "consumed") {
      return (
        <InlineNotice tone="warning">
          {invitationErrorMessage ?? t("security.self_enter.invitation.consumed")}
        </InlineNotice>
      );
    }

    return null;
  }

  function renderSuccessState() {
    const message = isInvitationMode
      ? t("security.self_enter.invitation.approval_pending")
      : t("security.self_enter.public.approval_pending");

    return (
      <SgPanel borderStyle="none" className="mx-auto w-full max-w-2xl">
        <SgStack gap={16}>
          <InlineNotice tone="success">{message}</InlineNotice>
        </SgStack>
      </SgPanel>
    );
  }

  function renderPublicConfirmation() {
    return (
      <SgPanel borderStyle="none" className="mx-auto w-full max-w-2xl">
        <form onSubmit={handleConfirmationSubmit(handleConfirmEmail)}>
          <SgStack gap={16}>
            <InlineNotice>
              {t("security.self_enter.public.confirm.description", {
                email,
              })}
            </InlineNotice>
            <SgInputOTP
              id="security-self-enter-confirmation-code"
              control={confirmationControl}
              name="code"
              rules={confirmationRules}
              label={t("security.self_enter.public.confirm.code")}
              mask="### ###"
              inputProps={confirmationInputProps}
              groupClassName="justify-start"
            />
            <div className="flex flex-wrap justify-end gap-3">
              <SgButton
                appearance="outline"
                severity="secondary"
                shape="rounded"
                label={t("security.self_enter.public.confirm.resend")}
                onClick={() => {
                  void handleResendEmail();
                }}
                disabled={resendingCode || pending}
                loading={resendingCode}
                type="button"
              />
              <SgButton
                appearance="solid"
                severity="primary"
                shape="rounded"
                label={t("security.self_enter.public.confirm.submit")}
                loading={pending}
                disabled={pending}
                type="submit"
              />
            </div>
          </SgStack>
        </form>
      </SgPanel>
    );
  }

  return (
    <PageFrame title={pageTitle} description={pageDescription}>
      {isInvitationMode ? renderInvitationState() : null}

      {!isInvitationMode && !securityConfig.features.selfEnterEnabled ? (
        <InlineNotice tone="warning">
          {t("security.self_enter.public.disabled")}
        </InlineNotice>
      ) : publicStage === "success" ? (
        renderSuccessState()
      ) : !isInvitationMode && publicStage === "confirm" ? (
        renderPublicConfirmation()
      ) : (
        isInvitationMode && invitationState !== "ready" ? null : (
        <form
          className="mx-auto max-w-2xl space-y-4"
          onSubmit={handleRequestSubmit}
        >
          {inviteInfoMessage ? (
            <InlineNotice>{inviteInfoMessage}</InlineNotice>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <SgInputEmail
              id="security-self-enter-email"
              label={t("security.self_enter.public.email")}
              required
              readOnly={isInvitationMode}
              inputProps={emailInputProps}
              onChange={(value) => {
                if (!isInvitationMode) {
                  setEmail(value);
                }
              }}
            />
            <SgInputText
              id="security-self-enter-name"
              label={t("security.self_enter.public.name")}
              required
              inputProps={nameInputProps}
            />
            <SgInputPassword
              id="security-self-enter-password"
              label={t("security.self_enter.public.password")}
              required
              inputProps={passwordInputProps}
            />
          </div>
          <div className="flex justify-end">
            <SgButton
              appearance="solid"
              severity="primary"
              shape="rounded"
              label={submitLabel}
              loading={pending}
              disabled={pending}
              type="submit"
            />
          </div>
        </form>
        )
      )}
    </PageFrame>
  );
}
