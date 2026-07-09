"use client";

import { useState } from "react";

import {
  SgButton,
  SgInputEmail,
  SgInputPassword,
  SgPanel,
  SgStack,
  toast,
} from "@seedgrid/fe-components";
import {
  type FieldErrors,
  type FieldValues,
  type RegisterOptions,
  type UseFormRegister,
  useForm,
} from "react-hook-form";

import { useI18n } from "@/i18n";
import {
  PageFrame,
  authService,
  extractApiMessage,
  securityConfig,
} from "@/modules/security";

type ForgotPasswordFormValues = {
  email: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [pending, setPending] = useState(false);
  const { handleSubmit, register, reset } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const emailRules = {
    required: t("security.forgot_password.validation.email_required"),
  };
  const newPasswordRules = {
    required: t("security.forgot_password.validation.new_password_required"),
  };
  const confirmPasswordRules = {
    required: t("security.forgot_password.validation.confirm_password_required"),
  };
  const formRegister = register as unknown as UseFormRegister<FieldValues>;
  const emailFieldRules = emailRules as RegisterOptions<FieldValues>;
  const newPasswordFieldRules = newPasswordRules as RegisterOptions<FieldValues>;
  const confirmPasswordFieldRules =
    confirmPasswordRules as RegisterOptions<FieldValues>;
  const emailInputProps = {
    autoComplete: "email",
  };
  const newPasswordInputProps = {
    autoComplete: "new-password",
  };
  async function handleForgotPassword(values: ForgotPasswordFormValues) {
    if (values.newPassword !== values.confirmPassword) {
      toast.error(t("security.forgot_password.mismatch"));
      return;
    }

    setPending(true);

    try {
      await authService.forgotPassword({
        email: values.email.trim(),
        newPassword: values.newPassword,
      });
      reset();
      toast.success(t("security.forgot_password.success"));
    } catch (error) {
      toast.error(
        extractApiMessage(error) ?? t("security.forgot_password.error")
      );
    } finally {
      setPending(false);
    }
  }

  function handleInvalidSubmit(errors: FieldErrors<ForgotPasswordFormValues>) {
    const firstMessage =
      errors.email?.message ??
      errors.newPassword?.message ??
      errors.confirmPassword?.message;

    if (firstMessage) {
      toast.error(firstMessage);
    }
  }

  return (
    <PageFrame
      title={t("security.forgot_password.title")}
      description={t("security.forgot_password.description")}
      actions={
        <SgButton
          appearance="outline"
          severity="secondary"
          shape="rounded"
          label={t("security.common.back")}
          onClick={() => {
            window.location.assign(securityConfig.routes.login);
          }}
        />
      }
    >
      <SgPanel borderStyle="none" className="mx-auto w-full max-w-xl pt-8">
        <form
          noValidate
          onSubmit={handleSubmit(handleForgotPassword, handleInvalidSubmit)}
        >
          <SgStack gap={16}>
            <SgInputEmail
              id="security-forgot-password-email"
              name="email"
              label={t("security.forgot_password.email")}
              register={formRegister}
              required
              rules={emailFieldRules}
              inputProps={emailInputProps}
            />
            <SgInputPassword
              id="security-forgot-password-new-password"
              name="newPassword"
              label={t("security.forgot_password.new_password")}
              register={formRegister}
              required
              rules={newPasswordFieldRules}
              inputProps={newPasswordInputProps}
            />
            <SgInputPassword
              id="security-forgot-password-confirm-password"
              name="confirmPassword"
              label={t("security.forgot_password.confirm_password")}
              register={formRegister}
              required
              rules={confirmPasswordFieldRules}
              inputProps={newPasswordInputProps}
            />
            <SgStack direction="row" justify="end">
              <SgButton
                appearance="solid"
                severity="primary"
                shape="rounded"
                label={t("security.forgot_password.submit")}
                loading={pending}
                disabled={pending}
                type="submit"
              />
            </SgStack>
          </SgStack>
        </form>
      </SgPanel>
    </PageFrame>
  );
}
