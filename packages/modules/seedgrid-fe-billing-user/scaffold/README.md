# `fe-billing-user` scaffold

Conteúdo copiado para dentro do app gerado pelo CLI (git do app, editável à
vontade — ver `seedgrid-cli/docs/adr/0004-module-manifest-contract.md`).

## Sem fonte histórica — tela construída do zero

Ao contrário do `fe-security`/`fe-subdomain-tenancy`/`fe-backup` (extraídos de
`seedgrid-cli/templates/modules/...`), este pacote **não tinha nenhuma tela
pra extrair**. A única coisa parecida encontrada foi
`admin-web/app/billing/page.tsx` — mas essa tela é a visão da PLATAFORMA
(lista agregada de assinaturas de TODOS os tenants, MRR estimado, tenants em
excedente), não a visão do usuário final vendo a própria assinatura. Servem
públicos diferentes (staff da plataforma vs. cliente final), então não foi
adaptada — a tela aqui (`app/billing/page.tsx`) foi desenhada do zero em cima
do engine já pronto (`src/server/create-billing-user-server.ts`), seguindo o
mesmo layout/componentes (`PageFrame`, `RouteGuard`, `SgCard`, `useI18n()` +
chaves de tradução) já estabelecidos no `fe-security`.

**Revisão humana recomendada** — telas construídas do zero.

Cobertura atual (todas as capacidades do `BillingUserServer` têm UI):
- **Visão geral** (`app/billing/page.tsx`): plano atual, uso do ciclo, portal;
  agora também **cancelar** (`cancel`), **reativar** (`reactivate`) e
  **cancelar troca agendada** (`cancel-scheduled-change`), com confirmação.
- **Catálogo/checkout** (`app/billing/plans/page.tsx`): lista `listPlans`; sem
  assinatura → **assinar** (`createCheckout` → redirect ao provedor); com
  assinatura → **trocar** com prévia (`getChangePreview` → diálogo →
  `changePlan`, upgrade imediato / downgrade agendado).
- **Faturas** (`app/billing/invoices/page.tsx`): próxima fatura
  (`getUpcomingInvoice`) + histórico (`listInvoices`, item cru do provedor
  lido defensivamente).
- **Navegação**: submenu Billing (overview / plans / invoices), gated por
  `BILLING_READ`, wireado via o campo `navigation` do `module.ts`.

## O que já existia (trabalho de um agente anterior, verificado)

`src/billing.ts` (DTOs) e `src/paths.ts` já tinham sido conferidos contra o
backend real (`MeBillingResource`/`BillingCheckoutResource`/`SubscriptionResource`
em `seedgrid-report-api`) **antes** desta sessão continuar o trabalho —
várias correções já registradas nos comentários desses arquivos (paths com
prefixo errado, `CheckoutRequest`/`PortalRequest` com campos que o backend
não aceita, endpoints de troca/cancelamento de assinatura adicionados). Não
refiz essa auditoria, só continuei a partir dela.

## Adicionado nesta passada

- `src/messages.ts` (`billingUserMessages`) — mensagens da tela, en/pt-BR
  completas, es/fr/pt-PT com fallback pro inglês (tradução real pendente).
- `scaffold/src/modules/billing-user/server.ts` (`.hbs` — só arquivo com
  templating real, nome de cookie por `{{project_slug}}`) — bootstrap que
  compõe `createSecurityServer` (fe-security) + `createBillingUserServer`
  (este pacote). Mesma convenção de nome de cookie que
  `modules/security/server/server-api.ts` usa, pra funcionar com a MESMA
  sessão do usuário logado.
- `scaffold/src/app/api/billing/{me,portal}/route.ts` — rotas finas
  (`toRouteResponse` de `@seedgrid/fe-security/server`), thin proxies pro
  engine.
- `scaffold/src/app/billing/page.tsx` — a tela em si.

## Follow-ups

- `getUsageStatement` (extrato detalhado de uso, requer `STATEMENT_READ`)
  ainda não tem tela — só o resumo (`getUsageSummary`) aparece na visão geral.
- O item de fatura (`listInvoices`) vem cru do provedor (shape não confirmado);
  a tabela lê os campos comuns (estilo Stripe: `number`/`amount_paid`/`status`/
  `created`/`hosted_invoice_url`) de forma defensiva. Apertar quando o DTO real
  for confirmado.
- Traduzir `es`/`fr`/`pt-PT` de verdade em `messages.ts` (hoje caem no
  fallback do inglês).
- Validado: app com `security` + `billing-user` typecheca com **0 erros**;
  nav + i18n wirados pelo CLI.
