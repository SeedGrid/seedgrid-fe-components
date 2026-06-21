# SgClockThemePicker

Seletor visual de temas de relogio com preview embutido, filtro de temas e integracao com o resolver de temas do clock.

## Quando usar
- Permitir que o usuario escolha o tema visual de um relogio ou widget temporal.
- Explorar galerias de temas de clock com preview rapido e filtro textual.
- Compor configuracoes visuais em dashboards ou paines de personalizacao.

## Quando evitar
- Selecao generica de opcoes estruturadas sem semantica de tema visual; nesses casos prefira Combobox ou RadioGroup.
- Preview estatico sem interacao; nesses casos prefira SgClockThemePreview.
- Aplicar tema global de toda a app; nesses casos prefira providers de tema dedicados.

## Composição
- Usar junto de SgClockThemeProvider para resolver temas locais e fallback.
- Combinar com SgClock e SgClockThemePreview em paineis de personalizacao.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `value` | `string` | sim | ID do tema atualmente selecionado. |
| `onChange` | `(id: string) => void` | sim | Callback disparado quando um novo tema e escolhido. |
| `label` | `string` | não | Rotulo opcional exibido acima do seletor. |
| `placeholder` | `string` | não | Texto exibido quando nenhum tema valido esta resolvido. |
| `filter` | `(theme: SgClockTheme) => boolean` | não | Filtro adicional sobre a lista de temas disponiveis. |
| `previewSize` | `number` | não | Tamanho do preview visual de cada tema. |
| `searchable` | `boolean` | não | Ativa busca textual na lista de temas. |
| `fallbackThemeId` | `string` | não | Tema usado quando o valor atual nao pode ser resolvido. |
| `defaultOpen` | `boolean` | não | Abre a lista inicialmente no primeiro render. |

## Tags
gadget, clock, theme, picker, selection, theme-selection, preview-rendering, searchable-themes, resolver-aware, clock theme picker, theme selector, theme chooser, visual theme picker
