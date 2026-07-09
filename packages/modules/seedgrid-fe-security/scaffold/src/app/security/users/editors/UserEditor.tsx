"use client";

import { useEffect, useMemo, useState } from "react";

import {
  SgButton,
  SgConfirmationDialog,
  SgGrid,
  SgInputEmail,
  SgInputPassword,
  SgInputPhone,
  SgStack,
  SgInputText,
  SgToggleSwitch,
  sgWhistle,
} from "@seedgrid/fe-components";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useI18n } from "@/i18n";
import {
  InlineNotice,
  PageFrame,
  PickListField,
  extractApiMessage,
  securityConfig,
  securityService,
  useCompanyManagementEnabledForCurrentHost,
  useCrudPermission,
  type CompanySummary,
  type RoleSummary,
  type UserSummary,
} from "@/modules/security";
import {
  extractSelectionValues,
  extractFirstFormErrorMessage,
  resolveSelectedNumericIds,
  showFormValidationWhistle,
  toPickListOption,
} from "@/modules/security/utils";

type UserEditorProps = {
  publicId?: string;
};

type UserFormValues = {
  email: string;
  name: string;
  password: string;
  whatsApp: string;
  active: boolean;
  changePasswordRequired: boolean;
  roleValues: Array<string | number>;
  companyValues: Array<string | number>;
};

const EMPTY_FORM: UserFormValues = {
  email: "",
  name: "",
  password: "",
  whatsApp: "",
  active: true,
  changePasswordRequired: true,
  roleValues: [],
  companyValues: [],
};

function hasAtLeastTwoWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length >= 2;
}

export function UserEditor({ publicId }: UserEditorProps) {
  const router = useRouter();
  const { t } = useI18n();
  const permissions = useCrudPermission("USER");
  const companiesEnabled = useCompanyManagementEnabledForCurrentHost();
  const isEditing = Boolean(publicId);
  const isReadOnly = isEditing
    ? permissions.canRead && !permissions.canUpdate
    : !permissions.canCreate;
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    trigger,
  } = useForm<UserFormValues>({
    defaultValues: EMPTY_FORM,
  });
  const formValues = watch();

  useEffect(() => {
    if (companiesEnabled == null) {
      return;
    }

    let active = true;
    setLoading(true);

    void (async () => {
      try {
        const [loadedRoles, loadedCompanies, loadedUser] = await Promise.all([
          securityService.listRoles(),
          companiesEnabled
            ? securityService.listAllCompanies()
            : Promise.resolve([]),
          publicId ? securityService.getUser(publicId) : Promise.resolve(null),
        ]);

        if (!active) {
          return;
        }

        setRoles(loadedRoles);
        setCompanies(loadedCompanies);

        if (loadedUser) {
          applyUser(loadedUser);
        } else {
          reset(EMPTY_FORM);
        }
      } catch (error) {
        if (!active) {
          return;
        }

        setLoadError(
          extractApiMessage(error) ?? t("security.users.form.load_error")
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
  }, [companiesEnabled, publicId, reset, t]);

  const roleOptions = useMemo(
    () =>
      roles.map((role) =>
        toPickListOption(
          role.id ?? role.publicId,
          role.description ? `${role.name} - ${role.description}` : role.name,
          role
        )
      ),
    [roles]
  );
  const companyOptions = useMemo(
    () =>
      companies.map((company) =>
        toPickListOption(
          company.id ?? company.publicId,
          company.tradeName ?? company.corporateName ?? company.publicId,
          company
        )
      ),
    [companies]
  );

  function applyUser(user: UserSummary) {
    reset({
      email: user.email ?? "",
      name: user.name ?? "",
      password: "",
      whatsApp: user.whatsApp ?? "",
      active: Boolean(user.active),
      changePasswordRequired: Boolean(user.changePasswordRequired),
      roleValues: extractSelectionValues(user.roles),
      companyValues: user.companies?.length
        ? extractSelectionValues(user.companies)
        : user.companyIds?.length
          ? user.companyIds
          : user.companyPublicIds?.length
            ? user.companyPublicIds
            : [],
    });
  }

  async function handleValidSubmit(values: UserFormValues) {
    if (isReadOnly) {
      return;
    }

    const roleIds = resolveSelectedNumericIds(roles, values.roleValues);
    const companyIds = companiesEnabled
      ? resolveSelectedNumericIds(companies, values.companyValues)
      : [];

    if (!roleIds || (companiesEnabled && !companyIds)) {
      sgWhistle.error({ message: t("security.common.missing_numeric_ids") });
      return;
    }

    setSaving(true);

    try {
      const payload = {
        email: values.email.trim(),
        name: values.name.trim(),
        password: values.password.trim() || undefined,
        whatsApp: values.whatsApp.trim() || undefined,
        roleIds,
        // `?? []` so pra fechar o tipo (number[], nao number[] | null): o guard
        // acima ja retornou cedo quando companyIds era null com companies
        // habilitado; com companies desabilitado ele ja e []. TS nao estreita
        // pela condicao composta, dai o coerce (nunca substitui em runtime).
        companyIds: companyIds ?? [],
        active: values.active,
        changePasswordRequired: values.changePasswordRequired,
      };

      const savedUser = publicId
        ? await securityService.updateUser(publicId, payload)
        : await securityService.createUser(payload);

      sgWhistle.success({ message: t("security.users.form.save_success") });
      router.push(`${securityConfig.routes.users}/${savedUser.publicId}`);
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t("security.users.form.save_error"),
      });
    } finally {
      setSaving(false);
    }
  }

  function handleInvalidSubmit(errors: unknown) {
    const message =
      extractFirstFormErrorMessage(errors) ?? t("security.common.field_required");

    showFormValidationWhistle("security-user-form-validation", message);
  }

  async function handleDelete() {
    if (!publicId) {
      return;
    }

    try {
      await securityService.deleteUser(publicId);
      sgWhistle.success({ message: t("security.users.form.delete_success") });
      router.push(securityConfig.routes.users);
    } catch (error) {
      sgWhistle.error({
        message: extractApiMessage(error) ?? t("security.users.list.delete_error"),
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  }

  return (
    <PageFrame
      title={
        isEditing
          ? t("security.users.form.title_edit")
          : t("security.users.form.title_new")
      }
      description={
        isEditing
          ? t("security.users.form.description_edit")
          : t("security.users.form.description_new")
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
              router.push(securityConfig.routes.users);
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

      {companiesEnabled == null || loading ? (
        <InlineNotice>{t("security.common.loading")}</InlineNotice>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit(handleValidSubmit, handleInvalidSubmit)}
        >
          <SgStack gap={24}>
            <SgGrid minItemWidth={280} gap={16}>
              <SgInputEmail
                id="security-user-email"
                name="email"
                label={t("security.users.form.email")}
                register={register}
                required
                rules={ {
                  required: t("security.common.field_required"),
                }}
                readOnly={isReadOnly}
              />
              <SgInputText
                id="security-user-name"
                name="name"
                label={t("security.users.form.name")}
                register={register}
                required
                minNumberOfWords={2}
                minNumberOfWordsMessage={t("security.users.form.name_min_words")}
                rules={ {
                  required: t("security.common.field_required"),
                  validate: (value) =>
                    hasAtLeastTwoWords(String(value))
                      ? true
                      : t("security.users.form.name_min_words"),
                }}
                readOnly={isReadOnly}
              />
              {!isEditing ? (
                <SgInputPassword
                  id="security-user-password"
                  name="password"
                  label={t("security.users.form.password")}
                  register={register}
                  rules={ {
                    required: t("security.common.field_required"),
                  }}
                  readOnly={isReadOnly}
                />
              ) : null}
              <SgInputPhone
                id="security-user-whatsapp"
                name="whatsApp"
                label={t("security.users.form.whatsapp")}
                register={register}
                readOnly={isReadOnly}
                hintText="(11) 99999-0000"
              />
            </SgGrid>

            <SgGrid minItemWidth={280} gap={16}>
              <SgToggleSwitch
                id="security-user-active"
                name="active"
                label={t("security.users.form.active")}
                control={control}
                readOnly={isReadOnly}
              />
              <SgToggleSwitch
                id="security-user-change-password-required"
                name="changePasswordRequired"
                label={t("security.users.form.change_password_required")}
                control={control}
                readOnly={isReadOnly}
              />
            </SgGrid>

            <SgGrid minItemWidth={320} gap={24}>
              <SgStack gap={12}>
                <PickListField
                  id="security-user-roles"
                  title={t("security.users.form.roles")}
                  sourceHeader={t("security.users.form.roles_available")}
                  targetHeader={t("security.users.form.roles_selected")}
                  options={roleOptions}
                  selectedValues={formValues.roleValues ?? []}
                  onChange={(values) => {
                    setValue("roleValues", values, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                    void trigger("roleValues");
                  }}
                  readOnly={isReadOnly}
                  emptyMessage={t("security.common.no_results")}
                />
              </SgStack>

              {companiesEnabled ? (
                <SgStack gap={12}>
                  <PickListField
                    id="security-user-companies"
                    title={t("security.users.form.companies")}
                    sourceHeader={t("security.users.form.companies_available")}
                    targetHeader={t("security.users.form.companies_selected")}
                    options={companyOptions}
                    selectedValues={formValues.companyValues ?? []}
                    onChange={(values) => {
                      setValue("companyValues", values, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                      void trigger("companyValues");
                    }}
                    readOnly={isReadOnly}
                    emptyMessage={t("security.common.no_results")}
                  />
                </SgStack>
              ) : null}
            </SgGrid>

            <input
              type="hidden"
              {...register("roleValues", {
                validate: (value) =>
                  Array.isArray(value) && value.length > 0
                    ? true
                    : t("security.users.form.roles_required"),
              })}
            />
            {companiesEnabled ? (
              <input
                type="hidden"
                {...register("companyValues", {
                  validate: (value) =>
                    Array.isArray(value) && value.length > 0
                      ? true
                      : t("security.users.form.companies_required"),
                })}
              />
            ) : null}

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
        title={t("security.users.list.delete_title")}
        message={t("security.users.list.delete_message")}
        onCancel={() => {
          setDeleteDialogOpen(false);
        }}
        onConfirm={handleDelete}
      />
    </PageFrame>
  );
}

