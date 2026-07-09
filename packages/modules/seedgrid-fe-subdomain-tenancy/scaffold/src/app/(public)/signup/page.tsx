"use client";

// seedgrid:managed

import { useEffect, useRef, useState } from "react";

import {
  SgAccordion,
  SgAutocomplete,
  SgBadge,
  SgButton,
  SgCard,
  SgGrid,
  SgInputBirthDate,
  SgInputCNPJ,
  SgInputCPF,
  SgInputEmail,
  SgInputOTP,
  SgInputPassword,
  SgInputPhone,
  SgInputPostalCode,
  SgPanel,
  SgStack,
  SgInputText,
  SgWizard,
  SgWizardPage,
  toast,
  type ViaCepResponse,
} from "@seedgrid/fe-components";
import {
  Building2,
  MailCheck,
  MapPinned,
  RefreshCcw,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import { appEnvironment } from "@/config/environment";
import { useI18n, type Translator } from "@/i18n";
import { captureException } from "@/modules/core";
import { createPublicTenantAction } from "@/modules/subdomain-tenancy/server/create-public-tenant-action";
import { resendPublicTenantActivationEmailAction } from "@/modules/subdomain-tenancy/server/resend-public-tenant-activation-email-action";
import { validatePublicTenantEmailAction } from "@/modules/subdomain-tenancy/server/validate-public-tenant-email-action";
import { normalizeSubdomain, validateSubdomain } from "@seedgrid/fe-subdomain-tenancy";
import {
  buildCreatePublicTenantPayload,
  createEmptyPublicTenantSignupForm,
  type CreatePublicTenantActionResult,
  type PublicTenantSignupFormValues,
} from "@/modules/subdomain-tenancy/signup/types";

const TENANT_HOST_SUFFIX = appEnvironment.hosts.tenantHostSuffix;
const DEPLOYMENT_PROTOCOL = appEnvironment.deployment.protocol;

type LocationOption = {
  id: string;
  label: string;
  value?: string;
  data?: {
    stateId?: string;
    cityId?: string;
  };
};

async function fetchLocationOptions(path: string): Promise<LocationOption[]> {
  try {
    const response = await fetch(path, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const payload = await response.json();
    return Array.isArray(payload) ? (payload as LocationOption[]) : [];
  } catch {
    return [];
  }
}

function searchBrazilStates(query: string) {
  return fetchLocationOptions(
    `/api/locations/states?query=${encodeURIComponent(query)}`
  );
}

function searchBrazilCities(query: string, stateId: string) {
  if (!stateId) {
    return Promise.resolve([]);
  }

  return fetchLocationOptions(
    `/api/locations/cities?stateId=${encodeURIComponent(stateId)}&query=${encodeURIComponent(query)}`
  );
}

export default function TenantSignupPage() {
  const { t } = useI18n();
  const [formValues, setFormValues] = useState<PublicTenantSignupFormValues>(
    createEmptyPublicTenantSignupForm()
  );
  const [selectedAddressStateId, setSelectedAddressStateId] = useState("");
  const [submissionResult, setSubmissionResult] =
    useState<CreatePublicTenantActionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [emailVerificationError, setEmailVerificationError] = useState<
    string | null
  >(null);
  const [isValidatingVerificationEmail, setIsValidatingVerificationEmail] =
    useState(false);
  const [isResendingVerificationEmail, setIsResendingVerificationEmail] =
    useState(false);
  const lastSubmittedEmailVerificationCodeRef = useRef<string | null>(null);
  const successResult =
    submissionResult && submissionResult.ok ? submissionResult : null;
  const errorResult =
    submissionResult && !submissionResult.ok ? submissionResult : null;
  const emailVerificationDigits = emailVerificationCode.replace(/\D/g, "");
  const isEmailVerificationCodeComplete =
    emailVerificationDigits.length === 6;
  const productName = formatProductName(
    appEnvironment.namespace,
    t("multitenancy.signup.product.fallback")
  );
  const emptyValue = t("common.empty");

  const updateValue = (
    key: keyof PublicTenantSignupFormValues,
    value: string
  ) => {
    setFormValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (!successResult || !isEmailVerificationCodeComplete) {
      return;
    }

    if (isValidatingVerificationEmail) {
      return;
    }

    if (lastSubmittedEmailVerificationCodeRef.current === emailVerificationDigits) {
      return;
    }

    const tenantSubdomain = successResult.tenantSubdomain;
    lastSubmittedEmailVerificationCodeRef.current = emailVerificationDigits;

    void (async () => {
      setIsValidatingVerificationEmail(true);
      setEmailVerificationError(null);

      try {
        const result = await validatePublicTenantEmailAction({
          subdomain: tenantSubdomain,
          code: emailVerificationDigits,
        });

        if (result.ok) {
          window.location.assign(buildTenantLoginUrl(tenantSubdomain));
          return;
        }

        setEmailVerificationError(result.message);
        toast.error(result.message);
      } catch (error) {
        await captureException(error, {
          area: "client",
          source: "multitenancy.signup.page.validateVerificationEmail",
        });

        const message = t("multitenancy.signup.feedback.validate_unavailable");
        setEmailVerificationError(message);
        toast.error(message);
      } finally {
        setIsValidatingVerificationEmail(false);
      }
    })();
  }, [
    emailVerificationDigits,
    isEmailVerificationCodeComplete,
    isValidatingVerificationEmail,
    successResult,
    t,
  ]);

  useEffect(() => {
    const stateCode = formValues.addressState.trim().toUpperCase();

    if (!stateCode) {
      setSelectedAddressStateId("");
      return;
    }

    let isActive = true;

    void (async () => {
      const options = await searchBrazilStates(stateCode);
      const matched = options.find(
        (item) => String(item.value ?? item.id).trim().toUpperCase() === stateCode
      );

      if (!isActive) {
        return;
      }

      setSelectedAddressStateId(
        matched ? String((matched.data as Record<string, unknown>)?.stateId ?? matched.id ?? "") : ""
      );
    })();

    return () => {
      isActive = false;
    };
  }, [formValues.addressState]);

  async function handleFinish() {
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const result = await createPublicTenantAction(
        buildCreatePublicTenantPayload(formValues)
      );
      setSubmissionResult(result);
    } catch (error) {
      await captureException(error, {
        area: "client",
        source: "multitenancy.signup.page",
      });
      setSubmissionResult({
        ok: false,
        message: t("multitenancy.signup.feedback.submit_unavailable"),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendVerificationEmail() {
    if (!successResult || isResendingVerificationEmail) {
      return;
    }

    setIsResendingVerificationEmail(true);

    try {
      const result = await resendPublicTenantActivationEmailAction(
        successResult.tenantSubdomain
      );

      if (result.ok) {
        setEmailVerificationCode("");
        setEmailVerificationError(null);
        lastSubmittedEmailVerificationCodeRef.current = null;
        toast.info(result.message);
        return;
      }

      toast.error(result.message);
    } catch (error) {
      await captureException(error, {
        area: "client",
        source: "multitenancy.signup.page.resendVerificationEmail",
      });
      toast.error(t("multitenancy.signup.feedback.resend_unavailable"));
    } finally {
      setIsResendingVerificationEmail(false);
    }
  }

  function handleEmailVerificationCodeChange(value: string) {
    setEmailVerificationCode(value);
    setEmailVerificationError(null);

    if (value.replace(/\D/g, "").length < 6) {
      lastSubmittedEmailVerificationCodeRef.current = null;
    }
  }

  function handlePublicaCnpjResult(data: unknown | null) {
    setFormValues((current) => ({
      ...current,
      corporateName: resolveLookupValue(
        readLookupString(data, "razao_social"),
        current.corporateName
      ),
      tradeName: resolveLookupValue(
        readLookupString(data, "estabelecimento", "nome_fantasia"),
        current.tradeName
      ),
      addressStreet: resolveLookupValue(
        joinStreetLine(
          readLookupString(data, "estabelecimento", "tipo_logradouro"),
          readLookupString(data, "estabelecimento", "logradouro")
        ),
        current.addressStreet
      ),
      addressNumber: resolveLookupValue(
        readLookupString(data, "estabelecimento", "numero"),
        current.addressNumber
      ),
      addressComplement: resolveLookupValue(
        readLookupString(data, "estabelecimento", "complemento"),
        current.addressComplement
      ),
      addressDistrict: resolveLookupValue(
        readLookupString(data, "estabelecimento", "bairro"),
        current.addressDistrict
      ),
      addressPostalCode: resolveLookupValue(
        formatPostalCode(readLookupString(data, "estabelecimento", "cep")),
        current.addressPostalCode
      ),
      addressCity: resolveLookupValue(
        readLookupString(data, "estabelecimento", "cidade", "nome"),
        current.addressCity
      ),
      addressState: resolveLookupValue(
        normalizeStateCode(
          readLookupString(data, "estabelecimento", "estado", "sigla")
        ),
        current.addressState
      ),
      addressPhone: resolveLookupValue(
        formatBrazilPhone(
          readLookupString(data, "estabelecimento", "ddd1"),
          readLookupString(data, "estabelecimento", "telefone1")
        ),
        current.addressPhone
      ),
    }));
  }

  function handleViaCepResult(data: ViaCepResponse) {
    if (data.erro) {
      return;
    }

    setFormValues((current) => ({
      ...current,
      addressStreet: resolveLookupValue(
        normalizeLookupValue(data.logradouro),
        current.addressStreet
      ),
      addressComplement: resolveLookupValue(
        normalizeLookupValue(data.complemento),
        current.addressComplement
      ),
      addressDistrict: resolveLookupValue(
        normalizeLookupValue(data.bairro),
        current.addressDistrict
      ),
      addressCity: resolveLookupValue(
        normalizeLookupValue(data.localidade),
        current.addressCity
      ),
      addressState: resolveLookupValue(
        normalizeStateCode(data.uf),
        current.addressState
      ),
    }));
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-950 sm:px-6 sm:py-10">
      <SgStack className="mx-auto w-full max-w-5xl" gap={20}>
        <SgCard
          cardStyle="elevated"
          size="lg"
          className="border border-white/70 bg-white/90 backdrop-blur"
          headerClassName="border-b border-slate-200/80"
          title={
            <div className="min-w-0">
              <div className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                {t("multitenancy.signup.header.eyebrow")}
              </div>
              <div className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">
                {t("multitenancy.signup.header.title", { productName })}
              </div>
            </div>
          }
        >
          {successResult ? (
            <SgStack gap={20}>
              <SgPanel className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-6">
                <SgStack direction="row" align="start" gap={16}>
                  <div className="rounded-2xl bg-emerald-600 p-3 text-white">
                    <MailCheck className="size-6" />
                  </div>
                  <SgStack gap={8}>
                    <SgBadge
                      value={t("multitenancy.signup.verification.badge")}
                      severity="success"
                      badgeStyle="soft"
                      rounded
                    />
                    <h2 className="text-2xl font-semibold text-emerald-950">
                      {t("multitenancy.signup.verification.title")}
                    </h2>
                    <p className="text-sm leading-6 text-emerald-900/80">
                      {t("multitenancy.signup.verification.description", {
                        email: successResult.rootEmail,
                        tenantHost: buildTenantHost(successResult.tenantSubdomain),
                      })}
                    </p>
                  </SgStack>
                </SgStack>
              </SgPanel>

              <SgPanel className="rounded-[28px] border border-slate-200 bg-white p-5 sm:p-6">
                <SgGrid minItemWidth={320} gap={16} align="end">
                  <SgInputOTP
                    id="tenant-email-verification-code"
                    label={t("multitenancy.signup.verification.code.label")}
                    hintText={t("multitenancy.signup.verification.code.hint")}
                    mask="999-999"
                    width="100%"
                    required
                    requiredMessage={t(
                      "multitenancy.signup.verification.code.required"
                    )}
                    validateOnBlur
                    validation={(rawValue) =>
                      rawValue.replace(/\D/g, "").length === 6
                        ? null
                        : t("multitenancy.signup.verification.code.invalid")
                    }
                    value={emailVerificationCode}
                    onChange={handleEmailVerificationCodeChange}
                    inputProps={{
                      autoComplete: "one-time-code",
                      disabled: isValidatingVerificationEmail,
                      inputMode: "numeric",
                    }}
                  />

                  <SgStack direction="row" wrap gap={12}>
                    <SgButton
                      appearance="outline"
                      severity="primary"
                      shape="rounded"
                      label={t("multitenancy.signup.verification.resend")}
                      disabled={isValidatingVerificationEmail}
                      loading={isResendingVerificationEmail}
                      type="button"
                      leftIcon={<RefreshCcw className="size-4" />}
                      onClick={handleResendVerificationEmail}
                    />
                  </SgStack>
                </SgGrid>

                <div
                  aria-live="polite"
                  className={`mt-3 text-sm leading-6 ${
                    emailVerificationError
                      ? "text-rose-700"
                      : isValidatingVerificationEmail
                        ? "text-sky-700"
                        : "text-slate-500"
                  }`}
                >
                  {emailVerificationError
                    ? emailVerificationError
                    : isValidatingVerificationEmail
                      ? t("multitenancy.signup.verification.validating")
                      : t("multitenancy.signup.verification.idle")}
                </div>
              </SgPanel>

              <SummaryGrid values={formValues} t={t} emptyValue={emptyValue} />

              <SgStack direction="row" wrap gap={12}>
                <SgButton
                  appearance="solid"
                  severity="primary"
                  shape="rounded"
                  label={t("multitenancy.signup.verification.back")}
                  type="button"
                  onClick={() => {
                    window.location.assign(buildProductUrl());
                  }}
                />
              </SgStack>
            </SgStack>
          ) : (
            <SgStack gap={20}>
              {errorResult ? (
                <SgPanel className="rounded-[24px] border border-rose-200 bg-rose-50 p-4">
                  <SgStack direction="row" wrap align="center" gap={12}>
                    <p className="text-sm leading-6 text-rose-900">
                      {errorResult.message}
                    </p>
                  </SgStack>
                </SgPanel>
              ) : null}

              <SgWizard
                stepper="icons"
                labels={{
                  previous: t("multitenancy.signup.wizard.previous"),
                  next: t("multitenancy.signup.wizard.next"),
                  finish: isSubmitting
                    ? t("multitenancy.signup.wizard.finishing")
                    : t("multitenancy.signup.wizard.finish"),
                }}
                onFinish={handleFinish}
                className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-3 sm:rounded-[32px] sm:p-5"
              >
                <SgWizardPage
                  title={t("multitenancy.signup.steps.company")}
                  icon={<Building2 className="size-5" />}
                >
                  <SgStack gap={20}>
                    <SgStack gap={16}>
                      <SgInputCNPJ
                        id="tenant-cnpj"
                        label={t("multitenancy.signup.fields.cnpj.label")}
                        required
                        requiredMessage={t(
                          "multitenancy.signup.fields.cnpj.required"
                        )}
                        validateOnBlur
                        validateWithPublicaCnpj
                        publicaCnpjErrorMessage={t(
                          "multitenancy.signup.fields.cnpj.lookup_error"
                        )}
                        onPublicaCnpjResult={handlePublicaCnpjResult}
                        onPublicaCnpjError={(error) => {
                          void captureException(error, {
                            area: "client",
                            source: "multitenancy.signup.page.publicaCnpj",
                          });
                        }}
                        inputProps={{
                          value: formValues.cnpj,
                          onChange: (event) =>
                            updateValue("cnpj", event.target.value),
                        }}
                      />
                      <SgInputText
                        id="tenant-subdomain"
                        label={t("multitenancy.signup.fields.subdomain.label")}
                        hintText={t("multitenancy.signup.fields.subdomain.hint", {
                          deploymentProtocol: DEPLOYMENT_PROTOCOL,
                          tenantHostSuffix: TENANT_HOST_SUFFIX,
                        })}
                        required
                        requiredMessage={t(
                          "multitenancy.signup.fields.subdomain.required"
                        )}
                        validateOnBlur
                        prefixText={`${DEPLOYMENT_PROTOCOL}://`}
                        suffixText={`.${TENANT_HOST_SUFFIX}`}
                        validation={(value) => validateSubdomain(value, t)}
                        inputProps={{
                          value: formValues.subdomain,
                          onChange: (event) =>
                            updateValue(
                              "subdomain",
                              normalizeSubdomain(event.target.value)
                            ),
                        }}
                      />
                      <SgInputText
                        id="tenant-corporate-name"
                        label={t(
                          "multitenancy.signup.fields.corporate_name.label"
                        )}
                        required
                        requiredMessage={t(
                          "multitenancy.signup.fields.corporate_name.required"
                        )}
                        validateOnBlur
                        inputProps={{
                          value: formValues.corporateName,
                          onChange: (event) =>
                            updateValue("corporateName", event.target.value),
                        }}
                      />
                      <SgInputText
                        id="tenant-trade-name"
                        label={t("multitenancy.signup.fields.trade_name.label")}
                        required
                        requiredMessage={t(
                          "multitenancy.signup.fields.trade_name.required"
                        )}
                        validateOnBlur
                        inputProps={{
                          value: formValues.tradeName,
                          onChange: (event) =>
                            updateValue("tradeName", event.target.value),
                        }}
                      />
                      <SgInputPhone
                        id="tenant-address-phone"
                        label={t("multitenancy.signup.fields.address_phone.label")}
                        required
                        requiredMessage={t(
                          "multitenancy.signup.fields.address_phone.required"
                        )}
                        validateOnBlur
                        inputProps={{
                          value: formValues.addressPhone,
                          onChange: (event) =>
                            updateValue("addressPhone", event.target.value),
                        }}
                      />
                    </SgStack>

                    <SgPanel className="rounded-[24px] border border-slate-200 bg-white p-4">
                      <SgStack gap={8}>
                        <div className="text-sm font-semibold text-slate-900">
                          {t("multitenancy.signup.fields.subdomain.rules.title")}
                        </div>
                        <SgStack gap={4} className="text-sm leading-6 text-slate-600">
                          <p>
                          {t(
                            "multitenancy.signup.fields.subdomain.rules.characters"
                          )}
                          </p>
                          <p>
                            {t("multitenancy.signup.fields.subdomain.rules.host", {
                              deploymentProtocol: DEPLOYMENT_PROTOCOL,
                              tenantHost:
                                formValues.subdomain.trim().length > 0
                                  ? buildTenantHost(formValues.subdomain)
                                  : TENANT_HOST_SUFFIX,
                            })}
                          </p>
                        </SgStack>
                      </SgStack>
                    </SgPanel>
                  </SgStack>
                </SgWizardPage>
                <SgWizardPage
                  title={t("multitenancy.signup.steps.address")}
                  icon={<MapPinned className="size-5" />}
                >
                  <SgStack gap={16}>
                    <SgInputPostalCode
                      id="tenant-address-postal-code"
                      label={t("multitenancy.signup.fields.postal_code.label")}
                      required
                      requiredMessage={t(
                        "multitenancy.signup.fields.postal_code.required"
                      )}
                      validateOnBlur
                      validateWithViaCep
                      viaCepErrorMessage={t(
                        "multitenancy.signup.fields.postal_code.lookup_error"
                      )}
                      onViaCepResult={handleViaCepResult}
                      onViaCepError={(error) => {
                        void captureException(error, {
                          area: "client",
                          source: "multitenancy.signup.page.viaCep",
                        });
                      }}
                      inputProps={{
                        value: formValues.addressPostalCode,
                        onChange: (event) =>
                          updateValue("addressPostalCode", event.target.value),
                      }}
                    />
                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_120px]">
                      <SgInputText
                        id="tenant-address-street"
                        label={t("multitenancy.signup.fields.street.label")}
                        required
                        requiredMessage={t(
                          "multitenancy.signup.fields.street.required"
                        )}
                        maxLength={60}
                        validateOnBlur
                        inputProps={{
                          value: formValues.addressStreet,
                          onChange: (event) =>
                            updateValue("addressStreet", event.target.value),
                        }}
                      />
                      <SgInputText
                        id="tenant-address-number"
                        label={t("multitenancy.signup.fields.number.label")}
                        required
                        requiredMessage={t(
                          "multitenancy.signup.fields.number.required"
                        )}
                        maxLength={6}
                        validateOnBlur
                        inputProps={{
                          inputMode: "numeric",
                          value: formValues.addressNumber,
                          onChange: (event) =>
                            updateValue(
                              "addressNumber",
                              event.target.value.replace(/\D/g, "").slice(0, 6)
                            ),
                        }}
                      />
                    </div>
                    <SgInputText
                      id="tenant-address-complement"
                      label={t("multitenancy.signup.fields.complement.label")}
                      inputProps={{
                        value: formValues.addressComplement,
                        onChange: (event) =>
                          updateValue("addressComplement", event.target.value),
                      }}
                    />
                    <SgInputText
                      id="tenant-address-district"
                      label={t("multitenancy.signup.fields.district.label")}
                      required
                      requiredMessage={t(
                        "multitenancy.signup.fields.district.required"
                      )}
                      validateOnBlur
                      inputProps={{
                        value: formValues.addressDistrict,
                        onChange: (event) =>
                          updateValue("addressDistrict", event.target.value),
                      }}
                    />
                    <SgGrid minItemWidth={220} gap={16}>
                      <SgAutocomplete
                        id="tenant-address-state"
                        label={t("multitenancy.signup.fields.state.label")}
                        hintText={t("multitenancy.signup.fields.state.label")}
                        source={searchBrazilStates}
                        minLengthForSearch={0}
                        openOnFocus
                        showDropDownButton
                        required
                        onSelect={(item) => {
                          const nextStateCode = String(item.value ?? item.id)
                            .trim()
                            .toUpperCase();
                          const nextStateId = String(
                            (item.data as Record<string, unknown>)?.stateId ?? item.id ?? ""
                          );

                          setSelectedAddressStateId(nextStateId);
                          setFormValues((current) => ({
                            ...current,
                            addressState: nextStateCode,
                            addressCity: "",
                          }));
                        }}
                        formatSelection={(item) => String(item.value ?? item.id)}
                        renderItem={(item) => (
                          <SgStack
                            direction="row"
                            justify="between"
                            align="center"
                            gap={12}
                          >
                            <span>{item.label}</span>
                            <span className="text-xs text-slate-400">
                              {String(item.value ?? item.id)}
                            </span>
                          </SgStack>
                        )}
                      />
                      <SgAutocomplete
                        id="tenant-address-city"
                        label={t("multitenancy.signup.fields.city.label")}
                        hintText={t("multitenancy.signup.fields.city.label")}
                        source={(query) =>
                          searchBrazilCities(query, selectedAddressStateId)
                        }
                        minLengthForSearch={0}
                        openOnFocus
                        showDropDownButton
                        required
                        onSelect={(item) => {
                          updateValue(
                            "addressCity",
                            String(item.value ?? item.label ?? item.id)
                          );
                        }}
                        formatSelection={(item) =>
                          String(item.value ?? item.label ?? item.id)
                        }
                      />
                    </SgGrid>
                  </SgStack>
                </SgWizardPage>

                <SgWizardPage
                  title={t("multitenancy.signup.steps.responsible")}
                  icon={<ShieldCheck className="size-5" />}
                >
                  <SgStack gap={16}>
                    <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1.35fr)_minmax(0,1fr)]">
                      <SgInputCPF
                        id="tenant-legal-cpf"
                        label={t("multitenancy.signup.fields.cpf.label")}
                        required
                        requiredMessage={t(
                          "multitenancy.signup.fields.cpf.required"
                        )}
                        validateOnBlur
                        inputProps={{
                          value: formValues.legalCpf,
                          onChange: (event) =>
                            updateValue("legalCpf", event.target.value),
                        }}
                      />
                      <SgInputText
                        id="tenant-legal-first-name"
                        label={t("multitenancy.signup.fields.first_name.label")}
                        required
                        requiredMessage={t(
                          "multitenancy.signup.fields.first_name.required"
                        )}
                        validateOnBlur
                        inputProps={{
                          value: formValues.legalFirstName,
                          onChange: (event) =>
                            updateValue("legalFirstName", event.target.value),
                        }}
                      />
                      <SgInputText
                        id="tenant-legal-last-name"
                        label={t("multitenancy.signup.fields.last_name.label")}
                        required
                        requiredMessage={t(
                          "multitenancy.signup.fields.last_name.required"
                        )}
                        validateOnBlur
                        inputProps={{
                          value: formValues.legalLastName,
                          onChange: (event) =>
                            updateValue("legalLastName", event.target.value),
                        }}
                      />
                    </div>
                    <SgGrid minItemWidth={220} gap={16}>
                      <SgInputBirthDate
                        id="tenant-legal-birth-date"
                        label={t("multitenancy.signup.fields.birth_date.label")}
                        required
                        requiredMessage={t(
                          "multitenancy.signup.fields.birth_date.required"
                        )}
                        minAge={18}
                        maxAge={80}
                        validateOnBlur
                        inputProps={{
                          value: formValues.legalBirthDate,
                          onChange: (event) =>
                            updateValue("legalBirthDate", event.target.value),
                        }}
                      />
                      <SgInputPhone
                        id="tenant-legal-phone"
                        label={t("multitenancy.signup.fields.phone.label")}
                        required
                        requiredMessage={t(
                          "multitenancy.signup.fields.phone.required"
                        )}
                        validateOnBlur
                        inputProps={{
                          value: formValues.legalPhone,
                          onChange: (event) =>
                            updateValue("legalPhone", event.target.value),
                        }}
                      />
                      <SgInputPhone
                        id="tenant-legal-whatsapp"
                        label={t("multitenancy.signup.fields.whatsapp.label")}
                        required
                        requiredMessage={t(
                          "multitenancy.signup.fields.whatsapp.required"
                        )}
                        validateOnBlur
                        inputProps={{
                          value: formValues.legalWhatsapp,
                          onChange: (event) =>
                            updateValue("legalWhatsapp", event.target.value),
                        }}
                      />
                      <SgInputEmail
                        id="tenant-root-email"
                        label={t("multitenancy.signup.fields.root_email.label")}
                        required
                        requiredMessage={t(
                          "multitenancy.signup.fields.root_email.required"
                        )}
                        validateOnBlur
                        inputProps={{
                          value: formValues.rootEmail,
                          onChange: (event) =>
                            updateValue("rootEmail", event.target.value),
                        }}
                      />
                    </SgGrid>
                    <div className="grid gap-4 md:grid-cols-2">
                      <SgInputPassword
                        id="tenant-root-password"
                        label={t("multitenancy.signup.fields.root_password.label")}
                        required
                        requiredMessage={t(
                          "multitenancy.signup.fields.root_password.required"
                        )}
                        validateOnBlur
                        minSize={8}
                        showStrengthBar
                        inputProps={{
                          value: formValues.plainRootPassword,
                          onChange: (event) =>
                            updateValue("plainRootPassword", event.target.value),
                        }}
                      />
                      <SgInputPassword
                        id="tenant-root-password-confirm"
                        label={t(
                          "multitenancy.signup.fields.confirm_password.label"
                        )}
                        required
                        requiredMessage={t(
                          "multitenancy.signup.fields.confirm_password.required"
                        )}
                        validateOnBlur
                        showStrengthBar
                        validation={(value) =>
                          value === formValues.plainRootPassword
                            ? null
                            : t(
                                "multitenancy.signup.fields.confirm_password.mismatch"
                              )
                        }
                        inputProps={{
                          value: formValues.confirmPassword,
                          onChange: (event) =>
                            updateValue("confirmPassword", event.target.value),
                        }}
                      />
                    </div>
                  </SgStack>
                </SgWizardPage>

                <SgWizardPage
                  title={t("multitenancy.signup.steps.review")}
                  icon={<Rocket className="size-5" />}
                >
                  <SummaryGrid values={formValues} t={t} emptyValue={emptyValue} />
                </SgWizardPage>
              </SgWizard>
            </SgStack>
          )}
        </SgCard>
      </SgStack>
    </main>
  );
}

function SummaryGrid({
  values,
  t,
  emptyValue,
}: {
  values: PublicTenantSignupFormValues;
  t: Translator;
  emptyValue: string;
}) {
  const summarySections = [
    {
      id: "company",
      title: t("multitenancy.signup.summary.company"),
      rows: [
        [t("multitenancy.signup.summary.subdomain"), values.subdomain || emptyValue],
        [
          t("multitenancy.signup.summary.final_host"),
          values.subdomain ? buildTenantHost(values.subdomain) : emptyValue,
        ],
        [t("multitenancy.signup.summary.cnpj"), values.cnpj || emptyValue],
        [
          t("multitenancy.signup.summary.corporate_name"),
          values.corporateName || emptyValue,
        ],
        [
          t("multitenancy.signup.summary.trade_name"),
          values.tradeName || emptyValue,
        ],
      ],
    },
    {
      id: "address",
      title: t("multitenancy.signup.summary.address"),
      rows: [
        [t("multitenancy.signup.summary.street"), values.addressStreet || emptyValue],
        [t("multitenancy.signup.summary.number"), values.addressNumber || emptyValue],
        [
          t("multitenancy.signup.summary.complement"),
          values.addressComplement || emptyValue,
        ],
        [t("multitenancy.signup.summary.city"), values.addressCity || emptyValue],
        [t("multitenancy.signup.summary.state"), values.addressState || emptyValue],
        [
          t("multitenancy.signup.summary.district"),
          values.addressDistrict || emptyValue,
        ],
        [
          t("multitenancy.signup.summary.postal_code"),
          values.addressPostalCode || emptyValue,
        ],
        [t("multitenancy.signup.summary.phone"), values.addressPhone || emptyValue],
      ],
    },
    {
      id: "responsible",
      title: t("multitenancy.signup.summary.responsible"),
      rows: [
        [
          t("multitenancy.signup.summary.name"),
          [values.legalFirstName, values.legalLastName].filter(Boolean).join(" ") ||
            emptyValue,
        ],
        [t("multitenancy.signup.summary.cpf"), values.legalCpf || emptyValue],
        [
          t("multitenancy.signup.summary.birth_date"),
          values.legalBirthDate || emptyValue,
        ],
        [t("multitenancy.signup.summary.phone"), values.legalPhone || emptyValue],
        [
          t("multitenancy.signup.summary.whatsapp"),
          values.legalWhatsapp || emptyValue,
        ],
        [
          t("multitenancy.signup.summary.root_email"),
          values.rootEmail || emptyValue,
        ],
      ],
    },
  ] as const;

  const items = summarySections.map((section) => ({
    id: section.id,
    title: section.title,
    content: (
      <SgStack gap={12} className="text-sm">
        {section.rows.map(([label, value]) => (
          <SgGrid
            key={label}
            minItemWidth={192}
            gap={16}
            className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
          >
            <span className="font-medium text-slate-500">{label}</span>
            <span className="break-words text-left text-slate-900">
              {value}
            </span>
          </SgGrid>
        ))}
      </SgStack>
    ),
  }));

  return (
    <SgAccordion
      items={items}
      orientation="vertical"
      defaultActiveIndex={0}
      panelClassName="border border-slate-200 bg-white"
      headerClassName="text-slate-950"
      headerBackgroundColor="rgba(248,250,252,0.9)"
      className="space-y-3"
    />
  );
}

function formatProductName(value: string, fallbackValue: string) {
  const normalized = value
    .split(/[^a-zA-Z0-9]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (normalized.length === 0) {
    return fallbackValue;
  }

  return normalized
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildTenantHost(subdomain: string) {
  return `${normalizeSubdomain(subdomain)}.${TENANT_HOST_SUFFIX}`;
}

function buildProductUrl() {
  return `${DEPLOYMENT_PROTOCOL}://${TENANT_HOST_SUFFIX}`;
}

function buildTenantLoginUrl(subdomain: string) {
  return `${DEPLOYMENT_PROTOCOL}://${buildTenantHost(subdomain)}/auth/login`;
}

function normalizeLookupValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

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

