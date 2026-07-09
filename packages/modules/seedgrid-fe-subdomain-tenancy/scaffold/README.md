# `fe-subdomain-tenancy` scaffold

Conteúdo copiado para dentro do app gerado pelo CLI (git do app, editável à
vontade — ver `seedgrid-cli/docs/adr/0004-module-manifest-contract.md`).
Extraído de `seedgrid-cli/templates/modules/multitenancy/` (nome pré-rename
— ver `[[seedgrid-tenancy-rename]]`; a pasta local aqui já nasce renomeada
pra `@/modules/subdomain-tenancy`, mas as CHAVES de i18n (`t("multitenancy.signup...")`)
não foram renomeadas: elas são dado compartilhado com os arquivos de locale
do base-app, que ficam fora do escopo desta extração).

Mesmo critério lib vs scaffold do `fe-security` (ver o README dele): import
`@/...` real = scaffold; puro ou so-um-default-trivial = lib.

## Promovido pra `@seedgrid/fe-subdomain-tenancy` (lib)

- `TenantProvider`/`useTenantContext` (`client/tenant-provider.tsx`, export em
  `/client`) — contexto React puro, zero import `@/...`.
- `subdomain-rules.ts` (`normalizeSubdomain`, `isReservedSubdomain`,
  `getSubdomainValidationKey`, `validateSubdomain`, `RESERVED_SUBDOMAINS`) —
  so tinha 1 import `@/...` (`type Translator` do `@/i18n`), e so como tipo
  do parametro OPCIONAL de traducao. Trocado por um tipo de funcao generico
  (`(key) => string`) — decopla sem mudar comportamento.

## Ficou scaffold

- `app/(public)/signup/page.tsx` — 21 marcadores handlebars reais (mantido
  `.hbs`); tela inteira de cadastro de tenant (CNPJ/ViaCEP/UF), BR-coupled.
- `app/api/locations/{cities,states}/route.ts` — route handlers: por
  natureza SEMPRE scaffold (Next.js exige o arquivo num path fisico
  especifico; nao e algo que se "importa" de um pacote).
- `modules/subdomain-tenancy/server/{create-public-tenant-action,
  resend-public-tenant-activation-email-action,
  validate-public-tenant-email-action,public-api-base-url}.ts` — usam
  `@/i18n` (mensagem de erro) e `@/config/environment`
  (`resolveApiBaseUrlForHostname`, host-coupled).
- `modules/subdomain-tenancy/signup/types.ts` — shapes de FORM (`PublicTenantSignupFormValues`,
  `CreatePublicTenantPayload`) especificos da tela; mantidos scaffold-local
  pra nao colidir com os tipos de contrato de backend que ja existem em
  `tenant-signup.ts` (lib) — ver "Achado" abaixo.

## Achado: `createSubdomainTenancyServer` nao serve pras 3 actions de signup

O pacote ja tem um engine mais novo (`src/server/create-subdomain-tenancy-server.ts`,
`createSubdomainTenancyServer(session: SecurityServer)`) que compoe sobre o
`createSecurityServer` do `fe-security`. Mas as 3 actions de signup
(`create-public-tenant-action` etc.) sao **pre-auth** — chamam
`/public/tenants/**` com `requireAuth: false`, sem sessao nenhuma — enquanto
`createSubdomainTenancyServer` usa `session.apiFetchSecurity`, que so faz
sentido com uma sessao JA autenticada. Os dois nao se encaixam hoje: o
engine novo foi desenhado pra chamadas autenticadas pos-login, nao pro
fluxo de signup em si. Por isso as actions foram portadas verbatim (com
`@/i18n`/`@/config/environment`/`@/modules/core`, comportamento preservado),
em vez de reescritas em cima do engine novo — mesma decisao tomada no
`fe-security` pros arquivos de `server/session-routes.ts` etc. Registrado
como achado, nao corrigido aqui.

## Corrigido: `TenantLegalRepresentative` (lib) estava incompleto

Conferido contra o DTO real do backend
(`seedgrid-quarkus-ext-subdomain-tenancy/.../dtos/TenantSignupRequest.java`,
`LegalRepresentativeDTO`): `firstName`/`lastName`/`phone` sao `@NotBlank`
(obrigatorios) e existe um campo `whatsapp` sem nenhuma validacao (opcional
de verdade). `TenantLegalRepresentative` em `tenant-signup.ts` tinha `phone`
como opcional (errado) e nao tinha `whatsapp` (faltando) — corrigido pra
`phone: string` (obrigatorio) + `whatsapp?: string | null`. `name` (nome
completo) NAO faz parte do DTO — e um getter computado
(`getName() = firstName + " " + lastName`) so no lado Java, entao
`CreatePublicTenantPayload.legalRepresentative.name` (scaffold,
`signup/types.ts`) e so um extra enviado e ignorado pelo backend; nao e
bug, so nao precisa existir no tipo da lib.
