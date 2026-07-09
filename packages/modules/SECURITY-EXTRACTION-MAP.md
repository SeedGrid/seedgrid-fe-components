# Security — Mapa de extração (planta baixa)

Fonte: inventário de `admin-web` (Next.js, single-tenant) e `seedgrid-report-client`
(Tauri, account-tenant), monorepo `lucrosis-reports/platform-monorepo`.

## Modelo de distribuição (decidido)

- **Lógica** (auth, sessão, refresh, 2FA, permissões, DTOs) → **lib npm versionada**
  (`@seedgrid/fe-*`). Não se edita no app; upgrade via versão. Segurança centraliza.
- **Tela** (pages/forms) → **scaffold dentro do app** (git do app). Edita à vontade.
  Modelo shadcn: a lib dá as peças, a tela é sua.
- **Modo finito** (account vs multi, OTP email/whatsapp) → **flag/variante escolhida
  no `seedgrid init`**. Condicional acontece na montagem (CLI/skill), não em runtime.

## Dois achados críticos

1. **Substratos diferentes.** admin-web = Next proxy server-side + cookies httpOnly +
   refresh no servidor (**arquitetura alvo**, o CLI gera Next). report-client = Tauri/Rust.
   As peças ACCOUNT do report-client precisam ser **portadas** para o modelo Next-proxy,
   não copiadas.
2. **MULTI não tem referência no front.** admin é single-tenant, report-client é account.
   `@seedgrid/fe-tenancy-multi` é **novo** — espelhar o backend `multitenancy`.

## Camadas de pacote

```
@seedgrid/fe-security-core   (comum aos dois modos)
        ▲                    ▲
@seedgrid/fe-tenancy-account   @seedgrid/fe-tenancy-multi
```

Um projeto é account OU multi (escolhido 1x no init) → o CLI fia só uma tenancy.
Zero dead code.

---

## Matriz 3×2

### CORE (fonte principal: admin-web)

**Lógica → lib `@seedgrid/fe-security-core`**
- `SecurityPaths` (endpoints) — já existe no `@seedgrid/fe-security` hoje
- Motor de sessão server: `fetchWithAdminSession` (401→refresh→retry single-flight),
  read/write/clear cookies, **distinção 401 (mata sessão) vs 403 (acesso negado, não desloga)**
  — `lib/seedgrid-report-api-server.ts`, `admin-session-cookies.ts`, `admin-auth.ts`
- `AdminAccessProvider` → `PermissionProvider` (`hasRole`/`hasPermission`, refetch `/me`
  por navegação, ADMIN-implies-all) — `app/components/AdminAccessProvider.tsx`
- Decode JWT identidade/audience — `admin-auth.ts`, `jwtIdentity.ts` (report-client)
- Parsing RFC7807 — `problem-response.ts`, `readError`/`isConnectionError`
- Stash 2FA pendente (tempToken) — `two-factor-pending.ts`
- **Algoritmo menu-por-permissão** (`filterNavItems`/`canShowItem`) + shape `NavItem`
  — `app/components/Shell.tsx` + `app/data.ts` (extrair algoritmo, NÃO a lista concreta)
- DTOs security: `UserEntry`, `RoleEntry`, `PermissionOption`, `AdminMePermissions`,
  `TwoFactor*`, `AuditLogEntry`, `PaginatedResult` (separar dos DTOs de domínio!)
- Padrão de **rota-proxy Next**: `fetchWithAdminSession` → `problemResponse` (gerar via helper)

**Tela → scaffold**
- Login — `app/login/page.tsx`
- Verify 2FA (OTP) — `app/auth/2fa/verify/page.tsx`
- Forgot / reset / confirm-email / welcome — `app/auth/**`
- Change password (self + forçado) — `app/security/change-password`, `app/change-password`
- **Users CRUD** — `app/security/users/{user_list,user_edit}` (template de referência)
- **Roles CRUD** + permission picker — `app/security/roles/{role_list,role_edit}`
- Audit viewer — `app/security/audit`
- Gerenciar 2FA self-service — `app/security/two-factor`
- Shell/menu — `app/components/Shell.tsx` (compõe algoritmo + `NavItem[]` do app)

### ACCOUNT (fonte: report-client, PORTAR p/ Next)

**Lógica → lib `@seedgrid/fe-tenancy-account`**
- `select-company` / `list-my-companies` — endpoints já em `SecurityPaths`
- Branch `company_selection_required` no login
- Signup público / `check-email-exists` / confirm OTP-email
- Self-enter (`selfEnter.*` já em `SecurityPaths`)
- Resolver nome da empresa escopada

**Tela → scaffold**
- `<CompanyScopePicker/>` — passo obrigatório pós-login — `CompanySelect.tsx`
- Signup público — `SignupForm.tsx` (shell fino; CNPJ/CPF/ViaCEP é BR-específico → plugável)
- "Trocar empresa" no shell
- Convite de usuário + aprovar/reprovar cadastro (self-enter)

### MULTI (⚠️ NOVO — espelhar backend `multitenancy`)

**Lógica → lib `@seedgrid/fe-tenancy-multi`**
- Resolver tenant por subdomínio/host + injetar header/contexto
- Login sem seleção de empresa (tenant vem da URL)

**Tela → scaffold**
- Login sem company-picker
- Provisionamento/admin do tenant

### Casos "existe nos dois, comporta diferente"
- **Users**: CRUD base = CORE; account **adiciona** convite+aprovação (self-enter).
- **Login**: `<LoginCore/>` = CORE; account compõe `<CompanyScopePicker/>`; multi resolve
  tenant pela URL. Como a tela é scaffold, o CLI dropa a variante certa no init.

---

## NÃO extrair (app-específico)

- admin: gate `audience === "platform"`, fallback `X-Company-Id`/"empresa 1"
  (é justamente o ponto onde account/multi plugam), allowlist `/assinatura` (Stripe),
  tema/logo/brand, páginas `session`/`migration`/`health`, DTOs de domínio
  (plans/billing/ai/reports) misturados em `lib/seedgrid-report-api.ts`.
- report-client: wizard CNPJ/ViaCEP (BR), `EmpresaSelector` (filtro de filial, NÃO é auth),
  `has_client_company` gate, `NAV_TREE`/`VIEW_PERMISSION` (conteúdo do app), hydration
  de report/AI/subscription dentro do `useClientSession`.

## Ordem de extração sugerida
1. `@seedgrid/fe-security-core` — lógica primeiro (motor de sessão, PermissionProvider,
   DTOs, SecurityPaths já pronto), depois scaffolds de Users/Roles/menu.
2. `@seedgrid/fe-tenancy-account` — portar CompanySelect + signup do report-client.
3. Reescrever CLI manifest-driven pra fiar (1) e (2).
4. `@seedgrid/fe-tenancy-multi` — novo.
