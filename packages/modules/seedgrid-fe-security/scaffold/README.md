# `fe-security` scaffold

Conteúdo copiado para dentro do app gerado pelo CLI (git do app, editável à
vontade — ver `seedgrid-cli/docs/adr/0004-module-manifest-contract.md`).
Extraído de `seedgrid-cli/templates/modules/security/`.

## Critério lib vs scaffold usado nesta extração

Regra objetiva aplicada arquivo a arquivo: **qualquer import de um alias
`@/...`** (`@/config/*`, `@/i18n`, `@/theme`, `@/modules/core`,
`@/components/layout/*`) **só resolve dentro do app gerado** — um pacote npm
publicado não tem acesso a esses aliases. Então:

- **Sem nenhum import `@/...`** → candidato a lib (`src/` do pacote).
- **Com import `@/...` usado só como valor default trivial** (ex.:
  `delayMs = securityConfig.search.debounceMs`) → decoupar (virar parâmetro
  com default literal) e promover.
- **Com import `@/...` usado em fluxo de controle/rota concreta** (redirects,
  comparação de pathname, `securityConfig.apiBaseUrl` pra chamar a própria
  rota-proxy do app) → fica scaffold. Não vale a pena forçar injeção de config
  pra tudo nesta passada — fica como follow-up se algum dia fizer falta.

`@/modules/core` é caso à parte: é só um shim local que reexporta
`@seedgrid/fe-core` (não é acoplamento de verdade). Ao promover um arquivo pra
lib, trocar `@/modules/core` por `@seedgrid/fe-core` direto.

## O que foi promovido pra `@seedgrid/fe-security` (lib)

- `permissions.ts` (`normalizePermission`, `hasPermission`, `hasAnyPermission`,
  `hasAllPermissions`, `buildCrudPermissions`, `createPermissionSet`) — puro,
  zero import `@/...`.
- `messages.ts` (`securityMessages`) — puro, 5 locales, zero import `@/...`.
- `components/StatusBadge.tsx`, `components/PickListField.tsx` — puros
  (`PickListOption` também promovido, foi pra `dtos.ts` do pacote).

## O que ficou scaffold (e por quê)

- `AuthProvider.tsx`, `components/RouteGuard.tsx`, `navigation.ts` — fluxo de
  redirect hardcoda rotas concretas (`securityConfig.routes.login` etc.).
- `config.ts` — `securityConfig.routes`/`pagination` são a própria estrutura
  de rotas do app; muda se o app mover uma tela de lugar.
- `services/security-api.ts`, `services/security-service.ts`,
  `services/auth-service.ts` — a camada de fetch client-side chama a própria
  rota-proxy do app (`securityConfig.apiBaseUrl`) e (no caso de
  `security-api.ts`) usa `@/i18n` pra 1 mensagem de fallback. Dava pra
  decopiar com injeção de config, mas não foi feito nesta passada — ver
  "Follow-ups" abaixo.
- `components/PageFrame.tsx` (+`InlineNotice`) — usa `@/theme`
  (`useSgTheme`), que é implementação própria do base-app, sem equivalente
  npm hoje.
- `components/AppShell.tsx`, `components/SecurityDashboard.tsx`,
  `useSecurityAppShellSections.tsx` — acopladas a `@/i18n` +
  `@/components/layout/*` e têm menu/rotas concretas. Estes 3 mantiveram
  `.hbs` (têm `{{...}}` de verdade — condicionais por config do projeto,
  ex. `security_api_keys_enabled`); os demais viraram `.ts`/`.tsx` puro (não
  tinham templating real, só texto que por acaso teria a mesma extensão).
- `hooks/useAuth.ts`, `hooks/usePermission.ts`,
  `components/CompanyManagementGuard.tsx`, `host-access.ts`, `types.ts`,
  `utils.ts` — dependem, direta ou indiretamente, de algo acima que ficou
  scaffold (ex.: `useAuth` depende do `AuthProvider` scaffold).

`index.ts` (barrel local do scaffold) mistura os dois: reexporta os itens
promovidos direto de `@seedgrid/fe-security`/`@seedgrid/fe-security/client`, e
mantém os demais como arquivo local — igual a como um app gerado hoje já
usa esse barrel, só com a origem de alguns exports trocada.

## Motor de sessão unificado (o "dois motores" foi resolvido em parte)

Havia dois motores de **fetch autenticado** paralelos: o `server/server-api.ts`
(`createServerApiClient`, scaffold) e o `createSecurityServer` da lib
(`src/server/`, usado por todos os módulos compostos — billing/tenancy/backup).
O único consumidor do antigo era o proxy de avatar.

**Resolvido**: `server/server-api.ts` foi REMOVIDO. O avatar agora usa
`server/session-server.ts` (`getSecuritySessionServer()` → `createSecurityServer`
com a config de cookie do app) e `fetchWithSession()` — o MESMO motor do resto
do app. Um motor de fetch autenticado só.

**Deixado de propósito**: `server/session-routes.ts` (rotas públicas de
login/2fa/refresh/logout em `app/api/security/session/**`) NÃO foi migrado.
Ele não é um motor duplicado — é o **estabelecimento** de sessão (fluxos
públicos que criam os cookies), enquanto o `createSecurityServer` é o consumo
autenticado depois. Migrá-lo mexeria em semântica sutil de cookie (o antigo
seta `maxAge` do refresh = 30d configurável; o `applySessionCookies` do motor
novo grava cookie de sessão sem `maxAge`) e no dedup de refresh concorrente
(`Map`), no caminho MAIS crítico (login) e SEM testes de runtime pra pegar
regressão. Fica como follow-up com essa ressalva explícita.

## Follow-ups (fora do escopo desta extração)

- Promover `security-api.ts`/`security-service.ts`/`auth-service.ts` pra lib
  exigiria injeção de config (ex.: aceitar um `createApiClient` já configurado
  em vez de montar um com `securityConfig.apiBaseUrl` fixo). Ganho real (essa
  é a camada de maior volume de código), mas é redesenho deliberado, não
  mecânico — não fazer de afogadilho.
- `AuthProvider`/`RouteGuard` também dava pra promover injetando as rotas via
  props/config em vez de importar `securityConfig` direto. Mesma ressalva.
