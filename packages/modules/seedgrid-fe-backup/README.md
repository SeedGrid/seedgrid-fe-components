# @seedgrid/fe-backup

[![npm version](https://img.shields.io/npm/v/%40seedgrid%2Ffe-backup)](https://www.npmjs.com/package/@seedgrid/fe-backup)
[![npm downloads](https://img.shields.io/npm/dm/%40seedgrid%2Ffe-backup)](https://www.npmjs.com/package/@seedgrid/fe-backup)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue)](https://www.typescriptlang.org/)

Módulo front de **backup/exportação de dados** do SeedGrid: criação de jobs de export, acompanhamento de status com polling e download do artefato gerado. Compõe sobre o motor de sessão do [`@seedgrid/fe-security`](https://www.npmjs.com/package/@seedgrid/fe-security).

## Sumário

- [Funcionalidades](#funcionalidades)
- [Telas entregues pelo scaffold](#telas-entregues-pelo-scaffold)
- [Instalação](#instalação)
- [Uso rápido](#uso-rápido)
- [Backend correspondente](#backend-correspondente)
- [Suporte](#suporte)

## Funcionalidades

- **Criar export** — formatos `CSV_ZIP` e `SQL_DUMP_ZIP`, escopos `DOMAIN` / `RAW` / `CUSTOM`.
- **Acompanhar status** — o job passa por 8 estados; helpers puros classificam o andamento: `classifyExportStatus`, `isExportInProgress`, `isExportDownloadable` (`ExportStatusGroup`).
- **Baixar o artefato** — download em `application/zip` via rota-proxy do app.
- **Remover exports** antigos.
- **i18n pronto** — `backupMessages` (bundle de mensagens das telas).

O pacote exporta:

- `BackupPaths` — contrato dos endpoints REST (`/exports`, `/exports/{jobId}`, `/exports/{jobId}/download`).
- DTOs client-safe: `ExportRequest`, `ExportResponse`, `ArtifactInfo`, `BackupFormat`, `ExportScope`, `ExportStatus` — conferidos 1:1 contra os enums/DTOs reais do backend.
- Helpers de status (`export-status`) e `backupMessages` (i18n).
- `createBackupServer` (em `@seedgrid/fe-backup/server`, SERVER-ONLY) — engine tipado sobre a sessão do fe-security.

## Telas entregues pelo scaffold

| Tela | Rota | O que faz |
| --- | --- | --- |
| Lista de exports | `/backup/exports` | Grid dos jobs com `ExportStatusBadge` (status colorido), polling de andamento, download quando pronto e exclusão |
| Novo export | `/backup/exports/new` | Formulário de criação (formato + escopo) |

O scaffold também traz o route handler de download (`/api/backup/exports/[jobId]/download`), a seção de navegação (`useBackupAppShellSections`, wireada automaticamente pelo CLI via `module.json`) e os services client-side com testes.

`module.json`: `id: "backup"`, `requires: ["security"]`, navegação e mensagens declaradas — o SeedGrid CLI registra tudo sozinho ao adicionar o módulo.

## Instalação

```bash
pnpm add @seedgrid/fe-backup @seedgrid/fe-security @seedgrid/fe-core
```

## Uso rápido

```ts
// server-only — compõe sobre a sessão do fe-security
import { createSecurityServer } from "@seedgrid/fe-security/server";
import { createBackupServer } from "@seedgrid/fe-backup/server";

const session = createSecurityServer({ /* ... */ });
export const backup = createBackupServer(session);

// Em uma rota/action:
const job = await backup.createExport({ format: "CSV_ZIP", scope: "DOMAIN" });
const status = await backup.getExportStatus(job.jobId);
```

```ts
// Client: classificar o status pra UI
import { classifyExportStatus, isExportDownloadable } from "@seedgrid/fe-backup";

const group = classifyExportStatus(job.status); // "inProgress" | "success" | "failure" ...
if (isExportDownloadable(job.status)) {
  // habilita o botão de download
}
```

## Backend correspondente

Extensão Quarkus `seedgrid-quarkus-ext-backup`. `BackupPaths` é espelho do `RestControllerPath.java` da extensão; os DTOs foram conferidos contra `BackupFormat`, `ExportScope`, `ExportStatus` e `ExportResponse` reais.

## Suporte

- Issues: https://github.com/SeedGrid/seedgrid-fe-components/issues
- Repositório: https://github.com/SeedGrid/seedgrid-fe-components

## Licença

MIT
