# SgBreadcrumb

Navegacao hierarquica compacta para indicar caminho atual e permitir retorno a niveis anteriores.

## Quando usar
- Indicar caminho atual em navegacao hierarquica de telas e seções.
- Permitir retorno rapido a niveis anteriores em apps com estrutura profunda.
- Complementar cabecalhos de pagina com contexto de localizacao.

## Quando evitar
- Menus completos de navegacao lateral ou superior; nesses casos prefira SgMenu.
- Acoes do usuario sem hierarquia de pagina.
- Conteudo de layout ou agrupamento visual.

## Composição
- Usar junto de SgCard, SgPanel e cabecalhos de pagina.
- Combinar com SgMenu quando houver navegacao global e local.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `items` | `SgBreadcrumbItem[]` | sim | Lista ordenada de niveis do caminho de navegacao. |
| `separator` | `"slash" \| "chevron" \| "dot" \| "arrow" \| ReactNode` | não | Separador visual entre os niveis. |
| `maxItems` | `number` | não | Quantidade maxima de itens visiveis antes do colapso. |
| `overflowBehavior` | `"collapse" \| "scroll"` | não | Comportamento quando o caminho excede o espaco disponivel. |
| `showHomeIcon` | `boolean` | não | Adiciona um item inicial com icone de home. |
| `variant` | `"default" \| "subtle" \| "primary"` | não | Variante visual do breadcrumb. |
| `onNavigate` | `(item: SgBreadcrumbItem, index: number) => void` | não | Callback disparado ao navegar por um item. |

## Tags
navigation, breadcrumb, hierarchy, path, hierarchical-navigation, overflow-collapse, home-icon, custom-separator, navigation trail, path navigation, hierarchy trail
