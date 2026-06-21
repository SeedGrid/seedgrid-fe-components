# SgPickList

Lista dual para mover itens entre origem e destino com filtros e selecao.

## Quando usar
- Atribuicao de itens entre duas listas.
- Selecao de membros, permissoes ou recursos em destino final.
- Fluxos em que o conjunto escolhido precisa ser claramente separado do disponivel.

## Quando evitar
- Escolha unica ou poucas opcoes; use componentes mais simples.
- Ordenacao pura; nesses casos prefira SgOrderList.
- Texto livre ou dados numericos.

## Composição
- Combinar com SgOrderList quando a lista final tambem precisar de ordenacao.
- Usar em telas administrativas e de configuracao.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | não | Identificador unico do componente. |
| `value` | `SgPickListValue` | não | Estado atual das listas. |
| `sourceLabel` | `string` | não | Rotulo da lista de origem. |
| `targetLabel` | `string` | não | Rotulo da lista de destino. |
| `selectionMode` | `string` | não | Modo de selecao nas listas. |
| `showFilters` | `boolean` | não | Exibe filtros nas listas. |
| `disabled` | `boolean` | não | Desabilita interacao. |
| `onChange` | `(event: SgPickListChangeEvent) => void` | não | Callback ao mover itens. |

## Tags
form, picklist, dual-list, transfer, rhf, transfer-list, filter, multi-selection, source-target, pick list, dual list, transfer list, source target list
