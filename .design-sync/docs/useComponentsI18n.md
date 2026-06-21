# useComponentsI18n

Hook para acessar contexto de internacionalizacao dos componentes SeedGrid. Fornece locale atual e funcoes de traducao.

## Quando usar
- Acessar mensagens traduzidas dentro de componentes customizados.
- Validar se um locale especifico esta configurado.
- Implementar fallback para mensagens customizadas em diferentes locales.

## Quando evitar
- Usar para traducao de strings fora do contexto de componentes SeedGrid.
- Supor que o hook valida o locale; sempre checar o resultado.

## Composição
- Envolver a arvore com SgComponentsI18nProvider antes de usar.
- Usar setComponentsI18n() para alternar locale dinamicamente.
- Combinar com getBuiltInComponentsMessages() para mensagens builtin.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `returns.locale` | `SgComponentsLocale` | não | Locale atual (pt-BR, en-US, es, fr, pt-PT, en, etc). |
| `returns.messages` | `SgComponentsMessages` | não | Dicionario de mensagens para o locale atual. |

## Tags
hook, i18n, internationalization, locale, translation, locale-access, message-resolution, dynamic-translation, i18n context, locale hook, translation context
