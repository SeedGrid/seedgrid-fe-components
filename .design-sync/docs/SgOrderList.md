# SgOrderList

Lista ordenavel para reordenacao manual de itens com selecao e controles de movimento.

## Quando usar
- Ordenacao manual de prioridades, etapas ou itens.
- Listas em que a ordem final tem significado de negocio.
- Configuracoes onde o usuario precisa reorganizar uma colecao.

## Quando evitar
- Escolha simples sem necessidade de ordenacao.
- Transferencia entre duas listas; nesses casos prefira SgPickList.
- Tabelas grandes; nesses casos prefira componentes de dados.

## Composição
- Combinar com SgPickList quando o fluxo exigir selecao e depois ordenacao.
- Usar em paineis de configuracao de preferencia.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `title` | `string` | não | Titulo do grupo. |
| `source` | `SgOrderListItem[]` | não | Itens de origem. |
| `value` | `SgOrderListItem[]` | não | Itens na ordem atual. |
| `selectionMode` | `"single" \| "multiple"` | não | Modo de selecao. |
| `showControls` | `boolean` | não | Exibe botoes de ordenacao. |
| `draggable` | `boolean` | não | Permite arrastar itens. |
| `disabled` | `boolean` | não | Desabilita interacao. |
| `onChange` | `(items: SgOrderListItem[]) => void` | não | Callback ao alterar a ordem. |

## Tags
form, ordering, list, priority, rhf, reordering, selection, drag-drop, list-controls, order list, sortable list, priority list, ranking list
