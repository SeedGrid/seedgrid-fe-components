"use client";

import { useState } from "react";

import {
  SgButton,
  SgInputPassword,
  SgPanel,
  SgStack,
  toast,
} from "@seedgrid/fe-components";
import { useRouter } from "next/navigation";
import { type FieldErrors, useForm } from "react-hook-form";

import { useI18n } from "@/i18n";
import {
  PageFrame,
  RouteGuard,
  extractApiMessage,
  securityConfig,
  securityService,
  useAuth,
} from "@/modules/security";

type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePasswordPage() {
  return (
    <RouteGuard permissions={["USER_CHANGE_PASSWORD"]}>
      <ChangePasswordScreen />
    </RouteGuard>
  );
}

function ChangePasswordScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const auth = useAuth();
  const [pending, setPending] = useState(false);
  const { handleSubmit, register, reset } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const currentPasswordRules = {
    required: t("security.change_password.validation.current_password_required"),
  };
  const newPasswordRules = {
    required: t("security.change_password.validation.new_password_required"),
  };
  const confirmPasswordRules = {
    required: t("security.change_password.validation.confirm_password_required"),
  };
  const currentPasswordInputProps = {
    autoComplete: "current-password",
  };
  const newPasswordInputProps = {
    autoComplete: "new-password",
  };
  async function handleChangePassword(values: ChangePasswordFormValues) {
    if (values.newPassword !== values.confirmPassword) {
      toast.error(t("security.change_password.mismatch"));
      return;
    }

    setPending(true);

    try {
      await securityService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmPassword,
      });
      toast.success(t("security.change_password.success"));
      reset();

      if (auth.session?.changePasswordRequired) {
        await auth.logout();
        router.push(securityConfig.routes.login);
        return;
      }
    } catch (error) {
      toast.error(
        extractApiMessage(error) ?? t("security.change_password.error")
      );
    } finally {
      setPending(false);
    }
  }

  function handleInvalidSubmit(errors: FieldErrors<ChangePasswordFormValues>) {
    const firstMessage =
      errors.currentPassword?.message ??
      errors.newPassword?.message ??
      errors.confirmPassword?.message;

    if (firstMessage) {
      toast.error(firstMessage);
    }
  }

  return (
    <PageFrame
      title={t("security.change_password.title")}
      description={t("security.change_password.description")}
    >
      <SgPanel borderStyle="none" className="mx-auto w-full max-w-xl pt-4">
        <form
          noValidate
          onSubmit={handleSubmit(handleChangePassword, handleInvalidSubmit)}
        >
          <SgStack gap={16}>
            <SgInputPassword
              id="security-change-password-current"
              name="currentPassword"
              label={t("security.change_password.current_password")}
              register={register}
              required
              rules={currentPasswordRules}
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
              inputProps={currentPasswordInputProps}
            />
            <SgInputPassword
              id="security-change-password-new"
              name="newPassword"
              label={t("security.change_password.new_password")}
              register={register}
              required
              rules={newPasswordRules}
              inputProps={newPasswordInputProps}
            />
            <SgInputPassword
              id="security-change-password-confirm"
              name="confirmPassword"
              label={t("security.change_password.confirm_password")}
              register={register}
              required
              rules={confirmPasswordRules}
              inputProps={newPasswordInputProps}
            />
            <SgStack direction="row" justify="end">
              <SgButton
                appearance="solid"
                severity="primary"
                shape="rounded"
                label={t("security.change_password.submit")}
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
