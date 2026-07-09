# `@seedgrid/fe-security` — Contrato do pacote (para revisão)

Complementa `SECURITY-EXTRACTION-MAP.md`. Este doc define **como** o pacote é
estruturado; o mapa define **o que** extrair de cada app.

Decisão: `fe-security-core` = **crescer o pacote `@seedgrid/fe-security` existente**
(não criar pacote novo). Hoje ele é `tsc` puro, 1 entry, só exporta `SecurityPaths`
(espelho de `RestControllerPath.java`). Nota: `paths.ts` já tem conceito account
(`users.membership(publicId, companyPublicId)` = roles do usuário NAQUELA company).

---

## O macete two-tier client (do admin-web) — base do valor do pacote

```
Componente client
   │  adminProxyClient  (createApiClient, baseUrl:"" → same-origin, SEM Bearer)
   ▼
/api/admin/...  (route handler Next)
   │  apiFetchSecurity / fetchWithAdminSession  (SERVER-ONLY)
   │     ├─ lê token do cookie httpOnly (next/headers)
   │     ├─ 401 → refresh single-flight → retry
   │     ├─ injeta X-Company-Id / service-token fallback
   │     └─ erro → ApiClientError → problemResponse → problem+json íntegro
   ▼
report-api (Java)
```

Ganho: **o Bearer/refresh nunca toca o browser**. O client só tem cookie httpOnly e
fala same-origin; quem segura o token e faz refresh é o server do Next. O problem+json
do report-api chega inteiro na UI via `extractApiErrorMessage`.

Dois clients:
- **padrão** = `createApiClient` do `@seedgrid/fe-core` (genérico, já é pacote) — usado
  como `adminProxyClient` (same-origin, cookie).
- **security server** = `fetchWithAdminSession`/`apiFetchSecurity` (só server, cookie→Bearer,
  refresh) — **este vai pro `fe-security-core`**.

Distinção crítica **401 vs 403** (já implementada, manter):
- 401 = sessão inválida/expirada → limpa cookies → login.
- 403 = autenticado SEM permissão (sessão válida) → só "Acesso negado", **nunca desloga**.

---

## 1. Três entry-points

Separar server de client é **obrigatório** — senão `next/headers`/`next/server` vazam
pro bundle client (o próprio admin já comenta isso no `index.ts`/`problem-response.ts`).

```jsonc
"exports": {
  ".":        // client-safe: SecurityPaths, DTOs, PermissionProvider, hooks, proxyClient factory, tipos de config
  "./server": // SERVER-ONLY: fetchWithAdminSession, apiFetchSecurity, problemResponse, buildServerApiHeaders
  "./paths":  // standalone (mantém o teste isolado que já existe hoje)
}
```

Novos peerDeps: `react` (provider), `next` (só o `/server`), `@seedgrid/fe-core`
(createApiClient/ApiClientError).

---

## 2. Config injetável

O que é hardcode do admin vira parâmetro que o app passa 1x. O fallback
`X-Company-Id`/service-token vira o **hook de tenancy** (onde account/multi plugam).

```ts
export interface SecurityServerConfig {
  apiBaseUrl: string;
  cookies: { token: string; refresh: string; passwordChangeRequired: string };
  // account injeta X-Company-Id; multi injeta header de tenant por host. core = vazio.
  resolveTenancyHeaders?: () => Promise<HeadersInit> | HeadersInit;
}
```

---

## 3. `module.ts` — manifesto lido pelo CLI reescrito

Separa o que é **lib importada** do que é **scaffold copiado**.

```ts
export const module = {
  id: "security-core",
  requires: [],
  npm: ["@seedgrid/fe-security", "@seedgrid/fe-core"],
  provider: { import: "PermissionProvider", from: "@seedgrid/fe-security" },
  env: ["SEEDGRID_REPORT_API_URL"],
  scaffold: [                         // copiado pro app (git do app, editável)
    "app/login/page.tsx",
    "app/auth/**", "app/change-password/**",
    "app/security/{users,roles,audit,two-factor}/**",
    "app/api/auth/**",                // rotas-proxy finas → chamam @seedgrid/fe-security/server
    "app/api/admin/security/**",
  ],
  menu: [                             // CLI injeta no menu via marcador, gated por permissão
    { key: "security.users", href: "/security/users/user_list", permission: "USER_READ" },
    { key: "security.roles", href: "/security/roles/role_list", permission: "ROLE_READ" },
    { key: "security.audit", href: "/security/audit",           permission: "LOG_READ"  },
  ],
};
```

---

## 4. Divisão física (lib vs scaffold)

```
@seedgrid/fe-security/src/          ← LIB (versionada, NÃO edita no app)
  paths.ts            (existe)
  dtos.ts             ← UserEntry, RoleEntry, PermissionOption, TwoFactor*, AuditLogEntry, PaginatedResult
  config.ts           ← SecurityServerConfig
  server/
    session.ts        ← fetchWithAdminSession + refresh single-flight + cookies (parametrizado)
    api.ts            ← apiFetchSecurity + buildServerApiHeaders + isInvalidAdminSessionResponse (401-vs-403)
    problem.ts        ← problemResponse
  client/
    proxyClient.ts    ← factory do adminProxyClient
    PermissionProvider.tsx  ← hasRole/hasPermission/refetch /me (ADMIN-implies-all)
    menu.ts           ← filterNavItems/canShowItem + tipo NavItem
  module.ts

app gerado/            ← SCAFFOLD (seu git, edita à vontade)
  app/login, app/security/{users,roles,audit,two-factor}, app/api/**
```

Ponto-chave: as rotas-proxy scaffoldadas são **finas** — só chamam `apiFetchSecurity`
do `/server`. Toda a lógica de token/refresh/401-vs-403 fica versionada na lib; você
nunca reescreve isso no app.

---

## Fontes de extração (arquivos do admin-web)

| Peça da lib | De onde (admin-web) |
|---|---|
| `server/session.ts` + `server/api.ts` | `lib/seedgrid-report-api-server.ts` |
| cookies | `lib/admin-session-cookies.ts`, `lib/admin-auth.ts` (nomes → config) |
| `server/problem.ts` | `lib/core/problem-response.ts` |
| `client/proxyClient.ts` | `lib/core/admin-proxy-client.ts` |
| `PermissionProvider` | `app/components/AdminAccessProvider.tsx` |
| `menu.ts` (algoritmo) | `app/components/Shell.tsx` (`filterNavItems`/`canShowItem`) + shape `NavItem` de `app/data.ts` |
| `dtos.ts` | separar os security DTOs de `lib/seedgrid-report-api.ts` (que mistura com domínio) |

Scaffolds (telas) — copiar de: `app/login`, `app/auth/**`, `app/change-password`,
`app/security/{users/user_list,users/user_edit,roles/role_list,roles/role_edit,audit,two-factor}`,
`app/api/auth/**`, `app/api/admin/security/**`. Gerar/padronizar com a skill `seedgrid-crud`.

NÃO extrair (app-específico do admin): gate `audience==="platform"`, allowlist
`/assinatura` (Stripe), tema/logo/brand, `NavItem[]` concreto, DTOs de domínio
(plans/billing/ai/reports).

---

## Próximo passo (aguardando aprovação)

Construir a **primeira peça: motor de sessão parametrizado** (`server/session.ts` +
`server/api.ts`), portando `seedgrid-report-api-server.ts` do admin com os constantes
virando `SecurityServerConfig`. É a fundação de que todo o resto depende.

Pontos abertos pra revisão:
- Nome dos entry-points (`./server`, `./paths`).
- Shape do `module.ts` (campos `scaffold`/`menu`/`provider`).
- Onde o tenancy-hook entra (`resolveTenancyHeaders` no config — ok?).
- `SEEDGRID_REPORT_API_URL` como nome da env (admin usa outro nome hoje).
