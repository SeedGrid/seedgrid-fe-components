"use client";

import { useEffect, useState } from "react";

import {
  SgAutocomplete,
  SgButton,
  SgConfirmationDialog,
  SgGrid,
  SgGroupBox,
  SgInputCNPJ,
  SgInputCPF,
  SgInputEmail,
  SgInputPhone,
  SgInputPostalCode,
  SgInputText,
  SgStack,
  SgToggleSwitch,
  toast,
} from "@seedgrid/fe-components";
import { useRouter } from "next/navigation";
import { type FieldErrors, useForm } from "react-hook-form";

import { useI18n } from "@/i18n";
import {
  InlineNotice,
  PageFrame,
  extractApiMessage,
  securityConfig,
  securityService,
  type CompanySummary,
  useCrudPermission,
} from "@/modules/security";

type CompanyEditorProps = {
  publicId?: string;
};

type CompanyFormValues = {
  cnpj: string;
  corporateName: string;
  tradeName: string;
  active: boolean;
  addrStreet: string;
  addrNumber: string;
  addrComplement: string;
  addrPostalCode: string;
  addrCity: string;
  addrState: string;
  addrDistrict: string;
  addrPhone: string;
  repFirstName: string;
  repLastName: string;
  repCpf: string;
  repPhone: string;
  repWhatsapp: string;
  repEmail: string;
};

const EMPTY_FORM: CompanyFormValues = {
  cnpj: "",
  corporateName: "",
  tradeName: "",
  active: true,
  addrStreet: "",
  addrNumber: "",
  addrComplement: "",
  addrPostalCode: "",
  addrCity: "",
  addrState: "",
  addrDistrict: "",
  addrPhone: "",
  repFirstName: "",
  repLastName: "",
  repCpf: "",
  repPhone: "",
  repWhatsapp: "",
  repEmail: "",
};

const BRAZIL_STATES = [
  { id: "AC", label: "AC - Acre", value: "AC" },
  { id: "AL", label: "AL - Alagoas", value: "AL" },
  { id: "AP", label: "AP - Amapa", value: "AP" },
  { id: "AM", label: "AM - Amazonas", value: "AM" },
  { id: "BA", label: "BA - Bahia", value: "BA" },
  { id: "CE", label: "CE - Ceara", value: "CE" },
  { id: "DF", label: "DF - Distrito Federal", value: "DF" },
  { id: "ES", label: "ES - Espirito Santo", value: "ES" },
  { id: "GO", label: "GO - Goias", value: "GO" },
  { id: "MA", label: "MA - Maranhao", value: "MA" },
  { id: "MT", label: "MT - Mato Grosso", value: "MT" },
  { id: "MS", label: "MS - Mato Grosso do Sul", value: "MS" },
  { id: "MG", label: "MG - Minas Gerais", value: "MG" },
  { id: "PA", label: "PA - Para", value: "PA" },
  { id: "PB", label: "PB - Paraiba", value: "PB" },
  { id: "PR", label: "PR - Parana", value: "PR" },
  { id: "PE", label: "PE - Pernambuco", value: "PE" },
  { id: "PI", label: "PI - Piaui", value: "PI" },
  { id: "RJ", label: "RJ - Rio de Janeiro", value: "RJ" },
  { id: "RN", label: "RN - Rio Grande do Norte", value: "RN" },
  { id: "RS", label: "RS - Rio Grande do Sul", value: "RS" },
  { id: "RO", label: "RO - Rondonia", value: "RO" },
  { id: "RR", label: "RR - Roraima", value: "RR" },
  { id: "SC", label: "SC - Santa Catarina", value: "SC" },
  { id: "SP", label: "SP - Sao Paulo", value: "SP" },
  { id: "SE", label: "SE - Sergipe", value: "SE" },
  { id: "TO", label: "TO - Tocantins", value: "TO" },
] as const;

function readLookupString(value: unknown, ...path: string[]) {
  let current: unknown = value;

  for (const key of path) {
    if (!current || typeof current !== "object") {
      return null;
    }

    current = Reflect.get(current, key);
  }

  return normalizeLookupValue(current);
}

function normalizeLookupValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function resolveLookupValue(nextValue: string | null, currentValue: string) {
  return nextValue ?? currentValue;
}

function joinStreetLine(type: string | null, street: string | null) {
  const parts = [type, street].filter(Boolean);
  return parts.length ? parts.join(" ") : null;
}

function formatPostalCode(value: string | null) {
  const digits = (value ?? "").replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 5) {
    return digits || null;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function formatBrazilPhone(ddd: string | null, phone: string | null) {
  const digits = `${ddd ?? ""}${phone ?? ""}`.replace(/\D/g, "").slice(0, 11);

  if (digits.length < 10) {
    return null;
  }

  const areaCode = digits.slice(0, 2);
  const isMobile = digits.length === 11;
  const firstPart = digits.slice(2, isMobile ? 7 : 6);
  const secondPart = digits.slice(isMobile ? 7 : 6);

  return `(${areaCode}) ${firstPart}-${secondPart}`;
}

function normalizeStateCode(value: string | null | undefined) {
  return typeof value === "string" && value.trim()
    ? value.trim().toUpperCase()
    : null;
}

function searchBrazilStates(query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [...BRAZIL_STATES];
  }

  return BRAZIL_STATES.filter((state) =>
    `${state.id} ${state.label}`.toLowerCase().includes(normalized)
  );
}

export function CompanyEditor({ publicId }: CompanyEditorProps) {
  const router = useRouter();
  const { t } = useI18n();
  const permissions = useCrudPermission("COMPANY");
  const isEditing = Boolean(publicId);
  const isReadOnly = isEditing
    ? permissions.canRead && !permissions.canUpdate
    : !permissions.canCreate;
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
  } = useForm<CompanyFormValues>({
    defaultValues: EMPTY_FORM,
  });
  const formValues = watch();

  useEffect(() => {
    let active = true;
    setLoading(true);

    void (async () => {
      try {
        if (!publicId) {
          reset(EMPTY_FORM);
          return;
        }

        const company = await securityService.getCompany(publicId);

        if (!active) {
          return;
        }

        reset({
          cnpj: company.cnpj ?? "",
          corporateName: company.corporateName ?? "",
          tradeName: company.tradeName ?? "",
          active: Boolean(company.active),
          addrStreet: company.addrStreet ?? "",
          addrNumber: company.addrNumber ?? "",
          addrComplement: company.addrComplement ?? "",
          addrPostalCode: company.addrPostalCode ?? "",
          addrCity: company.addrCity ?? "",
          addrState: company.addrState ?? "",
          addrDistrict: company.addrDistrict ?? "",
          addrPhone: company.addrPhone ?? "",
          repFirstName: company.repFirstName ?? "",
          repLastName: company.repLastName ?? "",
          repCpf: company.repCpf ?? "",
          repPhone: company.repPhone ?? "",
          repWhatsapp: company.repWhatsapp ?? "",
          repEmail: company.repEmail ?? "",
        });
      } catch (error) {
        if (!active) {
          return;
        }

        setLoadError(
          extractApiMessage(error) ?? t("security.companies.form.load_error")
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

  function handlePublicaCnpjResult(data: unknown | null) {
    setValue(
      "corporateName",
      resolveLookupValue(
        readLookupString(data, "razao_social"),
        formValues.corporateName
      )
    );
    setValue(
      "tradeName",
      resolveLookupValue(
        readLookupString(data, "estabelecimento", "nome_fantasia"),
        formValues.tradeName
      )
    );
    setValue(
      "addrStreet",
      resolveLookupValue(
        joinStreetLine(
          readLookupString(data, "estabelecimento", "tipo_logradouro"),
          readLookupString(data, "estabelecimento", "logradouro")
        ),
        formValues.addrStreet
      )
    );
    setValue(
      "addrNumber",
      resolveLookupValue(
        readLookupString(data, "estabelecimento", "numero"),
        formValues.addrNumber
      )
    );
    setValue(
      "addrComplement",
      resolveLookupValue(
        readLookupString(data, "estabelecimento", "complemento"),
        formValues.addrComplement
      )
    );
    setValue(
      "addrDistrict",
      resolveLookupValue(
        readLookupString(data, "estabelecimento", "bairro"),
        formValues.addrDistrict
      )
    );
    setValue(
      "addrPostalCode",
      resolveLookupValue(
        formatPostalCode(readLookupString(data, "estabelecimento", "cep")),
        formValues.addrPostalCode
      )
    );
    setValue(
      "addrCity",
      resolveLookupValue(
        readLookupString(data, "estabelecimento", "cidade", "nome"),
        formValues.addrCity
      )
    );
    setValue(
      "addrState",
      resolveLookupValue(
        normalizeStateCode(
          readLookupString(data, "estabelecimento", "estado", "sigla")
        ),
        formValues.addrState
      )
    );
    setValue(
      "addrPhone",
      resolveLookupValue(
        formatBrazilPhone(
          readLookupString(data, "estabelecimento", "ddd1"),
          readLookupString(data, "estabelecimento", "telefone1")
        ),
        formValues.addrPhone
      )
    );
  }

  function handleViaCepResult(data: {
    erro?: boolean;
    logradouro?: string;
    complemento?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
  }) {
    if (data.erro) {
      return;
    }

    setValue(
      "addrStreet",
      resolveLookupValue(
        normalizeLookupValue(data.logradouro),
        formValues.addrStreet
      )
    );
    setValue(
      "addrComplement",
      resolveLookupValue(
        normalizeLookupValue(data.complemento),
        formValues.addrComplement
      )
    );
    setValue(
      "addrDistrict",
      resolveLookupValue(
        normalizeLookupValue(data.bairro),
        formValues.addrDistrict
      )
    );
    setValue(
      "addrState",
      resolveLookupValue(normalizeStateCode(data.uf), formValues.addrState)
    );
    setValue(
      "addrCity",
      resolveLookupValue(
        normalizeLookupValue(data.localidade),
        formValues.addrCity
      )
    );
  }

  async function handleValidSubmit(values: CompanyFormValues) {
    if (isReadOnly) {
      return;
    }

    setSaving(true);

    try {
      const payload = {
        cnpj: values.cnpj.trim() || undefined,
        corporateName: values.corporateName.trim(),
        tradeName: values.tradeName.trim(),
        active: values.active,
        addrStreet: values.addrStreet.trim() || undefined,
        addrNumber: values.addrNumber.trim() || undefined,
        addrComplement: values.addrComplement.trim() || undefined,
        addrPostalCode: values.addrPostalCode.trim() || undefined,
        addrCity: values.addrCity.trim() || undefined,
        addrState: values.addrState.trim() || undefined,
        addrDistrict: values.addrDistrict.trim() || undefined,
        addrPhone: values.addrPhone.trim() || undefined,
        repFirstName: values.repFirstName.trim() || undefined,
        repLastName: values.repLastName.trim() || undefined,
        repCpf: values.repCpf.trim() || undefined,
        repPhone: values.repPhone.trim() || undefined,
        repWhatsapp: values.repWhatsapp.trim() || undefined,
        repEmail: values.repEmail.trim() || undefined,
      };

      const savedCompany = publicId
        ? await securityService.updateCompany(publicId, payload)
        : await securityService.createCompany(payload);

      toast.success(t("security.companies.form.save_success"));
      router.push(`${securityConfig.routes.companies}/${savedCompany.publicId}`);
    } catch (error) {
      toast.error(
        extractApiMessage(error) ?? t("security.companies.form.save_error")
      );
    } finally {
      setSaving(false);
    }
  }

  function handleInvalidSubmit(fieldErrors: FieldErrors<CompanyFormValues>) {
    const firstMessage =
      fieldErrors.cnpj?.message ??
      fieldErrors.corporateName?.message ??
      fieldErrors.tradeName?.message ??
      fieldErrors.addrPostalCode?.message ??
      fieldErrors.addrState?.message ??
      fieldErrors.repCpf?.message ??
      fieldErrors.repEmail?.message;

    if (firstMessage) {
      toast.error(String(firstMessage));
    }
  }

  async function handleDelete() {
    if (!publicId) {
      return;
    }

    try {
      await securityService.deleteCompany(publicId);
      toast.success(t("security.companies.form.delete_success"));
      router.push(securityConfig.routes.companies);
    } catch (error) {
      toast.error(
        extractApiMessage(error) ?? t("security.companies.list.delete_error")
      );
    } finally {
      setDeleteDialogOpen(false);
    }
  }

  return (
    <PageFrame
      title={
        isEditing
          ? t("security.companies.form.title_edit")
          : t("security.companies.form.title_new")
      }
      description={
        isEditing
          ? t("security.companies.form.description_edit")
          : t("security.companies.form.description_new")
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
              router.push(securityConfig.routes.companies);
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
            <SgInputCNPJ
              id="security-company-cnpj"
              name="cnpj"
              label={t("security.companies.form.cnpj")}
              register={register}
              hintText={t("security.companies.form.cnpj")}
              required
              rules={ {
                required: t("security.common.field_required"),
              }}
              validateOnBlur
              validateWithPublicaCnpj
              publicaCnpjErrorMessage={t(
                "security.companies.form.cnpj_lookup_error"
              )}
              onPublicaCnpjResult={handlePublicaCnpjResult}
              readOnly={isReadOnly}
            />
            <SgInputText
              id="security-company-corporate-name"
              name="corporateName"
              label={t("security.companies.form.corporate_name")}
              register={register}
              hintText={t("security.companies.form.corporate_name")}
              required
              rules={ {
                required: t("security.common.field_required"),
              }}
              readOnly={isReadOnly}
            />
            <SgInputText
              id="security-company-trade-name"
              name="tradeName"
              label={t("security.companies.form.trade_name")}
              register={register}
              hintText={t("security.companies.form.trade_name")}
              required
              rules={ {
                required: t("security.common.field_required"),
              }}
              readOnly={isReadOnly}
            />
            <SgToggleSwitch
              id="security-company-active"
              name="active"
              label={t("security.companies.form.active")}
              control={control}
              readOnly={isReadOnly}
            />
            </SgGrid>

          <SgGroupBox title={t("security.companies.form.address_section")}>
            <SgGrid minItemWidth={220} gap={16}>
              <SgInputPostalCode
                id="security-company-addr-postal-code"
                name="addrPostalCode"
                label={t("security.companies.form.addr_postal_code")}
                register={register}
                hintText={t("security.companies.form.addr_postal_code")}
                validateOnBlur
                validateWithViaCep
                viaCepErrorMessage={t(
                  "security.companies.form.postal_code_lookup_error"
                )}
                onViaCepResult={handleViaCepResult}
                readOnly={isReadOnly}
              />
              <SgInputText
                id="security-company-addr-street"
                name="addrStreet"
                label={t("security.companies.form.addr_street")}
                register={register}
                hintText={t("security.companies.form.addr_street")}
                readOnly={isReadOnly}
              />
              <SgInputText
                id="security-company-addr-number"
                name="addrNumber"
                label={t("security.companies.form.addr_number")}
                register={register}
                hintText={t("security.companies.form.addr_number")}
                readOnly={isReadOnly}
              />
              <SgAutocomplete
                id="security-company-addr-state"
                name="addrState"
                label={t("security.companies.form.addr_state")}
                control={control}
                hintText={t("security.companies.form.addr_state")}
                source={searchBrazilStates}
                minLengthForSearch={0}
                openOnFocus
                showDropDownButton
                readOnly={isReadOnly}
                required
                rules={ {
                  required: t("security.common.field_required"),
                }}
                onSelect={(item) => {
                  setValue("addrState", String(item.value ?? item.id), {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                  setValue("addrCity", "", {
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }}
                formatSelection={(item) => String(item.value ?? item.id)}
                renderItem={(item) => (
                  <SgStack direction="row" justify="between" align="center" gap={12}>
                    <span>{item.label}</span>
                    <span className="text-xs text-slate-400">
                      {String(item.value ?? item.id)}
                    </span>
                  </SgStack>
                )}
              />
              <SgInputText
                id="security-company-addr-city"
                name="addrCity"
                label={t("security.companies.form.addr_city")}
                register={register}
                hintText={t("security.companies.form.addr_city")}
                readOnly={isReadOnly}
              />
              <SgInputText
                id="security-company-addr-district"
                name="addrDistrict"
                label={t("security.companies.form.addr_district")}
                register={register}
                hintText={t("security.companies.form.addr_district")}
                readOnly={isReadOnly}
              />
              <SgInputText
                id="security-company-addr-complement"
                name="addrComplement"
                label={t("security.companies.form.addr_complement")}
                register={register}
                hintText={t("security.companies.form.addr_complement")}
                readOnly={isReadOnly}
              />
              <SgInputPhone
                id="security-company-addr-phone"
                name="addrPhone"
                label={t("security.companies.form.addr_phone")}
                register={register}
                hintText="(11) 99999-0000"
                readOnly={isReadOnly}
              />
            </SgGrid>
          </SgGroupBox>

          <SgGroupBox
            title={t("security.companies.form.legal_representative_section")}
          >
            <SgGrid minItemWidth={220} gap={16}>
              <SgInputCPF
                id="security-company-rep-cpf"
                name="repCpf"
                label={t("security.companies.form.rep_cpf")}
                register={register}
                hintText={t("security.companies.form.rep_cpf")}
                readOnly={isReadOnly}
              />
              <SgInputText
                id="security-company-rep-first-name"
                name="repFirstName"
                label={t("security.companies.form.rep_first_name")}
                register={register}
                hintText={t("security.companies.form.rep_first_name")}
                readOnly={isReadOnly}
              />
              <SgInputText
                id="security-company-rep-last-name"
                name="repLastName"
                label={t("security.companies.form.rep_last_name")}
                register={register}
                hintText={t("security.companies.form.rep_last_name")}
                readOnly={isReadOnly}
              />
              <SgInputPhone
                id="security-company-rep-phone"
                name="repPhone"
                label={t("security.companies.form.rep_phone")}
                register={register}
                hintText="(11) 99999-0000"
                readOnly={isReadOnly}
              />
              <SgInputPhone
                id="security-company-rep-whatsapp"
                name="repWhatsapp"
                label={t("security.companies.form.rep_whatsapp")}
                register={register}
                hintText="(11) 99999-0000"
                readOnly={isReadOnly}
              />
              <SgInputEmail
                id="security-company-rep-email"
                name="repEmail"
                label={t("security.companies.form.rep_email")}
                register={register}
                hintText={t("security.companies.form.rep_email")}
                readOnly={isReadOnly}
              />
            </SgGrid>
          </SgGroupBox>

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
        title={t("security.companies.list.delete_title")}
        message={t("security.companies.list.delete_message")}
        onCancel={() => {
          setDeleteDialogOpen(false);
        }}
        onConfirm={handleDelete}
      />
    </PageFrame>
  );
}

