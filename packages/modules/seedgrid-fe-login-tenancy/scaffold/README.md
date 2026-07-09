# `fe-login-tenancy` scaffold — construído do zero, sem fonte histórica

Diferente de todos os outros pacotes já extraídos (`fe-security`,
`fe-subdomain-tenancy`, `fe-backup`), **não existe nenhuma tela de origem**
pra este módulo — nem nos templates do CLI (`seedgrid-cli/templates/modules/`,
que só tem `multitenancy`, nunca teve um equivalente de login-tenancy) nem no
`admin-web` (procurei por `companyPublicId`/`CompanyScope`/tela de login com
seletor de empresa e não achei nada). A lib (`src/company.ts`, `src/signup.ts`,
`src/client/company-scope-picker.tsx`, `src/server/create-login-tenancy.ts`)
já estava pronta e bem construída (`CompanyScopePicker` já vem desacoplado do
transporte via props); as telas em `scaffold/` foram desenhadas nesta sessão
em cima dela.

**Revisão humana recomendada** — isto é construção nova, não extração.

## Corrigido nesta passada (conferido contra o backend real)

Conferi `src/signup.ts` contra `InstitutionalSignupRequest.java`
(`seedgrid-quarkus-ext-login-tenancy`) — mesma classe de bug já encontrada e
corrigida no `fe-subdomain-tenancy`:

- `SignupAddress.phone` estava opcional; o backend exige (`@NotBlank`).
  Corrigido pra obrigatório.
- `SignupLegalRepresentative` não tinha `whatsapp` (existe de verdade no
  backend, sem validação — genuinamente opcional). Adicionado.
- `SignupLegalRepresentative.phone` estava opcional; o backend exige.
  Corrigido pra obrigatório.
- `InstitutionalSignupRequest.plainRootPassword` virou opcional: **achado de
  negócio, não só de tipo** — o controller (`AccountTenancySignupController.signup`)
  trata e-mail já existente como VINCULAÇÃO (anexa a nova empresa/CNPJ à conta
  existente) em vez de erro, e nesse caso ignora a senha do request. A tela de
  signup (`(public)/signup/page.tsx`) já implementa isso: checa
  `email-exists` no blur do campo de e-mail e, se já existir, oculta os
  campos de senha e mostra um aviso de vinculação.

## O que foi construído

- `modules/login-tenancy/server.ts` (`.hbs` — único arquivo com templating
  real, nome de cookie por `{{project_slug}}`) — bootstrap que compõe
  `createSecurityServer` (fe-security) + `createLoginTenancyServer` (este
  pacote), mesmo padrão do `fe-billing-user`.
- `app/api/login-tenancy/{companies,select-company}/route.ts` — rotas finas
  pro fluxo de seleção de empresa pós-login.
- `app/api/login-tenancy/signup/{,email-exists,confirm-email,resend-email}/route.ts`
  — rotas finas pro cadastro institucional.
- `app/auth/select-company/page.tsx` — envolve o `CompanyScopePicker` já
  pronto (não precisou desenhar esse componente, só a tela ao redor).
- `app/(public)/signup/page.tsx` — adaptado da estrutura do wizard de
  `fe-subdomain-tenancy` (CNPJ/ViaCEP/UF, mesmos componentes), removendo o
  campo de subdomínio (login-tenancy não tem — é URL única) e adicionando o
  fluxo de vinculação por e-mail existente.

## Login → select-company (RESOLVIDO)

Depois de um login bem-sucedido, se o usuário tem acesso a mais de uma
empresa, o app agora redireciona pra `/auth/select-company` em vez do
dashboard — **sem inverter a dependência** (o `fe-security` continua sem
conhecer o `login-tenancy`). Como funciona:

- O `navigation.ts` do fe-security virou um registry: `resolvePostAuthPath`
  (agora async) consulta uma lista de resolvers e usa o primeiro que devolver
  uma rota; senão, cai no dashboard. Tem marcadores
  `seedgrid:post-auth-resolvers-*` pro CLI plugar resolvers.
- O login-tenancy declara `postAuthResolver` no `module.ts` (novo campo do
  contrato, ver ADR 0004). O CLI insere
  `resolveLoginTenancyPostAuthPath` no registry do navigation.ts (mesmo
  mecanismo de `provider`/`navigation`/`messages`).
- `scaffold/src/modules/login-tenancy/post-auth.ts` é o resolver client-side:
  faz `GET /api/login-tenancy/companies` e devolve `/auth/select-company`
  quando há mais de uma empresa (senão `null` → dashboard).

Validado: app com `security` + `login-tenancy` typecheca com 0 erros e o
resolver aparece registrado no `navigation.ts` gerado. Falta só exercitar o
fluxo completo contra o backend real (login → 2 empresas → seleção).

## Follow-ups

- Testar o fluxo de vinculação (e-mail já existente) de ponta a ponta —
  a lógica da tela existe, mas não foi exercitada contra o backend real.
- ~~Traduzir de verdade as chaves `login_tenancy.*`~~ — FEITO: `src/messages.ts`
  (`loginTenancyMessages`) cobre as ~90 chaves em en + pt-BR (es/fr caem no en,
  pt-PT no pt-BR), promovido pra lib como os outros módulos, e wireado via o
  campo `messages` do `module.ts` (o CLI funde no catálogo de i18n do app).
  Validado: app com security + login-tenancy typecheca com 0 erros. As
  traduções es/fr/pt-PT reais ainda podem ser refinadas (hoje fallback).
