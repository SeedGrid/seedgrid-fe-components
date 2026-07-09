# @seedgrid/fe-subdomain-tenancy

[![npm version](https://img.shields.io/npm/v/%40seedgrid%2Ffe-subdomain-tenancy)](https://www.npmjs.com/package/@seedgrid/fe-subdomain-tenancy)
[![npm downloads](https://img.shields.io/npm/dm/%40seedgrid%2Ffe-subdomain-tenancy)](https://www.npmjs.com/package/@seedgrid/fe-subdomain-tenancy)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue)](https://www.typescriptlang.org/)

Módulo front de **multitenancy por subdomínio** do SeedGrid: cada tenant vive no seu subdomínio (`empresa.seudominio.com`), com signup público que cria o tenant + usuário root. É a variante de tenancy por subdomínio — a variante por seleção de empresa no login fica no [`@seedgrid/fe-login-tenancy`](https://www.npmjs.com/package/@seedgrid/fe-login-tenancy) (`variantGroup: "tenancy"`, use uma ou outra). Compõe sobre o motor de sessão do [`@seedgrid/fe-security`](https://www.npmjs.com/package/@seedgrid/fe-security).

## Sumário

- [Funcionalidades](#funcionalidades)
- [Telas entregues pelo scaffold](#telas-entregues-pelo-scaffold)
- [Instalação](#instalação)
- [Uso rápido](#uso-rápido)
- [Backend correspondente](#backend-correspondente)
- [Suporte](#suporte)

## Funcionalidades

- **Signup de tenant** — cria o tenant + usuário root num só fluxo, com validação de e-mail por código e reenvio.
- **Regras de subdomínio** — helpers puros: `normalizeSubdomain`, `validateSubdomain`, `isReservedSubdomain`, `getSubdomainValidationKey` e a lista `RESERVED_SUBDOMAINS` — a mesma validação do backend, disponível pro feedback em tempo real no formulário.
- **Contexto de tenant no client** — `TenantProvider` / `useTenantContext` (em `@seedgrid/fe-subdomain-tenancy/client`), registrado automaticamente como provider do app pelo CLI.

O pacote exporta:

- `SubdomainTenancyPaths` — contrato dos endpoints públicos (`/public/tenants`, `validate-email`, `resend-email`).
- DTOs client-safe do signup de tenant (`tenant-signup`) — conferidos contra o `TenantSignupRequest.java` real.
- `subdomain-rules` (validação), `TenantProvider` (client) e `createSubdomainTenancyServer` (em `/server`, SERVER-ONLY, pra chamadas autenticadas pós-login).

## Telas entregues pelo scaffold

| Tela | Rota | O que faz |
| --- | --- | --- |
| Signup de tenant | `/signup` (público) | Wizard completo de cadastro BR (CNPJ, endereço via ViaCEP, UF/cidade), escolha de subdomínio com validação em tempo real e confirmação de e-mail |

O scaffold também traz as rotas de apoio de localização (`/api/locations/states`, `/api/locations/cities`) e as server actions públicas do fluxo de signup (criação do tenant, validação de e-mail, reenvio de ativação) — tudo copiado pelo SeedGrid CLI via `module.json` (`id: "subdomain-tenancy"`, `requires: ["security"]`, `variantGroup: "tenancy"`, provider `TenantProvider` registrado automaticamente).

## Instalação

```bash
pnpm add @seedgrid/fe-subdomain-tenancy @seedgrid/fe-security @seedgrid/fe-core
```

## Uso rápido

```tsx
// Client: validação de subdomínio em tempo real
import { normalizeSubdomain, validateSubdomain } from "@seedgrid/fe-subdomain-tenancy";

const sub = normalizeSubdomain(input);           // "Minha Empresa!" -> "minha-empresa"
const erro = validateSubdomain(sub);             // null se ok; chave de erro se inválido/reservado
```

```tsx
// Client: contexto do tenant corrente
import { TenantProvider, useTenantContext } from "@seedgrid/fe-subdomain-tenancy/client";

function Header() {
  const { tenant } = useTenantContext();
  return <span>{tenant?.name}</span>;
}
```

## Backend correspondente

Extensão Quarkus `seedgrid-quarkus-ext-subdomain-tenancy`. `SubdomainTenancyPaths` é espelho do `RestControllerPath.java` da extensão; os DTOs de signup foram conferidos contra o `TenantSignupRequest.java` real.

## Suporte

- Issues: https://github.com/SeedGrid/seedgrid-fe-components/issues
- Repositório: https://github.com/SeedGrid/seedgrid-fe-components

## Licença

MIT
