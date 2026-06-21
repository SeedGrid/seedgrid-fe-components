# SgComponentsI18nProvider

Provider de internacionalizacao para os componentes SeedGrid, com locale, mensagens embutidas e sobrescrita pontual por subtree.

## Quando usar
- Trocar locale e mensagens internas dos componentes em um subtree controlado.
- Sobrescrever textos padrao sem alterar a implementacao dos componentes.
- Compor demos, shells ou modulos com locale diferente do restante da aplicacao.

## Quando evitar
- Traducao de conteudo de negocio externo aos componentes SeedGrid.
- Selecao visual de idioma pelo usuario sem provider; nesses casos use UI propria combinada com este provider.
- Persistencia de preferencias do usuario; nesses casos combine com ambiente ou storage.

## Composição
- Usar com hooks como useComponentsI18n e com componentes que exibem mensagens internas.
- Combinar com SgEnvironmentProvider quando locale e preferencias precisarem de persistencia.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `locale` | `SgComponentsLocale` | não | Locale aplicado aos componentes dentro do provider. |
| `messages` | `SgComponentsMessages \| SgComponentsMessagesByNamespace` | não | Mapa de mensagens customizadas ou sobrescritas. |
| `children` | `ReactNode` | sim | Arvore de componentes que consome o contexto de i18n. |

## Tags
provider, i18n, locale, messages, context, locale-scoping, message-overrides, built-in-locales, runtime-i18n-context, components i18n provider, locale provider, messages provider, translation context
