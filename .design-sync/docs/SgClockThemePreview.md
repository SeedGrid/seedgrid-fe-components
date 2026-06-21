# SgClockThemePreview

Preview visual compacto de um tema de relogio, renderizado em SVG para comparacao rapida de estilos.

## Quando usar
- Comparar visualmente temas de relogio em galerias e seletores.
- Renderizar miniaturas de estilos antes da aplicacao efetiva do tema.
- Exibir previews compactos em listas de configuracao visual.

## Quando evitar
- Selecao direta de tema; nesses casos prefira SgClockThemePicker.
- Renderizacao do relogio funcional completo; nesses casos prefira SgClock.
- Indicadores numericos ou gauges sem relacao com temas de clock.

## Composição
- Usar dentro de SgClockThemePicker para listas de selecao visual.
- Combinar com SgClockThemeProvider e SgClock em fluxos de configuracao.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `theme` | `SgClockTheme` | sim | Tema visual usado na renderizacao do preview. |
| `size` | `number` | não | Dimensao do preview quadrado em pixels. |
| `className` | `string` | não | Classes adicionais aplicadas ao SVG raiz. |

## Tags
gadget, clock, theme, preview, svg, theme-preview, svg-rendering, compact-visualization, dark-flag-aware, clock theme preview, theme thumbnail, theme preview, style preview
