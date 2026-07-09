# @seedgrid/fe-billing-platform

[![npm version](https://img.shields.io/npm/v/%40seedgrid%2Ffe-billing-platform)](https://www.npmjs.com/package/@seedgrid/fe-billing-platform)
[![npm downloads](https://img.shields.io/npm/dm/%40seedgrid%2Ffe-billing-platform)](https://www.npmjs.com/package/@seedgrid/fe-billing-platform)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue)](https://www.typescriptlang.org/)

Módulo front de **billing da plataforma** (backoffice de planos) do SeedGrid: cadastro de planos, faixas de preço (terms) com publicação/arquivamento e configuração do trial. É a visão de quem **opera** a plataforma — a visão do assinante fica no [`@seedgrid/fe-billing-user`](https://www.npmjs.com/package/@seedgrid/fe-billing-user). Compõe sobre o motor de sessão do [`@seedgrid/fe-security`](https://www.npmjs.com/package/@seedgrid/fe-security).

## Sumário

- [Funcionalidades](#funcionalidades)
- [Telas entregues pelo scaffold](#telas-entregues-pelo-scaffold)
- [Permissões](#permissões)
- [Instalação](#instalação)
- [Uso rápido](#uso-rápido)
- [Backend correspondente](#backend-correspondente)
- [Suporte](#suporte)

## Funcionalidades

- **CRUD de planos** — identidade (nome, código, descrição, ativo) e limiares de cota (upgrade prompt, warning, critical).
- **Faixas de preço (terms)** — cada plano tem terms versionados: criar faixa agendada (`effectiveFrom`), **publicar** (com publicação automática no provedor de pagamento), **arquivar** e excluir; terms agendados aceitam `PATCH`.
- **Trial** — leitura e edição da cota do trial (`monthlyRequests`).
- **i18n pronto** — `billingPlatformMessages` (en + pt-BR completos; es/fr/pt-PT com fallback).

O pacote exporta:

- `BillingPlatformPaths` — contrato dos endpoints REST (`/admin/plans`, `/admin/plans/trial`, `/admin/plans/{id}/terms`, publish/archive por term).
- DTOs client-safe: `PlanEntry`, `PlanTermEntry`, `CreatePlanTermResponse` etc. — conferidos contra o `AdminPlanResource.java` real.
- `billingPlatformMessages` (i18n).
- `createBillingPlatformServer` (em `@seedgrid/fe-billing-platform/server`, SERVER-ONLY) — engine tipado sobre a sessão do fe-security.

## Telas entregues pelo scaffold

| Tela | Rota | O que faz |
| --- | --- | --- |
| Lista de planos | `/platform/plans` | Tabela (nome, código, preço vigente, status) com criar/editar/excluir |
| Editor de plano | `/platform/plans/new` e `/platform/plans/[publicId]` | `PlanEditor` compartilhado: identidade do plano + limiares de cota |
| Faixas de preço | dentro da edição do plano | `TermsSection`: lista os terms, cria faixa agendada e permite publicar / arquivar / excluir nos agendados |
| Trial | `/platform/plans/trial` | Edita a cota mensal do trial |

O scaffold também traz as rotas-proxy de API (`/api/platform/plans/**`), o bootstrap de servidor (compondo `createSecurityServer` + `createBillingPlatformServer`) e a seção de navegação (`useBillingPlatformAppShellSections`), tudo wireado pelo SeedGrid CLI via `module.json` (`id: "billing-platform"`, `requires: ["security"]`).

## Permissões

Guardado pelo recurso CRUD `PLAN` (`PLAN_READ`, `PLAN_CREATE`, `PLAN_UPDATE`, `PLAN_DELETE`), mesma convenção do fe-security. No backend o `AdminPlanResource` é gateado por empresa-plataforma (`@MonoCompany`); a emissão das permissões `PLAN_*` fica com o seeding de roles.

## Instalação

```bash
pnpm add @seedgrid/fe-billing-platform @seedgrid/fe-security @seedgrid/fe-core
```

## Uso rápido

```ts
// server-only — compõe sobre a sessão do fe-security
import { createSecurityServer } from "@seedgrid/fe-security/server";
import { createBillingPlatformServer } from "@seedgrid/fe-billing-platform/server";

const session = createSecurityServer({ /* ... */ });
export const billingPlatform = createBillingPlatformServer(session);

// Em uma rota/action:
const planos = await billingPlatform.listPlans(); // PaginatedResult<PlanEntry>
const plano = await billingPlatform.getPlan(planId);
const criado = await billingPlatform.createTerm(planId, { /* CreatePlanTermRequest */ });
await billingPlatform.publishTerm(planId, termId);
const trial = await billingPlatform.getTrial();
```

## Backend correspondente

`AdminPlanResource` do `seedgrid-report-api` (`/admin/plans`). Os DTOs e verbos foram conferidos contra o resource real (inclusive o `PATCH` de term agendado e a resposta de publicação automática no Stripe).

## Suporte

- Issues: https://github.com/SeedGrid/seedgrid-fe-components/issues
- Repositório: https://github.com/SeedGrid/seedgrid-fe-components

## Licença

MIT
