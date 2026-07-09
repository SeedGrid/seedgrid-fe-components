# @seedgrid/fe-apikeys

[![npm version](https://img.shields.io/npm/v/%40seedgrid%2Ffe-apikeys)](https://www.npmjs.com/package/@seedgrid/fe-apikeys)
[![npm downloads](https://img.shields.io/npm/dm/%40seedgrid%2Ffe-apikeys)](https://www.npmjs.com/package/@seedgrid/fe-apikeys)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue)](https://www.typescriptlang.org/)

Módulo front de **API keys** do SeedGrid: gestão de chaves de integração criadas **por role**, com segredo exibido uma única vez na criação. Compõe sobre o motor de sessão do [`@seedgrid/fe-security`](https://www.npmjs.com/package/@seedgrid/fe-security).

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tela entregue pelo scaffold](#tela-entregue-pelo-scaffold)
- [Instalação](#instalação)
- [Uso rápido](#uso-rápido)
- [Backend correspondente](#backend-correspondente)
- [Suporte](#suporte)

## Funcionalidades

- **Criar chave por role** — a resposta traz o segredo cru (`apiKey`) uma única vez; depois disso a API só devolve `prefix`/`masked`.
- **Listar chaves** — por role (visão de administração) ou do usuário corrente (`listMine`).
- **Revogar chave** — revogação com carimbo `revokedAt`; a listagem mostra também `lastUsedAt` e `expiresAt`.
- **Expiração opcional** — `expiresDays` na criação; ausente = sem expiração.

O pacote exporta:

- `ApiKeyPaths` — contrato dos endpoints REST (`/apikeys`, `/apikeys/role/{roleName}`, `/apikeys/{publicId}/revoke`).
- DTOs client-safe: `ApiKeyCreateRequest`, `ApiKeyCreateResponse`, `ApiKeyListItem`, `ApiKeyRevokeResponse`.
- `createApiKeysServer` (em `@seedgrid/fe-apikeys/server`, SERVER-ONLY) — engine tipado com `createForRole` / `listByRole` / `listMine` / `revoke`.

## Tela entregue pelo scaffold

| Tela | Rota | O que faz |
| --- | --- | --- |
| Gestão de API keys | `/security/api-keys` | Lista as chaves por role, cria chave nova (exibindo o segredo uma única vez, com aviso pra copiar) e revoga chaves existentes |

O scaffold é copiado para dentro do app pelo SeedGrid CLI (`module.json`: `id: "api-keys"`, `requires: ["security"]`) — o app é dono do código e pode personalizar a tela.

## Instalação

```bash
pnpm add @seedgrid/fe-apikeys @seedgrid/fe-security @seedgrid/fe-core
```

## Uso rápido

```ts
// server-only — compõe sobre a sessão do fe-security
import { createSecurityServer } from "@seedgrid/fe-security/server";
import { createApiKeysServer } from "@seedgrid/fe-apikeys/server";

const session = createSecurityServer({ /* ... */ });
export const apiKeys = createApiKeysServer(session);

// Em uma rota/action:
const nova = await apiKeys.createForRole("INTEGRATION", {
  name: "Integração ERP",
  expiresDays: 90,
});
console.log(nova.apiKey); // segredo completo — mostre UMA vez, não persista no front

const chaves = await apiKeys.listByRole("INTEGRATION");
await apiKeys.revoke(chaves[0].publicId);
```

## Backend correspondente

Extensão Quarkus `seedgrid-quarkus-ext-apikeys`. `ApiKeyPaths` é espelho do `RestControllerPath.java` da extensão — contrato único front/back.

## Suporte

- Issues: https://github.com/SeedGrid/seedgrid-fe-components/issues
- Repositório: https://github.com/SeedGrid/seedgrid-fe-components

## Licença

MIT
