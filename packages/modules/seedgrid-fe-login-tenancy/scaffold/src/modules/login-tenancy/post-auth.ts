"use client";

// Resolver pós-login do login-tenancy: se o usuário tem acesso a mais de uma
// empresa, manda pro select-company em vez do dashboard. Consulta a rota-proxy
// fina `/api/login-tenancy/companies` (client-side; o token de sessão já foi
// setado pelo login). Registrado no navigation.ts do fe-security via o campo
// `postAuthResolver` do module.ts.
export async function resolveLoginTenancyPostAuthPath(): Promise<string | null> {
  try {
    const response = await fetch("/api/login-tenancy/companies", { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    const companies = (await response.json()) as unknown;
    if (Array.isArray(companies) && companies.length > 1) {
      return "/auth/select-company";
    }

    return null;
  } catch {
    // Falha ao consultar empresas não pode travar o login — cai no dashboard.
    return null;
  }
}
