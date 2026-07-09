"use client";

import { useEffect, useMemo, useState } from "react";

import {
  SgButton,
  SgCheckboxGroup,
  SgConfirmationDialog,
  SgGrid,
  SgInputText,
  SgStack,
  SgToggleSwitch,
  sgWhistle,
} from "@seedgrid/fe-components";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useI18n } from "@/i18n";
import {
  InlineNotice,
  PageFrame,
  extractApiMessage,
  securityConfig,
  securityService,
  useCrudPermission,
  type PermissionSummary,
  type RoleSummary,
} from "@/modules/security";
import {
  extractFirstFormErrorMessage,
  showFormValidationWhistle,
} from "@/modules/security/utils";

type RoleEditorProps = {
  publicId?: string;
};

type RoleFormValues = {
  name: string;
  description: string;
  forIntegration: boolean;
  permissionIds: Array<string | number>;
};

const EMPTY_FORM: RoleFormValues = {
  name: "",
  description: "",
  forIntegration: false,
  permissionIds: [],
};

export function RoleEditor({ publicId }: RoleEditorProps) {
  const router = useRouter();
  const { t } = useI18n();
  const permissions = useCrudPermission("ROLE");
  const isEditing = Boolean(publicId);
  const isReadOnly = isEditing
    ? permissions.canRead && !permissions.canUpdate
    : !permissions.canCreate;
  const [availablePermissions, setAvailablePermissions] = useState<
    PermissionSummary[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    register,
    reset,
  } = useForm<RoleFormValues>({
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const [loadedPermissions, loadedRole] = await Promise.all([
          securityService.listPermissions(),
          publicId ? securityService.getRole(publicId) : Promise.resolve(null),
        ]);

        if (!active) {
          return;
        }

        setAvailablePermissions(loadedPermissions);

        if (loadedRole) {
          reset({
            name: loadedRole.name ?? "",
            description: loadedRole.description ?? "",
            forIntegration: Boolean(loadedRole.forIntegration),
            permissionIds: (loadedRole.permissions ?? []).map(
              (permission) => permission.id ?? permission.publicId
            ),
          });
        } else {
          reset(EMPTY_FORM);
        }
      } catch (error) {
        if (!active) {
          return;
        }

        setLoadError(
          extractApiMessage(error) ?? t("security.roles.form.load_error")
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
  }, [publicId, reset, t]);

  const permissionOptions = useMemo(
    () =>
      availablePermissions.map((permission) => ({
        label: permission.description
          ? `${permission.name} - ${permission.description}`
          : permission.name,
        value: permission.id ?? permission.publicId,
      })),
    [availablePermissions]
  );

  async function handleValidSubmit(values: RoleFormValues) {
    if (isReadOnly) {
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: values.name.trim(),
        description: values.description.trim() || undefined,
        forIntegration: values.forIntegration,
        permissionIds: values.permissionIds,
      };

      const savedRole = publicId
        ? await securityService.updateRole(publicId, payload)
        : await securityService.createRole(payload);

      sgWhistle.success({ message: t("security.roles.form.save_success") });
      router.push(`${securityConfig.routes.roles}/${savedRole.publicId}`);
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t("security.roles.form.save_error"),
      });
    } finally {
      setSaving(false);
    }
  }

  function handleInvalidSubmit(errors: unknown) {
    const message =
      extractFirstFormErrorMessage(errors) ?? t("security.common.field_required");

    showFormValidationWhistle("security-role-form-validation", message);
  }

  async function handleDelete() {
    if (!publicId) {
      return;
    }

    try {
      await securityService.deleteRole(publicId);
      sgWhistle.success({ message: t("security.roles.form.delete_success") });
      router.push(securityConfig.routes.roles);
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t("security.roles.list.delete_error"),
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  }

  return (
    <PageFrame
      title={
        isEditing
          ? t("security.roles.form.title_edit")
          : t("security.roles.form.title_new")
      }
      description={
        isEditing
          ? t("security.roles.form.description_edit")
          : t("security.roles.form.description_new")
      }
      readonlyLabel={isReadOnly ? t("security.common.readonly") : null}
      actions={
        <SgStack direction="row" wrap gap={8}>
          <SgButton
            appearance="outline"
            severity="primary"
            shape="rounded"
            label={t("security.common.back")}
            onClick={() => {
              router.push(securityConfig.routes.roles);
            }}
          />
          {isEditing && permissions.canDelete ? (
            <SgButton
              appearance="outline"
              severity="danger"
              shape="rounded"
              label={t("security.common.delete")}
              onClick={() => {
                setDeleteDialogOpen(true);
              }}
            />
          ) : null}
        </SgStack>
      }
    >
      {loadError ? <InlineNotice tone="danger">{loadError}</InlineNotice> : null}

      {loading ? (
        <InlineNotice>{t("security.common.loading")}</InlineNotice>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit(handleValidSubmit, handleInvalidSubmit)}
        >
          <SgStack gap={24}>
            <SgGrid minItemWidth={280} gap={16}>
              <SgInputText
                id="security-role-name"
                name="name"
                label={t("security.roles.form.name")}
                register={register}
                required
                rules={ {
                  required: t("security.common.field_required"),
                }}
                readOnly={isReadOnly}
              />
              <SgInputText
                id="security-role-description"
                name="description"
                label={t("security.roles.form.description")}
                register={register}
                readOnly={isReadOnly}
              />
            </SgGrid>

            <SgToggleSwitch
              id="security-role-integration"
              name="forIntegration"
              label={t("security.roles.form.for_integration")}
              control={control}
              readOnly={isReadOnly}
            />

            <SgStack gap={12}>
              <div className="text-sm text-slate-500">
                {t("security.roles.form.permissions_hint")}
              </div>

              {permissionOptions.length ? (
                <SgCheckboxGroup
                  id="security-role-permissions"
                  name="permissionIds"
                  title={t("security.roles.form.permissions")}
                  source={permissionOptions}
                  control={control}
                  orientation="vertical"
                  showCheckAll
                  disabled={isReadOnly}
                  readOnly={isReadOnly}
                  required
                  rules={ {
                    validate: (value) =>
                      Array.isArray(value) && value.length > 0
                        ? true
                        : t("security.roles.form.permissions_required"),
                  }}
                />
              ) : (
                <InlineNotice tone="warning">
                  {t("security.roles.form.permissions_empty")}
                </InlineNotice>
              )}
            </SgStack>

            {!isReadOnly ? (
              <SgStack direction="row" justify="end">
                <SgButton
                  appearance="solid"
                  severity="primary"
                  shape="rounded"
                  label={t("security.common.save")}
                  loading={saving}
                  disabled={saving}
                  type="submit"
                />
              </SgStack>
            ) : null}
          </SgStack>
        </form>
      )}

      <SgConfirmationDialog
        open={deleteDialogOpen}
        severity="danger"
        title={t("security.roles.list.delete_title")}
        message={t("security.roles.list.delete_message")}
        onCancel={() => {
          setDeleteDialogOpen(false);
        }}
        onConfirm={handleDelete}
      />
    </PageFrame>
  );
}

