# @seedgrid/fe-self-enter

[![npm version](https://img.shields.io/npm/v/%40seedgrid%2Ffe-self-enter)](https://www.npmjs.com/package/@seedgrid/fe-self-enter)
[![npm downloads](https://img.shields.io/npm/dm/%40seedgrid%2Ffe-self-enter)](https://www.npmjs.com/package/@seedgrid/fe-self-enter)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue)](https://www.typescriptlang.org/)

Módulo front de **auto-cadastro de usuário** (self-enter) do SeedGrid: pedido público de entrada, convites de administrador e fila de aprovação. Não confundir com o registro de **empresa** (`fe-login-tenancy`/`fe-subdomain-tenancy`) — aqui é o cadastro de **usuário** (nome/e-mail/senha) numa conta já existente. Compõe sobre o motor de sessão do [`@seedgrid/fe-security`](https://www.npmjs.com/package/@seedgrid/fe-security).

## Sumário

- [Funcionalidades](#funcionalidades)
- [Telas entregues pelo scaffold](#telas-entregues-pelo-scaffold)
- [Instalação](#instalação)
- [Uso rápido](#uso-rápido)
- [Backend correspondente](#backend-correspondente)
- [Suporte](#suporte)

## Funcionalidades

Feature **opcional** com 3 modos no backend: `disabled` / `invite-only` / `public`.

- **Pedido público** — usuário pede acesso com nome/e-mail/senha; o pedido passa por confirmação de e-mail e aprovação (`PENDING_EMAIL` → `PENDING_APPROVAL` → `APPROVED`/`REJECTED`/`EXPIRED`).
- **Convites** — administrador convida por e-mail (`origin: INVITE`); o convidado completa o cadastro pelo token, com reenvio disponível.
- **Aprovação** — fila de pedidos pendentes com aprovar/rejeitar, registrando quem aprovou/rejeitou e quando.

O pacote exporta:

- DTOs client-safe: `CreateEntryRequest`, `EntryRequestResponse`, `CreateEntryInvitation`, `EntryInvitationResponse`, `EntryRequestStatus`, `EntryRequestOrigin`.
- `createSelfEnterServer` (em `@seedgrid/fe-self-enter/server`, SERVER-ONLY) — engine tipado sobre a sessão do fe-security.
- Os paths REST ficam em `SecurityPaths.selfEnter` (do `@seedgrid/fe-security`), pois a feature vive na extensão de security do backend.

## Telas entregues pelo scaffold

| Tela | Rota | O que faz |
| --- | --- | --- |
| Pedido de acesso | `/auth/self-enter` (público) | Formulário de auto-cadastro (nome/e-mail/senha) com confirmação de e-mail |
| Convites | `/self-enter/invitations` | Administração de convites: criar, listar e reenviar |
| Aprovações | `/self-enter/requests/to-approve` | Fila de pedidos pendentes com aprovar/rejeitar |

Scaffold copiado pelo SeedGrid CLI via `module.json` (`id: "self-enter"`, `requires: ["security"]`) — o app é dono do código.

## Instalação

```bash
pnpm add @seedgrid/fe-self-enter @seedgrid/fe-security @seedgrid/fe-core
```

## Uso rápido

```ts
// server-only — compõe sobre a sessão do fe-security
import { createSecurityServer } from "@seedgrid/fe-security/server";
import { createSelfEnterServer } from "@seedgrid/fe-self-enter/server";

const session = createSecurityServer({ /* ... */ });
export const selfEnter = createSelfEnterServer(session);

// Admin: convidar e aprovar
await selfEnter.createInvitation({ name: "Maria", email: "maria@empresa.com" });
const pendentes = await selfEnter.listToApprove();
await selfEnter.approve(pendentes[0].id);
```

## Backend correspondente

Feature self-enter da extensão Quarkus `seedgrid-quarkus-ext-security` (endpoints `/self-enter/*` autenticados e `/public/self-enter/*` públicos).

## Suporte

- Issues: https://github.com/SeedGrid/seedgrid-fe-components/issues
- Repositório: https://github.com/SeedGrid/seedgrid-fe-components

## Licença

MIT
