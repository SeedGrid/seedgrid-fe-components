# SgDockZone

Regiao nomeada dentro de um dock layout usada para alojar toolbars e conteudo por zona.

## Quando usar
- Declarar regioes top, bottom, left, right e free em um DockLayout.
- Delimitar areas que recebem toolbars, menus ou conteudo arrastavel.
- Separar funcionalmente zonas de uma workspace com docking.

## Quando evitar
- Agrupamentos simples fora de docking; nesses casos prefira Panel ou Stack.
- Navegacao isolada; nesses casos prefira Menu ou Breadcrumb.
- Acoes primarias; nesses casos prefira Button ou ToolbarIconButton.

## Composição
- Usar dentro de SgDockLayout ou SgDockScreen.
- Combinar com SgToolBar e conteudo de workspace conforme a zona.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `zone` | `"top" \| "bottom" \| "left" \| "right" \| "free"` | sim | Identificador da zona dentro do dock layout. |
| `children` | `ReactNode` | não | Conteudo renderizado dentro da zona. |
| `className` | `string` | não | Classes adicionais da zona. |

## Tags
layout, dock, zone, region, workspace, named-zone, drop-target, toolbar-host, free-zone, preview-state, dock zone, dock region, layout zone, drop area
