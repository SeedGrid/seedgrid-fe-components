# SgTreeView

Navegacao hierarquica para estruturas em arvore com expansao, selecao, busca, checkboxes e suporte a dados aninhados.

## Quando usar
- Navegar estruturas hierarquicas como permissoes, categorias e menus aninhados.
- Selecionar ou marcar nos em arvores administrativas e exploradores de estrutura.
- Exibir relacoes pai-filho com busca e expansao progressiva.

## Quando evitar
- Listas planas simples; nesses casos prefira listas, tabelas ou selects.
- Acoes primarias; nesses casos prefira componentes de botao.
- Containers de layout sem hierarquia; nesses casos prefira Panel, Card ou Stack.

## Composição
- Usar com SgCard ou SgPanel em sidebars e telas administrativas.
- Combinar com SgButton e dialogs em fluxos de selecao ou configuracao.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `nodes` | `SgTreeNode[]` | sim | Lista hierarquica de nos exibidos pela arvore. |
| `selectionMode` | `"single" \| "multiple" \| "checkbox"` | não | Modo principal de selecao dos nos. |
| `selectedIds` | `string[]` | não | Nos selecionados de forma controlada. |
| `checkedIds` | `string[]` | não | Nos marcados em cenarios de checkbox tree. |
| `searchable` | `boolean` | não | Habilita campo interno de busca para filtrar nos. |
| `expandAllByDefault` | `boolean` | não | Expande a arvore inteira na montagem inicial. |
| `size` | `"sm" \| "md" \| "lg"` | não | Escala visual da arvore e dos itens. |
| `onSelectionChange` | `(ids: string[]) => void` | não | Callback disparado quando a selecao muda. |

## Tags
navigation, tree, hierarchy, selection, search, hierarchical-navigation, node-selection, checkboxes, expand-collapse, json-mapping, tree view, hierarchy tree, permission tree, navigation tree
