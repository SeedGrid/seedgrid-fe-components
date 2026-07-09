# `fe-backup` scaffold

Conteúdo copiado para dentro do app gerado pelo CLI (git do app, editável à
vontade — ver `seedgrid-cli/docs/adr/0004-module-manifest-contract.md`).
Extraído de `seedgrid-cli/templates/modules/backup/` (17 arquivos, todos sem
`{{...}}` real — nenhum ficou `.hbs`).

Mesmo critério lib vs scaffold do `fe-security`/`fe-subdomain-tenancy`:
import `@/...` real = scaffold; puro ou só-default-trivial = lib.

## Promovido pra `@seedgrid/fe-backup` (lib)

- `messages.ts` (`backupMessages`) — puro, zero import `@/...`.
- `export-status.ts` (`classifyExportStatus`, `isExportInProgress`,
  `isExportDownloadable`, `ExportStatusGroup`) — puro, opera só sobre o
  `ExportStatus` já em `backup.ts`.

## Corrigido: `BackupFormat`/`ArtifactInfo` (lib) estavam errados

Conferido contra o backend real
(`seedgrid-quarkus-ext-backup/runtime/.../domains/{BackupFormat,ExportScope,ExportStatus}.java`,
`dtos/ExportResponse.java`):

- `BackupFormat` em `backup.ts` tinha 8 valores fictícios
  (`CSV`, `CSV_ZIP`, `ETL`, `GDPR`, `LGPD`, `SQL`, `SQL_DUMP_ZIP`, `ZIP`) — o
  enum real só tem **2**: `CSV_ZIP`, `SQL_DUMP_ZIP`. Corrigido.
- `ArtifactInfo.id` era `string` — o DTO real (`ExportResponse.ArtifactInfo.id`)
  é `Long` → `number`. Corrigido.
- `ExportScope` (`DOMAIN`/`RAW`/`CUSTOM`) e `ExportStatus` (8 valores) já
  batiam certinho com o backend, não precisaram de ajuste.

Antes dessa correção, o scaffold (extraído dos templates do CLI, que sempre
usaram só os 2 formatos reais) tinha sua PRÓPRIA cópia local de
`BackupFormat`/`ArtifactInfo` porque divergia da lib. Depois da correção os
dois batem, então `scaffold/src/modules/backup/types.ts` virou um simples
reexport de `@seedgrid/fe-backup` (`ArtifactInfo`, `BackupFormat`,
`ExportRequest`, `ExportResponse`, `ExportScope`, `ExportStatus`) — nada
redeclarado.

## Ficou scaffold

- `app/backup/exports/(list)/page.tsx` (+ teste), `app/backup/exports/(create)/new/page.tsx`
  (+ teste) — telas concretas.
- `app/api/backup/exports/[jobId]/download/route.ts` — route handler: por
  natureza sempre scaffold (Next.js exige o arquivo num path físico
  específico).
- `modules/backup/config.ts` — `backupConfig.apiBaseUrl`/`routes`/`polling`
  são acoplados ao app (rotas concretas, polling interval).
- `modules/backup/services/{backup-api,backup-service}.ts` (+ testes) —
  `backup-api.ts` usa `backupConfig.apiBaseUrl` (local) e `@/i18n` (1 chave
  de fallback, mesmo padrão do `security-api.ts` do fe-security); `backup-service.ts`
  depende de `backup-api.ts`, então segue a mesma cadeia pra scaffold.
- `modules/backup/components/ExportStatusBadge.tsx` (+ teste) — usa
  `useI18n()` direto dentro do componente (chama `t(key)` internamente, ao
  contrário do `StatusBadge` do fe-security que recebe `label` já traduzido
  via prop). Daria pra decopiar do mesmo jeito, mas não foi feito nesta
  passada — ver Follow-ups.
- `modules/backup/useBackupAppShellSections.tsx` (+ teste) — hardcoda rota
  concreta (`backupConfig.routes.exports`) e usa `usePermission`/`@/i18n`.

## Follow-ups (fora do escopo desta extração)

- `ExportStatusBadge` poderia virar lib trocando `t(key)` interno por um
  prop `label: string` (mesmo padrão do `StatusBadge` do fe-security) — não
  fiz por tempo, mas é uma decoupling trivial se algum dia fizer falta.
- `backup-api.ts`/`backup-service.ts` têm o mesmo tipo de acoplamento que
  `security-api.ts`/`security-service.ts` do fe-security (`apiBaseUrl` local
  + 1 chamada de tradução) — mesma ressalva: promover exigiria injeção de
  config, redesenho deliberado, não mecânico.
