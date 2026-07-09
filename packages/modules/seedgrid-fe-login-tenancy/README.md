# @seedgrid/fe-login-tenancy

[![npm version](https://img.shields.io/npm/v/%40seedgrid%2Ffe-login-tenancy)](https://www.npmjs.com/package/@seedgrid/fe-login-tenancy)
[![npm downloads](https://img.shields.io/npm/dm/%40seedgrid%2Ffe-login-tenancy)](https://www.npmjs.com/package/@seedgrid/fe-login-tenancy)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue)](https://www.typescriptlang.org/)

Módulo front de **multiempresa por login** do SeedGrid: o usuário entra numa URL única e escolhe em qual empresa vai trabalhar (tokens re-emitidos com escopo da empresa selecionada), com cadastro institucional de empresa (signup com CNPJ). É a variante de tenancy por seleção pós-login — a variante por subdomínio fica no [`@seedgrid/fe-subdomain-tenancy`](https://www.npmjs.com/package/@seedgrid/fe-subdomain-tenancy) (`variantGroup: "tenancy"`, use uma ou outra). Compõe sobre o motor de sessão do [`@seedgrid/fe-security`](https://www.npmjs.com/package/@seedgrid/fe-security).

## Sumário

- [Funcionalidades](#funcionalidades)
- [Telas entregues pelo scaffold](#telas-entregues-pelo-scaffold)
- [Instalação](#instalação)
- [Uso rápido](#uso-rápido)
- [Backend correspondente](#backend-correspondente)
- [Suporte](#suporte)

## Funcionalidades

- **Seleção de empresa pós-login** — se o usuário tem acesso a mais de uma empresa, o app redireciona pra tela de seleção (`resolveLoginTenancyPostAuthPath`, plugado no registry pós-auth do fe-security sem inverter dependência); a troca de empresa re-emite o par de tokens escopado.
- **Signup institucional de empresa** — wizard com CNPJ/endereço/representante legal; se o e-mail já existir, o fluxo vira **vinculação** (anexa a nova empresa à conta existente, ocultando os campos de senha).
- **Confirmação de e-mail** — confirmação por token, verificação de e-mail existente e reenvio.
- **Componente pronto** — `CompanyScopePicker` (em `@seedgrid/fe-login-tenancy/client`), desacoplado do transporte via props.
- **i18n pronto** — `loginTenancyMessages`.

O pacote exporta:

- `LoginTenancyPaths` — contrato dos endpoints públicos (`/public/signup`, `email-exists`, `confirm-email`, `resend-email`, status). As operações de empresa escopada (`/me/companies`, `/me/select-company`) ficam em `SecurityPaths.me` (fe-security).
- DTOs client-safe de empresa (`company`) e signup (`signup`) — conferidos contra o `InstitutionalSignupRequest.java` real.
- `CompanyScopePicker` (client) e `createLoginTenancyServer` (em `/server`, SERVER-ONLY).

## Telas entregues pelo scaffold

| Tela | Rota | O que faz |
| --- | --- | --- |
| Signup institucional | `/signup` (público) | Wizard de cadastro de empresa (CNPJ/ViaCEP/UF); checa e-mail existente no blur e ativa o fluxo de vinculação quando já há conta |
| Seleção de empresa | `/auth/select-company` | Envolve o `CompanyScopePicker` pra escolher a empresa ativa após o login |

O scaffold também traz as rotas-proxy de API (`/api/login-tenancy/*` — companies, select-company e o fluxo completo de signup), o bootstrap de servidor (compondo `createSecurityServer` + `createLoginTenancyServer` com a mesma sessão/cookie do app) e o resolver pós-auth — tudo wireado pelo SeedGrid CLI via `module.json` (`id: "login-tenancy"`, `requires: ["security"]`, `variantGroup: "tenancy"`).

## Instalação

```bash
pnpm add @seedgrid/fe-login-tenancy @seedgrid/fe-security @seedgrid/fe-core
```

## Uso rápido

```ts
// server-only — compõe sobre a sessão do fe-security
import { createSecurityServer } from "@seedgrid/fe-security/server";
import { createLoginTenancyServer } from "@seedgrid/fe-login-tenancy/server";

const session = createSecurityServer({ /* ... */ });
export const loginTenancy = createLoginTenancyServer(session);

// Pós-login: listar empresas do usuário e trocar o escopo
const empresas = await loginTenancy.listMyCompanies();
await loginTenancy.selectCompany(empresas[0].publicId); // re-emite tokens escopados
```

```tsx
// Client: seletor de empresa pronto (desacoplado do transporte — o app pluga as chamadas)
import { CompanyScopePicker } from "@seedgrid/fe-login-tenancy/client";

<CompanyScopePicker
  listCompanies={() => fetch("/api/login-tenancy/companies").then((r) => r.json())}
  selectCompany={(publicId) =>
    fetch("/api/login-tenancy/select-company", {
      method: "POST",
      body: JSON.stringify({ publicId }),
    }).then((r) => r.json())
  }
  onSignedIn={() => router.push("/")}
/>
```

## Backend correspondente

Extensão Quarkus `seedgrid-quarkus-ext-login-tenancy`. Os DTOs de signup foram conferidos contra o `InstitutionalSignupRequest.java` real (incluindo o comportamento de vinculação quando o e-mail já existe).

## Suporte

- Issues: https://github.com/SeedGrid/seedgrid-fe-components/issues
- Repositório: https://github.com/SeedGrid/seedgrid-fe-components

## Licença

MIT
