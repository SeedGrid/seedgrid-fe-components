# `fe-billing-platform` scaffold — backoffice de planos, construído do zero

As 4 telas do backoffice de planos (o item que faltava do módulo — antes ele
só tinha DTOs/paths/server, sem UI nenhuma) foram construídas nesta passada
seguindo a convenção do SeedGrid CLI (`PageFrame`/`RouteGuard`/`useI18n`,
inputs controlados), **não** adaptadas do admin-web (que usa rxjs + um stack
Shell/AdminAccessProvider próprio). Revisão humana recomendada — é construção
nova.

## Telas

- **plan_list** — `app/platform/plans/(list)/page.tsx`: tabela de planos
  (nome, código, preço vigente, status), criar/editar/excluir.
- **plan_editor** — `editors/PlanEditor.tsx` (compartilhado por
  `(create)/new` e `(edit)/[publicId]`): identidade do plano (nome, código,
  descrição, ativo) + limiares de cota (upgrade prompt, warning, critical).
- **plan_terms** — `editors/TermsSection.tsx` (dentro da tela de edição):
  lista as faixas de preço (terms) do plano, cria nova faixa agendada, e nos
  agendados permite **publicar / arquivar / excluir**.
- **plan_trial** — `app/platform/plans/trial/page.tsx`: edita a cota
  (`monthlyRequests`) do trial.

Mais: `modules/billing-platform/server.ts` (bootstrap compondo
`createSecurityServer` + `createBillingPlatformServer`), as rotas finas em
`app/api/platform/plans/**`, a seção de navegação
(`useBillingPlatformAppShellSections`, wireada via o campo `navigation` do
`module.ts`), e o bundle de i18n `billingPlatformMessages` (lib, en + pt-BR;
es/fr→en, pt-PT→pt-BR; wireado via `messages`).

## Permissões

Guardado pelo recurso CRUD `PLAN` (`PLAN_READ`/`PLAN_CREATE`/`PLAN_UPDATE`/
`PLAN_DELETE`), mesma convenção do fe-security (USER/ROLE/COMPANY). O backend
(`AdminPlanResource`) gateia por `@MonoCompany` (empresa-plataforma), não por
uma permissão granular — então quem emite `PLAN_*` pro usuário root da
plataforma é responsabilidade do seeding de roles no backend.

## Lib: corrigido antes (conferido contra `AdminPlanResource.java` real)

- `updateTerm` usava **PUT**; o backend usa **PATCH** com `PatchPlanTermRequest`
  (só term AGENDADO). `listTerms` agora é `PaginatedResult<PlanTermEntry>`
  (o backend pagina). `createTerm` devolve `CreatePlanTermResponse`
  (`published`/`publishError` da publicação automática no Stripe).
- `PlanEntry`/`PlanTermEntry` viraram `type` (eram `interface`) pra
  satisfazerem a constraint `SgDatatableRow` (`Record<string, unknown>`).

## Decisões / o que foi assumido (revisar)

- **Edição in-place de term agendado (PATCH)** não tem UI: a `TermsSection`
  cria faixas novas e faz publish/archive/delete nos agendados. O `updateTerm`
  existe no server mas não é exposto — follow-up leve.
- Preço/moeda em **BRL** fixo (`Intl.NumberFormat`), como no fe-billing-user.
- `effectiveFrom` como `<input type="date">`; em branco = vigora já.
- `featuresJson`/`providerPriceId` do term não editáveis na UI (avançados).
- Traduções es/fr/pt-PT reais ainda podem ser refinadas (hoje fallback).

## Validação

App gerado com `security` + `billing-platform`: **tsc 0 erros**; navegação e
i18n corretamente wirados pelo CLI. Junto veio o fix de um bug real: os módulos
com nav (security, backup) **omitiam `navigation` no manifest**, então o menu
da app gerada ficava vazio — agora declaram via `@/modules/...` (mesmo
mecanismo do `provider`).
