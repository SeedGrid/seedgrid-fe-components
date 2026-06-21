# SgClockThemeProvider

Provider de resolucao de temas de relogio, com suporte a fallback, temas locais e integracao com o registro global.

## Quando usar
- Escopar resolucao de temas de clock para uma subtree especifica.
- Fornecer fallback consistente e temas locais para widgets de relogio.
- Compor paines de personalizacao com registro global e override local.

## Quando evitar
- Selecao visual de tema pelo usuario; nesses casos prefira SgClockThemePicker.
- Renderizacao direta do relogio; nesses casos prefira SgClock.
- Tema global generico da aplicacao fora do dominio de clock.

## Composição
- Usar com SgClock e SgClockThemePicker no mesmo subtree.
- Combinar com registerTheme e registerThemes quando houver catalogo compartilhado.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `value.mode` | `"fallback" \| "strict"` | não | Modo de resolucao para temas ausentes. |
| `value.fallbackThemeId` | `string` | não | Tema padrao usado em modo fallback. |
| `value.themes` | `SgClockTheme[]` | não | Lista de temas locais adicionados apenas neste escopo. |
| `children` | `ReactNode` | sim | Arvore que vai consumir o resolver de temas. |

## Tags
provider, clock, theme, resolver, context, theme-context, fallback-resolution, local-themes, global-theme-merge, clock theme provider, theme resolver provider, clock theme context
