"use client";

import { useEffect, useState } from "react";

import {
  SgButton,
  SgCard,
  SgGrid,
  SgInputEmail,
  SgInputPassword,
  SgPanel,
  SgStack,
  toast,
} from "@seedgrid/fe-components";
import { useRouter } from "next/navigation";
import { type FieldErrors, useForm } from "react-hook-form";

import { appEnvironment } from "@/config/environment";
import { useI18n } from "@/i18n";
import {
  InlineNotice,
  extractApiMessage,
  resolvePostAuthPath,
  securityConfig,
  useAuth,
} from "@/modules/security";
import { readStoredSession } from "@/modules/security/services/session-storage";

type LoginHostKind = "local" | "master" | "tenant" | "unknown";

type LoginFormValues = {
  login: string;
  password: string;
};

function resolveHostKind(hostname: string): LoginHostKind {
  const normalizedHostname = hostname.trim().toLowerCase();
  const masterHost = appEnvironment.hosts.masterAppHost.trim().toLowerCase();

  if (
    !normalizedHostname ||
    normalizedHostname === "localhost" ||
    normalizedHostname === "127.0.0.1" ||
    normalizedHostname.endsWith(".local")
  ) {
    return "local";
  }

  if (normalizedHostname === masterHost) {
    return "master";
  }

  if (masterHost && normalizedHostname.endsWith(`.${masterHost}`)) {
    return "tenant";
  }

  return "unknown";
}

function formatProductName(value: string) {
  const normalized = value.trim().replace(/[-_]+/g, " ");

  if (!normalized) {
    return "SeedGrid";
  }

  return normalized
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildMonogram(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0]?.[0] ?? ""}${words[1]?.[0] ?? ""}`.toUpperCase();
  }

  return value.trim().slice(0, 1).toUpperCase() || "S";
}

function extractTenantLabel(hostname: string) {
  const normalizedHostname = hostname.trim().toLowerCase();
  const masterHost = appEnvironment.hosts.masterAppHost.trim().toLowerCase();

  if (!masterHost) {
    return "";
  }

  const tenantSuffix = `.${masterHost}`;
  if (!normalizedHostname.endsWith(tenantSuffix)) {
    return "";
  }

  return normalizedHostname.slice(0, -tenantSuffix.length);
}

function resolveTenantLogoUrl(template: string, hostname: string) {
  const normalizedTemplate = template.trim();
  const normalizedHostname = hostname.trim().toLowerCase();

  if (!normalizedTemplate || !normalizedHostname) {
    return null;
  }

  return normalizedTemplate
    .replaceAll("{tenant}", extractTenantLabel(normalizedHostname))
    .replaceAll("{host}", normalizedHostname)
    .replaceAll("{hostname}", normalizedHostname)
    .replaceAll(
      "{masterHost}",
      appEnvironment.hosts.masterAppHost.trim().toLowerCase()
    );
}

function resolveLoginLogoSource(hostKind: LoginHostKind, hostname: string) {
  if (hostKind === "tenant") {
    return resolveTenantLogoUrl(appEnvironment.branding.tenantLogoUrl, hostname);
  }

  return appEnvironment.branding.masterLogoPath.trim() || null;
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 text-slate-400" aria-hidden="true">
      <path
        d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25V6.75Zm2.1-.25 5.9 4.64 5.9-4.64H6.1Zm11.4 1.91-4.73 3.71a1.25 1.25 0 0 1-1.54 0L6.5 8.41v8.84c0 .14.11.25.25.25h10.5c.14 0 .25-.11.25-.25V8.41Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 text-slate-400" aria-hidden="true">
      <path
        d="M8 10V8a4 4 0 1 1 8 0v2h.75A2.25 2.25 0 0 1 19 12.25v6.5A2.25 2.25 0 0 1 16.75 21h-9.5A2.25 2.25 0 0 1 5 18.75v-6.5A2.25 2.25 0 0 1 7.25 10H8Zm2.5 0h3V8a1.5 1.5 0 0 0-3 0v2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const auth = useAuth();
  const [pending, setPending] = useState(false);
  const [hostKind, setHostKind] = useState<LoginHostKind>("unknown");
  const [hostname, setHostname] = useState("");
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const { handleSubmit, register, reset } = useForm<LoginFormValues>({
    defaultValues: {
      login: "",
      password: "",
    },
  });
  const canShowSignup = hostKind !== "master";
  const productName = formatProductName(
    appEnvironment.branding.productName || appEnvironment.namespace
  );
  const productSlogan = appEnvironment.branding.productSlogan.trim() || productName;
  const monogram = buildMonogram(productName);
  const logoSource = resolveLoginLogoSource(hostKind, hostname);
  const loginRules = {
    required: t("security.login.validation.email_required"),
  };
  const passwordRules = {
    required: t("security.login.validation.password_required"),
  };
  const emailInputProps = {
    autoComplete: "email",
  };
  const passwordInputProps = {
    autoComplete: "current-password",
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setHostname(window.location.hostname);
    setHostKind(resolveHostKind(window.location.hostname));
  }, []);

  useEffect(() => {
    setLogoLoadFailed(false);
  }, [logoSource]);

  async function handleLogin(values: LoginFormValues) {
    setPending(true);

    try {
      const outcome = await auth.login({
        login: values.login.trim(),
        password: values.password,
      });

      if (outcome.kind === "two_factor_required") {
        toast.info(t("security.login.two_factor_required"));
        router.push(securityConfig.routes.verifyTwoFactor);
        return;
      }

      const storedSession = readStoredSession();

      if (storedSession?.changePasswordRequired) {
        toast.info(t("security.login.change_password_required"));
        reset();
        router.push(securityConfig.routes.changePassword);
        return;
      }

      const nextPermissions = storedSession?.permissions ?? [];
      toast.success(t("security.login.success"));
      reset();
      router.push(await resolvePostAuthPath(nextPermissions));
    } catch (error) {
      toast.error(extractApiMessage(error) ?? t("security.login.error"));
    } finally {
      setPending(false);
    }
  }

  function handleInvalidSubmit(errors: FieldErrors<LoginFormValues>) {
    const firstMessage =
      errors.login?.message ??
      errors.password?.message;

    if (firstMessage) {
      toast.error(firstMessage);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8 sm:px-6">
      <SgCard
        cardStyle="elevated"
        size="lg"
        className="w-full max-w-2xl overflow-hidden border border-white/70 bg-white/92 backdrop-blur"
      >
        <SgStack gap={32} className="px-6 py-8 sm:px-10 sm:py-10">
          <SgStack align="center" className="mx-auto w-full max-w-[30rem]" gap={16}>
            <SgPanel
              className="relative w-full rounded-[2rem] bg-slate-50 px-5 pb-5 pt-16 sm:px-8 sm:pb-8 sm:pt-20"
              borderStyle="none"
            >
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[30%]">
                <div className="flex size-28 items-center justify-center rounded-[1.75rem] border-4 border-slate-950 bg-white shadow-[0_18px_45px_-28px_rgba(15,23,42,0.35)] sm:size-32">
                  {logoSource && !logoLoadFailed ? (
                    <img
                      src={logoSource}
                      alt={t("security.login.logo_alt", { productName })}
                      className="h-full w-full rounded-[1.45rem] object-contain p-4"
                      loading="eager"
                      decoding="async"
                      onError={() => {
                        setLogoLoadFailed(true);
                      }}
                    />
                  ) : (
                    <span className="text-4xl font-black text-emerald-700 sm:text-5xl">
                      {monogram}
                    </span>
                  )}
                </div>
              </div>

              <SgPanel
                className="rounded-[1.5rem] border border-white/80 bg-white/95 px-5 py-5 shadow-[0_18px_48px_-36px_rgba(15,23,42,0.45)] sm:px-6"
                borderStyle="none"
              >
                <SgStack gap={8}>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    {productName}
                  </h1>
                  <p className="text-sm leading-6 text-slate-600">
                    {t("security.login.branding_message", {
                      productName,
                    })}
                  </p>
                  <p className="text-base font-medium leading-6 text-slate-900">
                    {productSlogan}
                  </p>
                </SgStack>
              </SgPanel>
            </SgPanel>
          </SgStack>

          <form
            noValidate
            onSubmit={handleSubmit(handleLogin, handleInvalidSubmit)}
          >
            <SgStack className="mx-auto w-full max-w-[28rem]" gap={16}>
              {auth.pendingTwoFactor ? (
                <InlineNotice tone="warning">
                  {t("security.login.two_factor_required")}
                </InlineNotice>
              ) : null}

              <SgInputEmail
                id="security-login-email"
                name="login"
                label={t("security.login.email")}
                register={register}
                required
                rules={loginRules}
                prefixIcon={<EmailIcon />}
                inputProps={emailInputProps}
              />
              <SgInputPassword
                id="security-login-password"
                name="password"
                label={t("security.login.password")}
                register={register}
                required
                rules={passwordRules}
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
                prefixIcon={<LockIcon />}
                inputProps={passwordInputProps}
              />

              <SgButton
                appearance="solid"
                severity="primary"
                size="lg"
                shape="rounded"
                label={
                  pending
                    ? t("security.login.processing")
                    : t("security.login.submit")
                }
                loading={pending}
                disabled={pending}
                type="submit"
                className="mt-2 w-full"
              />

              <SgButton
                appearance="ghost"
                severity="info"
                label={t("security.login.forgot_password")}
                onClick={() => {
                  router.push(securityConfig.routes.forgotPassword);
                }}
                className="mx-auto"
              />
            </SgStack>
          </form>

          {canShowSignup ? (
            <SgGrid
              columns={1}
              gap={6}
              className="mx-auto w-full max-w-[28rem] border-t border-slate-200 pt-6 text-center text-sm text-slate-500"
            >
              <span>{t("security.login.signup_prompt")}</span>
              <SgButton
                appearance="ghost"
                severity="success"
                label={t("security.login.signup_action")}
                onClick={() => {
                  router.push(securityConfig.routes.selfEnterPublic);
                }}
                className="mx-auto"
              />
            </SgGrid>
          ) : null}
        </SgStack>
      </SgCard>
    </main>
  );
}
