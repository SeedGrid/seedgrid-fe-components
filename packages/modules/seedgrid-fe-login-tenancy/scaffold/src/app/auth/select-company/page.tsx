"use client";

// Passo de seleção de empresa pós-login (login-tenancy). Sem tela de origem
// pra extrair — construída em cima do CompanyScopePicker já pronto na lib
// (só falta o app envolver o componente e conectar as duas rotas-proxy finas).
// Ver scaffold/README.md pra como isso deveria se ligar ao fluxo de login.

import { useRouter } from "next/navigation";

import { useI18n } from "@/i18n";
import { PageFrame } from "@/modules/security";
import { CompanyScopePicker } from "@seedgrid/fe-login-tenancy/client";
import type { MyCompany, SelectCompanyResult } from "@seedgrid/fe-login-tenancy";

async function listCompanies(): Promise<MyCompany[]> {
  const response = await fetch("/api/login-tenancy/companies", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Could not load your companies.");
  }
  return (await response.json()) as MyCompany[];
}

async function selectCompany(companyPublicId: string): Promise<SelectCompanyResult> {
  const response = await fetch("/api/login-tenancy/select-company", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyPublicId }),
  });
  return (await response.json()) as SelectCompanyResult;
}

export default function SelectCompanyPage() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8 sm:px-6">
      <PageFrame
        title={t("login_tenancy.select_company.title")}
        description={t("login_tenancy.select_company.description")}
      >
        <CompanyScopePicker
          listCompanies={listCompanies}
          selectCompany={selectCompany}
          onSignedIn={() => router.push("/")}
          onCancel={() => router.push("/auth/login")}
          description={t("login_tenancy.select_company.picker_description")}
          companyFieldLabel={t("login_tenancy.select_company.field_label")}
          confirmLabel={t("login_tenancy.select_company.confirm")}
          cancelLabel={t("login_tenancy.select_company.cancel")}
        />
      </PageFrame>
    </main>
  );
}
