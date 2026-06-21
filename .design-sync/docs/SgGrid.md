# SgGrid

Primitive de layout em grade responsiva para distribuicao de cards, blocos e formularios em colunas e linhas.

## Quando usar
- Distribuir cards, KPIs e blocos de conteudo em colunas responsivas.
- Montar formularios com varias colunas e alinhamento consistente.
- Criar layouts adaptativos com spans e preenchimento denso.

## Quando evitar
- Pilhas lineares simples; nesses casos prefira SgStack.
- Blocos unicos com destaque visual; nesses casos prefira SgCard ou SgPanel.
- Acoes ou captura de dados individuais; nesses casos prefira componentes especificos.

## Composição
- Usar com SgCard, SgPanel e SgBadge para dashboards.
- Combinar com SgStack dentro dos itens quando houver alinhamento interno.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `columns` | `number \| responsive columns map` | não | Define a quantidade de colunas base e por breakpoint. |
| `minItemWidth` | `number \| string` | não | Largura minima dos itens em modo auto-fit. |
| `gap` | `number \| string` | não | Espacamento entre os itens da grade. |
| `padding` | `number \| string` | não | Espacamento interno do container grid. |
| `dense` | `boolean` | não | Ativa preenchimento denso do fluxo de grade. |
| `rowHeight` | `number \| string` | não | Altura automatica das linhas da grade. |
| `children` | `ReactNode` | não | Itens renderizados dentro da grade. |

## Tags
layout, grid, responsive, columns, container, responsive-columns, auto-fit, dense-flow, row-span, column-span, responsive grid, columns layout, card grid
