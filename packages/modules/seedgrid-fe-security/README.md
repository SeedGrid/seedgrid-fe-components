# @seedgrid/fe-security

[![npm version](https://img.shields.io/npm/v/%40seedgrid%2Ffe-security)](https://www.npmjs.com/package/@seedgrid/fe-security)
[![npm downloads](https://img.shields.io/npm/dm/%40seedgrid%2Ffe-security)](https://www.npmjs.com/package/@seedgrid/fe-security)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue)](https://www.typescriptlang.org/)

Módulo de segurança do front SeedGrid: autenticação com sessão server-side (Next.js), 2FA, gestão de usuários, roles, permissões e empresas. É o módulo-base dos demais módulos front (`fe-apikeys`, `fe-audit`, `fe-backup`, `fe-billing-*`, `fe-login-tenancy`, `fe-self-enter`, `fe-subdomain-tenancy` declaram `requires: ["security"]`).

## Sumário

- [O que este pacote contém](#o-que-este-pacote-contém)
- [Telas entregues pelo scaffold](#telas-entregues-pelo-scaffold)
- [Instalação](#instalação)
- [Uso rápido](#uso-rápido)
- [Permissões](#permissões)
- [Backend correspondente](#backend-correspondente)
- [Suporte](#suporte)

## O que este pacote contém

O pacote tem três camadas:

**Lib client-safe** (`@seedgrid/fe-security`) — sem imports de `next/*`, pode entrar em bundle client:

- `SecurityPaths` — contrato único dos paths REST (auth, 2FA, users, roles, permissions, companies, me, self-enter), espelho do `RestControllerPath.java` da extensão backend.
- Helpers de permissão: `normalizePermission`, `hasPermission`, `hasAnyPermission`, `hasAllPermissions`, `buildCrudPermissions`, `createPermissionSet`.
- DTOs de usuários, roles, permissões, empresas e sessão (`session-contract`, `session-result`, `server-contract`).
- `securityMessages` — bundle i18n (en, pt-BR, es, fr, pt-PT).

**Componentes client** (`@seedgrid/fe-security/client`):

- `PermissionProvider` — contexto de permissões do usuário logado.
- `PickListField`, `StatusBadge` — componentes usados nas telas de CRUD.

**Motor server-side** (`@seedgrid/fe-security/server`) — SERVER-ONLY:

- `createSecurityServer` — motor de sessão (login, refresh de token, logout, 2FA) com cookie httpOnly; é a fundação sobre a qual os outros módulos compõem os seus engines.
- Helpers de rota: `toRouteResponse`, respostas Problem+JSON (`toProblem`, `problemResponse`) e helpers de server action.

## Telas entregues pelo scaffold

O diretório `scaffold/` é copiado para dentro do app gerado pelo SeedGrid CLI (o app é dono do código e pode editar à vontade):

| Tela | Rota | O que faz |
| --- | --- | --- |
| Login | `/auth/login` | Autenticação com e-mail/senha; redireciona pro 2FA quando exigido |
| Verificação 2FA | `/auth/2fa/verify` | Confirma o código do segundo fator (com reenvio) |
| Esqueci a senha | `/auth/forgot-password` (+ `confirm`, `success`) | Fluxo completo de recuperação de senha |
| Boas-vindas | `/auth/welcome` | Primeira entrada / confirmação de e-mail |
| Usuários | `/security/users` (lista, novo, edição) | CRUD de usuários com avatar, membership por empresa |
| Roles | `/security/roles` (lista, novo, edição) | CRUD de roles com atribuição de permissões |
| Empresas | `/security/companies` (lista, novo, edição) | CRUD de empresas (guardado por `CompanyManagementGuard`) |
| Perfil | `/security/profile` | Dados do próprio usuário |
| Configuração 2FA | `/security/2fa` | Habilitar/desabilitar segundo fator (TOTP) |
| Trocar senha | `/users/change-password` | Troca de senha do usuário logado |

O scaffold também traz o `AuthProvider`, `RouteGuard` (proteção de rotas), `AppShell` com menu por permissão (`useSecurityAppShellSections`), dashboard de segurança e as rotas-proxy de API (`/api/security/session/*`, avatar de usuário).

## Instalação

```bash
pnpm add @seedgrid/fe-security @seedgrid/fe-core @seedgrid/fe-components
```

A forma recomendada de consumir o módulo é via **SeedGrid CLI**, que copia o scaffold, registra navegação/i18n e configura o `module.json` automaticamente.

## Uso rápido

```ts
// src/modules/security/server/server-api.ts (server-only)
import { createSecurityServer } from "@seedgrid/fe-security/server";

export const session = createSecurityServer({
  apiBaseUrl: process.env.SEEDGRID_API_BASE_URL!,
  cookies: { /* nomes dos cookies de sessão do app */ },
  serviceToken: process.env.SEEDGRID_REPORT_API_TOKEN, // fallback server-to-server
});
```

```ts
// Qualquer módulo dependente compõe sobre a mesma sessão:
import { createApiKeysServer } from "@seedgrid/fe-apikeys/server";
export const apiKeys = createApiKeysServer(session);
```

```tsx
// Client: checagem de permissão
import { hasPermission, buildCrudPermissions } from "@seedgrid/fe-security";

const USER_PERMISSIONS = buildCrudPermissions("USER"); // USER_READ, USER_CREATE, ...
if (hasPermission(userPermissions, USER_PERMISSIONS.read)) {
  // renderiza a lista de usuários
}
```

## Permissões

As telas de CRUD seguem a convenção `RECURSO_AÇÃO`: `USER_*`, `ROLE_*`, `COMPANY_*` (`READ`/`CREATE`/`UPDATE`/`DELETE`). O menu do `AppShell` esconde seções que o usuário não pode acessar e o `RouteGuard` bloqueia acesso direto por URL.

## Backend correspondente

Este módulo conversa com a extensão Quarkus `seedgrid-quarkus-ext-security`. Os paths de `SecurityPaths` são espelho 1:1 do `RestControllerPath.java` — mudou um path no backend, atualize aqui também.

Variável de ambiente exigida pelo scaffold: `SEEDGRID_REPORT_API_TOKEN`.

## Suporte

- Issues: https://github.com/SeedGrid/seedgrid-fe-components/issues
- Repositório: https://github.com/SeedGrid/seedgrid-fe-components

## Licença

MIT
