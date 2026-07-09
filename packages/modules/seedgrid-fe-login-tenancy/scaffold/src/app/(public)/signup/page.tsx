"use client";

// Signup institucional (login-tenancy): cadastro de empresa, sem subdomínio
// (login-tenancy = URL única, N empresas por login). Adaptado da estrutura
// já usada em fe-subdomain-tenancy/scaffold (wizard + lookup CNPJ/ViaCEP),
// removendo o campo de subdomínio e adicionando o fluxo de "vinculação": se o
// e-mail já tem conta, o backend anexa a nova empresa à conta existente em
// vez de criar usuário novo — a tela oculta a senha nesse caso (ver
// scaffold/README.md).

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
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/i18n";
import type {
  ConfirmSignupResponse,
  InstitutionalSignupRequest,
  SignupResponse,
} from "@seedgrid/fe-login-tenancy";

type SignupFormValues = {
  cnpj: string;
  corporateName: string;
  tradeName: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement: string;
  addressPostalCode: string;
  addressCity: string;
  addressState: string;
  addressDistrict: string;
  addressPhone: string;
  legalFirstName: string;
  legalLastName: string;
  legalCpf: string;
  legalBirthDate: string;
  legalPhone: string;
  legalWhatsapp: string;
  rootEmail: string;
  plainRootPassword: string;
  confirmPassword: string;
};

function emptyFormValues(): SignupFormValues {
  return {
    cnpj: "",
    corporateName: "",
    tradeName: "",
    addressStreet: "",
    addressNumber: "",
    addressComplement: "",
    addressPostalCode: "",
    addressCity: "",
    addressState: "",
    addressDistrict: "",
    addressPhone: "",
    legalFirstName: "",
    legalLastName: "",
    legalCpf: "",
    legalBirthDate: "",
    legalPhone: "",
    legalWhatsapp: "",
    rootEmail: "",
    plainRootPassword: "",
    confirmPassword: "",
  };
}

function buildSignupPayload(
  values: SignupFormValues,
  emailAlreadyLinked: boolean,
): InstitutionalSignupRequest {
  return {
    cnpj: values.cnpj.trim(),
    corporateName: values.corporateName.trim(),
    tradeName: values.tradeName.trim(),
    address: {
      street: values.addressStreet.trim(),
      number: values.addressNumber.trim(),
      complement: values.addressComplement.trim() || null,
      postalCode: values.addressPostalCode.trim(),
      city: values.addressCity.trim(),
      state: values.addressState.trim().toUpperCase(),
      district: values.addressDistrict.trim(),
      phone: values.addressPhone.trim(),
    },
    legalRepresentative: {
      firstName: values.legalFirstName.trim(),
      lastName: values.legalLastName.trim(),
      cpf: values.legalCpf.trim(),
      birthDate: values.legalBirthDate.trim(),
      phone: values.legalPhone.trim(),
      whatsapp: values.legalWhatsapp.trim() || null,
    },
    rootEmail: values.rootEmail.trim(),
    // Vinculação (e-mail já existente): a senha é ignorada pelo backend, nem enviamos.
    plainRootPassword: emailAlreadyLinked ? undefined : values.plainRootPassword,
  };
}

type SignupResult =
  | { ok: true; response: SignupResponse }
  | { ok: false; message: string };

type LocationOption = {
  id: string;
  label: string;
  value?: string;
  data?: { stateId?: string; cityId?: string };
};

async function fetchLocationOptions(path: string): Promise<LocationOption[]> {
  try {
    const response = await fetch(path, { method: "GET", cache: "no-store" });
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload) ? (payload as LocationOption[]) : [];
  } catch {
    return [];
  }
}

function searchBrazilStates(query: string) {
  return fetchLocationOptions(`/api/locations/states?query=${encodeURIComponent(query)}`);
}

function searchBrazilCities(query: string, stateId: string) {
  if (!stateId) return Promise.resolve([]);
  return fetchLocationOptions(
    `/api/locations/cities?stateId=${encodeURIComponent(stateId)}&query=${encodeURIComponent(query)}`,
  );
}

export default function InstitutionalSignupPage() {
  const router = useRouter();
  const { t } = useI18n();

  const [formValues, setFormValues] = useState<SignupFormValues>(emptyFormValues());
  const [selectedAddressStateId, setSelectedAddressStateId] = useState("");
  const [emailAlreadyLinked, setEmailAlreadyLinked] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SignupResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [emailVerificationError, setEmailVerificationError] = useState<string | null>(null);
  const [isValidatingVerificationEmail, setIsValidatingVerificationEmail] = useState(false);
  const [isResendingVerificationEmail, setIsResendingVerificationEmail] = useState(false);
  const lastSubmittedEmailVerificationCodeRef = useRef<string | null>(null);

  const successResult = submissionResult && submissionResult.ok ? submissionResult : null;
  const errorResult = submissionResult && !submissionResult.ok ? submissionResult : null;
  const emailVerificationDigits = emailVerificationCode.replace(/\D/g, "");
  const isEmailVerificationCodeComplete = emailVerificationDigits.length === 6;
  const emptyValue = t("common.empty");

  function updateValue(key: keyof SignupFormValues, value: string) {
    setFormValues((current) => ({ ...current, [key]: value }));
  }

  async function handleEmailBlur() {
    const email = formValues.rootEmail.trim();
    if (!email) {
      setEmailAlreadyLinked(false);
      return;
    }

    setCheckingEmail(true);
    try {
      const response = await fetch(
        `/api/login-tenancy/signup/email-exists?email=${encodeURIComponent(email)}`,
        { cache: "no-store" },
      );
      const payload = (await response.json()) as { exists: boolean };
      setEmailAlreadyLinked(payload.exists);
    } catch {
      setEmailAlreadyLinked(false);
    } finally {
      setCheckingEmail(false);
    }
  }

  useEffect(() => {
    if (!successResult || !isEmailVerificationCodeComplete) return;
    if (isValidatingVerificationEmail) return;
    if (lastSubmittedEmailVerificationCodeRef.current === emailVerificationDigits) return;

    lastSubmittedEmailVerificationCodeRef.current = emailVerificationDigits;

    void (async () => {
      setIsValidatingVerificationEmail(true);
      setEmailVerificationError(null);

      try {
        const response = await fetch("/api/login-tenancy/signup/confirm-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: emailVerificationDigits }),
        });

        if (response.ok) {
          (await response.json()) as ConfirmSignupResponse;
          router.push("/auth/login");
          return;
        }

        const message = t("login_tenancy.signup.feedback.validate_unavailable");
        setEmailVerificationError(message);
        toast.error(message);
      } catch {
        const message = t("login_tenancy.signup.feedback.validate_unavailable");
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
    router,
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
        (item) => String(item.value ?? item.id).trim().toUpperCase() === stateCode,
      );
      if (!isActive) return;
      setSelectedAddressStateId(
        matched ? String((matched.data as Record<string, unknown>)?.stateId ?? matched.id ?? "") : "",
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
      const response = await fetch("/api/login-tenancy/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildSignupPayload(formValues, emailAlreadyLinked)),
      });

      if (!response.ok) {
        const problem = (await response.json().catch(() => null)) as { detail?: string } | null;
        setSubmissionResult({
          ok: false,
          message: problem?.detail ?? t("login_tenancy.signup.feedback.submit_unavailable"),
        });
        return;
      }

      const payload = (await response.json()) as SignupResponse;
      setSubmissionResult({ ok: true, response: payload });
    } catch {
      setSubmissionResult({
        ok: false,
        message: t("login_tenancy.signup.feedback.submit_unavailable"),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendVerificationEmail() {
    if (isResendingVerificationEmail) return;

    setIsResendingVerificationEmail(true);
    try {
      const response = await fetch("/api/login-tenancy/signup/resend-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formValues.rootEmail.trim() }),
      });

      if (response.ok) {
        setEmailVerificationCode("");
        setEmailVerificationError(null);
        lastSubmittedEmailVerificationCodeRef.current = null;
        toast.info(t("login_tenancy.signup.verification.resent"));
        return;
      }

      toast.error(t("login_tenancy.signup.feedback.resend_unavailable"));
    } catch {
      toast.error(t("login_tenancy.signup.feedback.resend_unavailable"));
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
      corporateName: resolveLookupValue(readLookupString(data, "razao_social"), current.corporateName),
      tradeName: resolveLookupValue(
        readLookupString(data, "estabelecimento", "nome_fantasia"),
        current.tradeName,
      ),
      addressStreet: resolveLookupValue(
        joinStreetLine(
          readLookupString(data, "estabelecimento", "tipo_logradouro"),
          readLookupString(data, "estabelecimento", "logradouro"),
        ),
        current.addressStreet,
      ),
      addressNumber: resolveLookupValue(
        readLookupString(data, "estabelecimento", "numero"),
        current.addressNumber,
      ),
      addressComplement: resolveLookupValue(
        readLookupString(data, "estabelecimento", "complemento"),
        current.addressComplement,
      ),
      addressDistrict: resolveLookupValue(
        readLookupString(data, "estabelecimento", "bairro"),
        current.addressDistrict,
      ),
      addressPostalCode: resolveLookupValue(
        formatPostalCode(readLookupString(data, "estabelecimento", "cep")),
        current.addressPostalCode,
      ),
      addressCity: resolveLookupValue(
        readLookupString(data, "estabelecimento", "cidade", "nome"),
        current.addressCity,
      ),
      addressState: resolveLookupValue(
        normalizeStateCode(readLookupString(data, "estabelecimento", "estado", "sigla")),
        current.addressState,
      ),
      addressPhone: resolveLookupValue(
        formatBrazilPhone(
          readLookupString(data, "estabelecimento", "ddd1"),
          readLookupString(data, "estabelecimento", "telefone1"),
        ),
        current.addressPhone,
      ),
    }));
  }

  function handleViaCepResult(data: ViaCepResponse) {
    if (data.erro) return;

    setFormValues((current) => ({
      ...current,
      addressStreet: resolveLookupValue(normalizeLookupValue(data.logradouro), current.addressStreet),
      addressComplement: resolveLookupValue(
        normalizeLookupValue(data.complemento),
        current.addressComplement,
      ),
      addressDistrict: resolveLookupValue(normalizeLookupValue(data.bairro), current.addressDistrict),
      addressCity: resolveLookupValue(normalizeLookupValue(data.localidade), current.addressCity),
      addressState: resolveLookupValue(normalizeStateCode(data.uf), current.addressState),
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
                {t("login_tenancy.signup.header.eyebrow")}
              </div>
              <div className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">
                {t("login_tenancy.signup.header.title")}
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
                      value={t("login_tenancy.signup.verification.badge")}
                      severity="success"
                      badgeStyle="soft"
                      rounded
                    />
                    <h2 className="text-2xl font-semibold text-emerald-950">
                      {t("login_tenancy.signup.verification.title")}
                    </h2>
                    <p className="text-sm leading-6 text-emerald-900/80">
                      {t("login_tenancy.signup.verification.description", {
                        email: formValues.rootEmail,
                      })}
                    </p>
                  </SgStack>
                </SgStack>
              </SgPanel>

              <SgPanel className="rounded-[28px] border border-slate-200 bg-white p-5 sm:p-6">
                <SgGrid minItemWidth={320} gap={16} align="end">
                  <SgInputOTP
                    id="signup-email-verification-code"
                    label={t("login_tenancy.signup.verification.code.label")}
                    hintText={t("login_tenancy.signup.verification.code.hint")}
                    mask="999-999"
                    width="100%"
                    required
                    requiredMessage={t("login_tenancy.signup.verification.code.required")}
                    validateOnBlur
                    validation={(rawValue) =>
                      rawValue.replace(/\D/g, "").length === 6
                        ? null
                        : t("login_tenancy.signup.verification.code.invalid")
                    }
                    value={emailVerificationCode}
                    onChange={handleEmailVerificationCodeChange}
                    inputProps={{
                      autoComplete: "one-time-code",
                      disabled: isValidatingVerificationEmail,
                      inputMode: "numeric",
                    }}
                  />

                  <SgButton
                    appearance="outline"
                    severity="primary"
                    shape="rounded"
                    label={t("login_tenancy.signup.verification.resend")}
                    disabled={isValidatingVerificationEmail}
                    loading={isResendingVerificationEmail}
                    type="button"
                    onClick={() => void handleResendVerificationEmail()}
                  />
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
                      ? t("login_tenancy.signup.verification.validating")
                      : t("login_tenancy.signup.verification.idle")}
                </div>
              </SgPanel>

              <SummaryGrid values={formValues} t={t} emptyValue={emptyValue} />
            </SgStack>
          ) : (
            <SgStack gap={20}>
              {errorResult ? (
                <SgPanel className="rounded-[24px] border border-rose-200 bg-rose-50 p-4">
                  <p className="text-sm leading-6 text-rose-900">{errorResult.message}</p>
                </SgPanel>
              ) : null}

              <SgWizard
                stepper="icons"
                labels={{
                  previous: t("login_tenancy.signup.wizard.previous"),
                  next: t("login_tenancy.signup.wizard.next"),
                  finish: isSubmitting
                    ? t("login_tenancy.signup.wizard.finishing")
                    : t("login_tenancy.signup.wizard.finish"),
                }}
                onFinish={handleFinish}
                className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-3 sm:rounded-[32px] sm:p-5"
              >
                <SgWizardPage
                  title={t("login_tenancy.signup.steps.company")}
                  icon={<Building2 className="size-5" />}
                >
                  <SgStack gap={16}>
                    <SgInputCNPJ
                      id="signup-cnpj"
                      label={t("login_tenancy.signup.fields.cnpj.label")}
                      required
                      requiredMessage={t("login_tenancy.signup.fields.cnpj.required")}
                      validateOnBlur
                      validateWithPublicaCnpj
                      publicaCnpjErrorMessage={t("login_tenancy.signup.fields.cnpj.lookup_error")}
                      onPublicaCnpjResult={handlePublicaCnpjResult}
                      inputProps={{
                        value: formValues.cnpj,
                        onChange: (event) => updateValue("cnpj", event.target.value),
                      }}
                    />
                    <SgInputText
                      id="signup-corporate-name"
                      label={t("login_tenancy.signup.fields.corporate_name.label")}
                      required
                      requiredMessage={t("login_tenancy.signup.fields.corporate_name.required")}
                      validateOnBlur
                      inputProps={{
                        value: formValues.corporateName,
                        onChange: (event) => updateValue("corporateName", event.target.value),
                      }}
                    />
                    <SgInputText
                      id="signup-trade-name"
                      label={t("login_tenancy.signup.fields.trade_name.label")}
                      required
                      requiredMessage={t("login_tenancy.signup.fields.trade_name.required")}
                      validateOnBlur
                      inputProps={{
                        value: formValues.tradeName,
                        onChange: (event) => updateValue("tradeName", event.target.value),
                      }}
                    />
                    <SgInputPhone
                      id="signup-address-phone"
                      label={t("login_tenancy.signup.fields.address_phone.label")}
                      required
                      requiredMessage={t("login_tenancy.signup.fields.address_phone.required")}
                      validateOnBlur
                      inputProps={{
                        value: formValues.addressPhone,
                        onChange: (event) => updateValue("addressPhone", event.target.value),
                      }}
                    />
                  </SgStack>
                </SgWizardPage>

                <SgWizardPage
                  title={t("login_tenancy.signup.steps.address")}
                  icon={<MapPinned className="size-5" />}
                >
                  <SgStack gap={16}>
                    <SgInputPostalCode
                      id="signup-address-postal-code"
                      label={t("login_tenancy.signup.fields.postal_code.label")}
                      required
                      requiredMessage={t("login_tenancy.signup.fields.postal_code.required")}
                      validateOnBlur
                      validateWithViaCep
                      viaCepErrorMessage={t("login_tenancy.signup.fields.postal_code.lookup_error")}
                      onViaCepResult={handleViaCepResult}
                      inputProps={{
                        value: formValues.addressPostalCode,
                        onChange: (event) => updateValue("addressPostalCode", event.target.value),
                      }}
                    />
                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_120px]">
                      <SgInputText
                        id="signup-address-street"
                        label={t("login_tenancy.signup.fields.street.label")}
                        required
                        requiredMessage={t("login_tenancy.signup.fields.street.required")}
                        maxLength={60}
                        validateOnBlur
                        inputProps={{
                          value: formValues.addressStreet,
                          onChange: (event) => updateValue("addressStreet", event.target.value),
                        }}
                      />
                      <SgInputText
                        id="signup-address-number"
                        label={t("login_tenancy.signup.fields.number.label")}
                        required
                        requiredMessage={t("login_tenancy.signup.fields.number.required")}
                        maxLength={6}
                        validateOnBlur
                        inputProps={{
                          inputMode: "numeric",
                          value: formValues.addressNumber,
                          onChange: (event) =>
                            updateValue("addressNumber", event.target.value.replace(/\D/g, "").slice(0, 6)),
                        }}
                      />
                    </div>
                    <SgInputText
                      id="signup-address-complement"
                      label={t("login_tenancy.signup.fields.complement.label")}
                      inputProps={{
                        value: formValues.addressComplement,
                        onChange: (event) => updateValue("addressComplement", event.target.value),
                      }}
                    />
                    <SgInputText
                      id="signup-address-district"
                      label={t("login_tenancy.signup.fields.district.label")}
                      required
                      requiredMessage={t("login_tenancy.signup.fields.district.required")}
                      validateOnBlur
                      inputProps={{
                        value: formValues.addressDistrict,
                        onChange: (event) => updateValue("addressDistrict", event.target.value),
                      }}
                    />
                    <SgGrid minItemWidth={220} gap={16}>
                      <SgAutocomplete
                        id="signup-address-state"
                        label={t("login_tenancy.signup.fields.state.label")}
                        source={searchBrazilStates}
                        minLengthForSearch={0}
                        openOnFocus
                        showDropDownButton
                        required
                        onSelect={(item) => {
                          const nextStateCode = String(item.value ?? item.id).trim().toUpperCase();
                          const nextStateId = String(
                            (item.data as Record<string, unknown>)?.stateId ?? item.id ?? "",
                          );
                          setSelectedAddressStateId(nextStateId);
                          setFormValues((current) => ({
                            ...current,
                            addressState: nextStateCode,
                            addressCity: "",
                          }));
                        }}
                        formatSelection={(item) => String(item.value ?? item.id)}
                      />
                      <SgAutocomplete
                        id="signup-address-city"
                        label={t("login_tenancy.signup.fields.city.label")}
                        source={(query) => searchBrazilCities(query, selectedAddressStateId)}
                        minLengthForSearch={0}
                        openOnFocus
                        showDropDownButton
                        required
                        onSelect={(item) =>
                          updateValue("addressCity", String(item.value ?? item.label ?? item.id))
                        }
                        formatSelection={(item) => String(item.value ?? item.label ?? item.id)}
                      />
                    </SgGrid>
                  </SgStack>
                </SgWizardPage>

                <SgWizardPage
                  title={t("login_tenancy.signup.steps.responsible")}
                  icon={<ShieldCheck className="size-5" />}
                >
                  <SgStack gap={16}>
                    <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1.35fr)_minmax(0,1fr)]">
                      <SgInputCPF
                        id="signup-legal-cpf"
                        label={t("login_tenancy.signup.fields.cpf.label")}
                        required
                        requiredMessage={t("login_tenancy.signup.fields.cpf.required")}
                        validateOnBlur
                        inputProps={{
                          value: formValues.legalCpf,
                          onChange: (event) => updateValue("legalCpf", event.target.value),
                        }}
                      />
                      <SgInputText
                        id="signup-legal-first-name"
                        label={t("login_tenancy.signup.fields.first_name.label")}
                        required
                        requiredMessage={t("login_tenancy.signup.fields.first_name.required")}
                        validateOnBlur
                        inputProps={{
                          value: formValues.legalFirstName,
                          onChange: (event) => updateValue("legalFirstName", event.target.value),
                        }}
                      />
                      <SgInputText
                        id="signup-legal-last-name"
                        label={t("login_tenancy.signup.fields.last_name.label")}
                        required
                        requiredMessage={t("login_tenancy.signup.fields.last_name.required")}
                        validateOnBlur
                        inputProps={{
                          value: formValues.legalLastName,
                          onChange: (event) => updateValue("legalLastName", event.target.value),
                        }}
                      />
                    </div>
                    <SgGrid minItemWidth={220} gap={16}>
                      <SgInputBirthDate
                        id="signup-legal-birth-date"
                        label={t("login_tenancy.signup.fields.birth_date.label")}
                        required
                        requiredMessage={t("login_tenancy.signup.fields.birth_date.required")}
                        minAge={18}
                        maxAge={80}
                        validateOnBlur
                        inputProps={{
                          value: formValues.legalBirthDate,
                          onChange: (event) => updateValue("legalBirthDate", event.target.value),
                        }}
                      />
                      <SgInputPhone
                        id="signup-legal-phone"
                        label={t("login_tenancy.signup.fields.phone.label")}
                        required
                        requiredMessage={t("login_tenancy.signup.fields.phone.required")}
                        validateOnBlur
                        inputProps={{
                          value: formValues.legalPhone,
                          onChange: (event) => updateValue("legalPhone", event.target.value),
                        }}
                      />
                      <SgInputPhone
                        id="signup-legal-whatsapp"
                        label={t("login_tenancy.signup.fields.whatsapp.label")}
                        inputProps={{
                          value: formValues.legalWhatsapp,
                          onChange: (event) => updateValue("legalWhatsapp", event.target.value),
                        }}
                      />
                      <SgInputEmail
                        id="signup-root-email"
                        label={t("login_tenancy.signup.fields.root_email.label")}
                        required
                        requiredMessage={t("login_tenancy.signup.fields.root_email.required")}
                        validateOnBlur
                        inputProps={{
                          value: formValues.rootEmail,
                          onChange: (event) => updateValue("rootEmail", event.target.value),
                          onBlur: () => void handleEmailBlur(),
                        }}
                      />
                    </SgGrid>

                    {checkingEmail ? (
                      <p className="text-sm text-slate-500">
                        {t("login_tenancy.signup.email_check.checking")}
                      </p>
                    ) : emailAlreadyLinked ? (
                      <SgPanel className="rounded-[20px] border border-sky-200 bg-sky-50 p-4">
                        <p className="text-sm leading-6 text-sky-900">
                          {t("login_tenancy.signup.email_check.linking_notice")}
                        </p>
                      </SgPanel>
                    ) : null}

                    {!emailAlreadyLinked ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        <SgInputPassword
                          id="signup-root-password"
                          label={t("login_tenancy.signup.fields.root_password.label")}
                          required
                          requiredMessage={t("login_tenancy.signup.fields.root_password.required")}
                          validateOnBlur
                          minSize={8}
                          showStrengthBar
                          inputProps={{
                            value: formValues.plainRootPassword,
                            onChange: (event) => updateValue("plainRootPassword", event.target.value),
                          }}
                        />
                        <SgInputPassword
                          id="signup-root-password-confirm"
                          label={t("login_tenancy.signup.fields.confirm_password.label")}
                          required
                          requiredMessage={t("login_tenancy.signup.fields.confirm_password.required")}
                          validateOnBlur
                          showStrengthBar
                          validation={(value) =>
                            value === formValues.plainRootPassword
                              ? null
                              : t("login_tenancy.signup.fields.confirm_password.mismatch")
                          }
                          inputProps={{
                            value: formValues.confirmPassword,
                            onChange: (event) => updateValue("confirmPassword", event.target.value),
                          }}
                        />
                      </div>
                    ) : null}
                  </SgStack>
                </SgWizardPage>

                <SgWizardPage
                  title={t("login_tenancy.signup.steps.review")}
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
  values: SignupFormValues;
  t: ReturnType<typeof useI18n>["t"];
  emptyValue: string;
}) {
  const summarySections = [
    {
      id: "company",
      title: t("login_tenancy.signup.summary.company"),
      rows: [
        [t("login_tenancy.signup.summary.cnpj"), values.cnpj || emptyValue],
        [t("login_tenancy.signup.summary.corporate_name"), values.corporateName || emptyValue],
        [t("login_tenancy.signup.summary.trade_name"), values.tradeName || emptyValue],
      ],
    },
    {
      id: "address",
      title: t("login_tenancy.signup.summary.address"),
      rows: [
        [t("login_tenancy.signup.summary.street"), values.addressStreet || emptyValue],
        [t("login_tenancy.signup.summary.number"), values.addressNumber || emptyValue],
        [t("login_tenancy.signup.summary.complement"), values.addressComplement || emptyValue],
        [t("login_tenancy.signup.summary.city"), values.addressCity || emptyValue],
        [t("login_tenancy.signup.summary.state"), values.addressState || emptyValue],
        [t("login_tenancy.signup.summary.district"), values.addressDistrict || emptyValue],
        [t("login_tenancy.signup.summary.postal_code"), values.addressPostalCode || emptyValue],
        [t("login_tenancy.signup.summary.phone"), values.addressPhone || emptyValue],
      ],
    },
    {
      id: "responsible",
      title: t("login_tenancy.signup.summary.responsible"),
      rows: [
        [
          t("login_tenancy.signup.summary.name"),
          [values.legalFirstName, values.legalLastName].filter(Boolean).join(" ") || emptyValue,
        ],
        [t("login_tenancy.signup.summary.cpf"), values.legalCpf || emptyValue],
        [t("login_tenancy.signup.summary.birth_date"), values.legalBirthDate || emptyValue],
        [t("login_tenancy.signup.summary.phone"), values.legalPhone || emptyValue],
        [t("login_tenancy.signup.summary.whatsapp"), values.legalWhatsapp || emptyValue],
        [t("login_tenancy.signup.summary.root_email"), values.rootEmail || emptyValue],
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
            <span className="break-words text-left text-slate-900">{value}</span>
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

function normalizeLookupValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readLookupString(value: unknown, ...path: string[]) {
  let current: unknown = value;
  for (const key of path) {
    if (!current || typeof current !== "object") return null;
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
  if (digits.length <= 5) return digits || null;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function formatBrazilPhone(ddd: string | null, phone: string | null) {
  const digits = `${ddd ?? ""}${phone ?? ""}`.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 10) return null;
  const areaCode = digits.slice(0, 2);
  const isMobile = digits.length === 11;
  const firstPart = digits.slice(2, isMobile ? 7 : 6);
  const secondPart = digits.slice(isMobile ? 7 : 6);
  return `(${areaCode}) ${firstPart}-${secondPart}`;
}

function normalizeStateCode(value: string | null | undefined) {
  return typeof value === "string" && value.trim() ? value.trim().toUpperCase() : null;
}
