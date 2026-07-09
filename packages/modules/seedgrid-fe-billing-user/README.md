# @seedgrid/fe-billing-user

[![npm version](https://img.shields.io/npm/v/%40seedgrid%2Ffe-billing-user)](https://www.npmjs.com/package/@seedgrid/fe-billing-user)
[![npm downloads](https://img.shields.io/npm/dm/%40seedgrid%2Ffe-billing-user)](https://www.npmjs.com/package/@seedgrid/fe-billing-user)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue)](https://www.typescriptlang.org/)

Módulo front de **billing do assinante** do SeedGrid: a visão do usuário final sobre a própria assinatura — plano atual, uso do ciclo, checkout, troca de plano com prévia de rateio, cancelamento/reativação e faturas. A visão de backoffice (cadastro de planos) fica no [`@seedgrid/fe-billing-platform`](https://www.npmjs.com/package/@seedgrid/fe-billing-platform). Compõe sobre o motor de sessão do [`@seedgrid/fe-security`](https://www.npmjs.com/package/@seedgrid/fe-security).

## Sumário

- [Funcionalidades](#funcionalidades)
- [Telas entregues pelo scaffold](#telas-entregues-pelo-scaffold)
- [Instalação](#instalação)
- [Uso rápido](#uso-rápido)
- [Backend correspondente](#backend-correspondente)
- [Suporte](#suporte)

## Funcionalidades

- **Assinatura corrente** — plano, status e resumo de uso do ciclo (`/me/subscription`, `/me/usage/summary`); extrato detalhado de uso com permissão `STATEMENT_READ`.
- **Checkout** — primeira assinatura via sessão de checkout do provedor de pagamento (redirect).
- **Troca de plano** — com **prévia do impacto** (rateio) antes de confirmar; upgrade imediato, downgrade agendado pro fim do ciclo; troca agendada pode ser cancelada.
- **Cancelar / reativar** — cancelamento agendado pro fim do ciclo vigente, reversível enquanto não efetivado.
- **Customer portal** — sessão do portal do provedor pra gestão de meio de pagamento.
- **Faturas** — prévia da próxima fatura (preço fixo + excedente acumulado) e histórico de cobranças.
- **i18n pronto** — `billingUserMessages` (en + pt-BR completos; es/fr/pt-PT com fallback).

O pacote exporta:

- `BillingUserPaths` — contrato dos endpoints REST (`/me/subscription`, `/me/plans`, `/me/usage/*`, `/me/billing/*`) — conferido contra os resources reais do backend.
- DTOs client-safe da assinatura, planos, uso e faturas.
- `billingUserMessages` (i18n).
- `createBillingUserServer` (em `@seedgrid/fe-billing-user/server`, SERVER-ONLY) — engine tipado sobre a sessão do fe-security; **todas as capacidades do engine têm UI correspondente no scaffold**.

## Telas entregues pelo scaffold

| Tela | Rota | O que faz |
| --- | --- | --- |
| Visão geral | `/billing` | Plano atual, uso do ciclo, acesso ao portal; cancelar, reativar e cancelar troca agendada (com confirmação) |
| Planos | `/billing/plans` | Catálogo assinável: sem assinatura → assinar (checkout); com assinatura → trocar, com diálogo de prévia do rateio |
| Faturas | `/billing/invoices` | Próxima fatura (prévia) + histórico de cobranças do provedor |

O scaffold também traz as rotas-proxy de API (`/api/billing/*` — checkout, portal, change-plan, cancel, reactivate, invoices, upcoming etc.), o bootstrap de servidor (compondo `createSecurityServer` + `createBillingUserServer` com a mesma sessão/cookie do app) e o submenu Billing (`useBillingUserAppShellSections`), gated por `BILLING_READ` — tudo wireado pelo SeedGrid CLI via `module.json` (`id: "billing-user"`, `requires: ["security"]`).

## Instalação

```bash
pnpm add @seedgrid/fe-billing-user @seedgrid/fe-security @seedgrid/fe-core
```

## Uso rápido

```ts
// server-only — compõe sobre a sessão do fe-security
import { createSecurityServer } from "@seedgrid/fe-security/server";
import { createBillingUserServer } from "@seedgrid/fe-billing-user/server";

const session = createSecurityServer({ /* ... */ });
export const billing = createBillingUserServer(session);

// Em uma rota/action:
const assinatura = await billing.getSubscription(); // pode ser null (sem assinatura)
const preview = await billing.getChangePreview("plan-pro");
await billing.changePlan({ planId: "plan-pro" }); // upgrade imediato / downgrade agendado
```

## Backend correspondente

Resources do `seedgrid-report-api`: `MeBillingResource`, `BillingCheckoutResource`, `SubscriptionResource`, `UsageResource`, `PlansCatalogResource`. Os paths foram auditados contra os `@Path` reais do backend.

## Suporte

- Issues: https://github.com/SeedGrid/seedgrid-fe-components/issues
- Repositório: https://github.com/SeedGrid/seedgrid-fe-components

## Licença

MIT
