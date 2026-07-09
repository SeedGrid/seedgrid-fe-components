"use client";

import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";

import {
  SgAvatar,
  SgButton,
  SgGrid,
  SgInputEmail,
  SgInputPhone,
  SgPanel,
  SgStack,
  SgInputText,
  sgWhistle,
} from "@seedgrid/fe-components";
import { useRouter } from "next/navigation";

import { useI18n } from "@/i18n";
import {
  InlineNotice,
  PageFrame,
  RouteGuard,
  extractApiMessage,
  securityConfig,
  securityService,
  useAuth,
  usePermission,
  type UserSummary,
} from "@/modules/security";

type ProfileFormValues = {
  email: string;
  name: string;
  whatsApp: string;
};

const EMPTY_FORM: ProfileFormValues = {
  email: "",
  name: "",
  whatsApp: "",
};

function hasAtLeastTwoWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length >= 2;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";

      if (!result) {
        reject(new Error("empty-file-result"));
        return;
      }

      resolve(result);
    };

    reader.onerror = () => reject(reader.error ?? new Error("file-read-error"));
    reader.readAsDataURL(file);
  });
}

function extractBase64Content(dataUrl: string) {
  const [, base64 = ""] = dataUrl.split(",", 2);
  return base64.trim();
}

function createAvatarVersion(storageKey: string) {
  return `${storageKey || "avatar"}-${Date.now()}`;
}

export default function ProfilePage() {
  return (
    <RouteGuard>
      <ProfileScreen />
    </RouteGuard>
  );
}

function ProfileScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const auth = useAuth();
  const canUpdateUsers = usePermission("USER_UPDATE");
  const [userRecord, setUserRecord] = useState<UserSummary | null>(null);
  const [formValues, setFormValues] = useState<ProfileFormValues>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState("");
  const [avatarObjectUrl, setAvatarObjectUrl] = useState("");
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const currentLogin = auth.session?.login?.trim() ?? "";
  const currentUserPublicId = auth.session?.publicId?.trim() ?? "";
  const currentRoles = auth.roles.length
    ? auth.roles.join(", ")
    : t("security.dashboard.user.subtitle");
  const loginInputProps = {
    value: currentLogin,
  };
  const rolesInputProps = {
    value: currentRoles,
  };
  const emailInputProps = {
    value: formValues.email,
  };
  const nameInputProps = {
    value: formValues.name,
  };
  const whatsAppInputProps = {
    value: formValues.whatsApp,
  };
  const avatarUrl =
    avatarObjectUrl ||
    (userRecord?.publicId
      ? securityService.buildUserAvatarUrl(
          userRecord.publicId,
          avatarVersion || userRecord.avatarStorageKey
        )
      : undefined);

  useEffect(() => {
    setAvatarObjectUrl((current) => {
      if (current.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return "";
    });
  }, [avatarVersion, userRecord?.avatarStorageKey, userRecord?.publicId]);

  useEffect(() => {
    return () => {
      if (avatarObjectUrl.startsWith("blob:")) {
        URL.revokeObjectURL(avatarObjectUrl);
      }
    };
  }, [avatarObjectUrl]);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const status = await securityService.getTwoFactorStatus();

        if (active) {
          setIsTwoFactorEnabled(Boolean(status.enabled));
        }
      } catch {
        if (active) {
          setIsTwoFactorEnabled(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        if (!currentUserPublicId) {
          setUserRecord(null);
          setFormValues(EMPTY_FORM);
          return;
        }

        const user = await securityService.getUser(currentUserPublicId);

        if (!active) {
          return;
        }

        setUserRecord(user);
        setAvatarVersion(user?.avatarStorageKey?.trim() ?? "");
        setFormValues({
          email: user?.email ?? currentLogin,
          name: user?.name ?? "",
          whatsApp: user?.whatsApp ?? "",
        });
      } catch (error) {
        if (!active) {
          return;
        }

        setLoadError(
          extractApiMessage(error) ?? t("security.profile.load_error")
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [currentLogin, currentUserPublicId, t]);

  async function handleSave() {
    if (!userRecord?.publicId || !canUpdateUsers) {
      return;
    }

    if (!hasAtLeastTwoWords(formValues.name)) {
      sgWhistle.error({ message: t("security.profile.name_min_words") });
      return;
    }

    setSaving(true);

    try {
      await securityService.updateUser(userRecord.publicId, {
        email: formValues.email.trim(),
        name: formValues.name.trim() || undefined,
        whatsApp: formValues.whatsApp.trim() || undefined,
      });
      sgWhistle.success({ message: t("security.profile.save_success") });
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t("security.profile.save_error"),
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !userRecord?.publicId || !canUpdateUsers) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      sgWhistle.error({ message: t("security.profile.avatar_invalid_file") });
      return;
    }

    setUploadingAvatar(true);

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const base64 = extractBase64Content(dataUrl);

      const updatedUser = await securityService.uploadUserAvatar(userRecord.publicId, {
        filename: file.name,
        contentType: file.type,
        base64,
      });

      const nextStorageKey =
        updatedUser?.avatarStorageKey?.trim() ||
        userRecord.avatarStorageKey?.trim() ||
        "avatar";
      const nextAvatarVersion = createAvatarVersion(nextStorageKey);
      setUserRecord((current) =>
        current
          ? {
              ...current,
              avatarStorageKey: nextStorageKey,
            }
          : current
      );
      setAvatarVersion(nextAvatarVersion);
      window.dispatchEvent(
        new CustomEvent("seedgrid:profile-updated", {
          detail: {
            publicId: userRecord.publicId,
            avatarStorageKey: nextStorageKey,
            avatarVersion: nextAvatarVersion,
            name: formValues.name.trim(),
          },
        })
      );
      sgWhistle.success({ message: t("security.profile.avatar_upload_success") });
    } catch (error) {
      sgWhistle.error({
        message:
          extractApiMessage(error) ?? t("security.profile.avatar_upload_error"),
      });
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleAvatarImageError() {
    if (!userRecord?.publicId || avatarObjectUrl) {
      return;
    }

    const fallbackObjectUrl = await securityService.fetchUserAvatarObjectUrl(
      userRecord.publicId,
      avatarVersion || userRecord.avatarStorageKey
    );

    if (!fallbackObjectUrl) {
      return;
    }

    setAvatarObjectUrl((current) => {
      if (current.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return fallbackObjectUrl;
    });
  }

  return (
    <PageFrame
      title={t("security.profile.title")}
      description={t("security.profile.description")}
      actions={
        <SgStack direction="row" wrap gap={8}>
          <SgButton
            appearance="outline"
            severity="secondary"
            shape="rounded"
            label={t("security.profile.change_password")}
            onClick={() => {
              router.push(securityConfig.routes.changePassword);
            }}
          />
          <SgButton
            appearance="solid"
            severity="primary"
            shape="rounded"
            label={t(
              isTwoFactorEnabled
                ? "security.profile.disable_two_factor"
                : "security.profile.enable_two_factor"
            )}
            onClick={() => {
              router.push(securityConfig.routes.twoFactor);
            }}
          />
        </SgStack>
      }
    >
      {loadError ? <InlineNotice tone="danger">{loadError}</InlineNotice> : null}

      {loading ? (
        <InlineNotice>{t("security.common.loading")}</InlineNotice>
      ) : (
        <SgStack gap={24}>
          <SgPanel className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            {userRecord && canUpdateUsers ? (
              <>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarSelection}
                />
                <SgStack direction="row" wrap justify="between" align="center" gap={16}>
                  <SgButton
                    appearance="ghost"
                    severity="secondary"
                    iconOnly
                    onClick={() => avatarInputRef.current?.click()}
                    aria-label={t("security.profile.avatar_upload")}
                    className="rounded-full p-0 hover:scale-[1.02]"
                  >
                    <SgAvatar
                      src={avatarUrl}
                      alt={formValues.name.trim() || currentLogin || t("security.profile.title")}
                      label={(formValues.name.trim() || currentLogin || "SG").slice(0, 2).toUpperCase()}
                      size="xl"
                      onImageError={handleAvatarImageError}
                    />
                  </SgButton>

                  <SgButton
                    appearance="outline"
                    severity="secondary"
                    shape="rounded"
                    label={t("security.profile.avatar_upload")}
                    onClick={() => avatarInputRef.current?.click()}
                    loading={uploadingAvatar}
                  />
                </SgStack>
              </>
            ) : (
              <SgAvatar
                src={avatarUrl}
                alt={formValues.name.trim() || currentLogin || t("security.profile.title")}
                label={(formValues.name.trim() || currentLogin || "SG").slice(0, 2).toUpperCase()}
                size="xl"
                onImageError={handleAvatarImageError}
              />
            )}
          </SgPanel>

          <SgGrid minItemWidth={280} gap={16}>
            <SgInputText
              id="security-profile-login"
              label={t("security.profile.login")}
              readOnly
              inputProps={loginInputProps}
            />
            <SgInputText
              id="security-profile-roles"
              label={t("security.profile.roles")}
              readOnly
              inputProps={rolesInputProps}
            />
          </SgGrid>

          {userRecord ? (
            <SgGrid minItemWidth={280} gap={16}>
              <SgInputEmail
                id="security-profile-email"
                label={t("security.profile.email")}
                readOnly={!canUpdateUsers}
                inputProps={emailInputProps}
                onChange={(value) =>
                  setFormValues((current) => ({
                    ...current,
                    email: value,
                  }))
                }
              />
              <SgInputText
                id="security-profile-name"
                label={t("security.profile.name")}
                minNumberOfWords={2}
                readOnly={!canUpdateUsers}
                inputProps={nameInputProps}
                onChange={(value) =>
                  setFormValues((current) => ({
                    ...current,
                    name: value,
                  }))
                }
              />
              <SgInputPhone
                id="security-profile-whatsapp"
                label={t("security.profile.whatsapp")}
                readOnly={!canUpdateUsers}
                inputProps={whatsAppInputProps}
                onChange={(value) =>
                  setFormValues((current) => ({
                    ...current,
                    whatsApp: value,
                  }))
                }
              />
            </SgGrid>
          ) : (
            <InlineNotice tone="warning">
              {t("security.profile.no_user_record")}
            </InlineNotice>
          )}

          {userRecord && canUpdateUsers ? (
            <SgStack direction="row" justify="end">
              <SgButton
                appearance="solid"
                severity="primary"
                shape="rounded"
                label={t("security.common.save")}
                onClick={handleSave}
                loading={saving}
                disabled={
                  saving ||
                  !formValues.email.trim() ||
                  !hasAtLeastTwoWords(formValues.name)
                }
              />
            </SgStack>
          ) : null}
        </SgStack>
      )}
    </PageFrame>
  );
}
