# @seedgrid/fe-audit

[![npm version](https://img.shields.io/npm/v/%40seedgrid%2Ffe-audit)](https://www.npmjs.com/package/@seedgrid/fe-audit)
[![npm downloads](https://img.shields.io/npm/dm/%40seedgrid%2Ffe-audit)](https://www.npmjs.com/package/@seedgrid/fe-audit)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue)](https://www.typescriptlang.org/)

Módulo front de **auditoria** do SeedGrid: consulta do trilho de auditoria (audit log) com filtros ricos e detalhe com estado antes/depois para diff. Compõe sobre o motor de sessão do [`@seedgrid/fe-security`](https://www.npmjs.com/package/@seedgrid/fe-security).

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tela de busca](#tela-de-busca)
- [Instalação](#instalação)
- [Uso rápido](#uso-rápido)
- [Backend correspondente](#backend-correspondente)
- [Suporte](#suporte)

## Funcionalidades

- **Listagem paginada de logs** com filtros: entidade, operação (`CREATE`/`UPDATE`/`DELETE`/`READ`/`OTHER`), usuário, faixa de datas, faixa de ids, descrição e metadados (`metaKey`/`metaValue`).
- **Combos de filtro dinâmicos** — endpoints de entidades distintas e usuários distintos alimentam os selects da tela.
- **Detalhe do registro** — cada `AuditLogEntry` traz `beforeState`/`afterState` (JSON serializado) para renderizar o diff da alteração, além de origem, IP, user-agent e operação técnica.

O pacote exporta:

- `AuditPaths` — contrato dos endpoints REST (`/audit-logs`, `/audit-logs/entities`, `/audit-logs/users`, `/audit-logs/{id}`).
- DTOs client-safe: `AuditLogEntry`, `AuditLogFilters`, `AuditLogEntityOption`, `AuditLogUserOption`, `AuditOperation`.
- `createAuditServer` (em `@seedgrid/fe-audit/server`, SERVER-ONLY) — engine tipado de consulta sobre a sessão do fe-security.

## Tela de busca

A tela de busca de auditoria é **scaffold** (o app é dono do código) e é entregue pelo SeedGrid CLI ao adicionar o módulo (`module.json`: `id: "audit"`, `requires: ["security"]`): grid paginado com os filtros acima e painel de detalhe com o diff antes/depois.

## Instalação

```bash
pnpm add @seedgrid/fe-audit @seedgrid/fe-security @seedgrid/fe-core
```

## Uso rápido

```ts
// server-only — compõe sobre a sessão do fe-security
import { createSecurityServer } from "@seedgrid/fe-security/server";
import { createAuditServer } from "@seedgrid/fe-audit/server";

const session = createSecurityServer({ /* ... */ });
export const audit = createAuditServer(session);

// Em uma rota/action:
const page = await audit.searchLogs({
  entity: "User",
  operation: "UPDATE",
  operationDateFrom: "2026-07-01",
  page: 0,
  size: 20,
});
```

## Backend correspondente

Audit Log Controller do `seedgrid-report-api` (motor de auditoria da lib `seedgrid-quarkus-lib-audit`). `AuditPaths` é o contrato único front/back.

## Suporte

- Issues: https://github.com/SeedGrid/seedgrid-fe-components/issues
- Repositório: https://github.com/SeedGrid/seedgrid-fe-components

## Licença

MIT
