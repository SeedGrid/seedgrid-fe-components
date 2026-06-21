# SgDockLayout

Layout estrutural com zonas de dock e persistencia de estado para barras e paines arrastaveis.

## Quando usar
- Compor workspaces com zonas dockadas para toolbars, menus e paineis.
- Estruturar shells administrativos com suporte a arraste e persistencia de layout.
- Organizar regioes top, bottom, left, right e free em uma grade coordenada.

## Quando evitar
- Blocos simples de agrupamento; nesses casos prefira SgPanel, SgCard ou SgStack.
- Navegacao isolada; nesses casos prefira Menu, DockMenu ou Breadcrumb.
- Acoes unicas; nesses casos prefira Button ou ToolBar.

## Composição
- Usar com SgDockZone, SgToolBar e SgToolbarIconButton em shells complexos.
- Combinar com SgScreen ou SgDockScreen quando a tela inteira precisa de docking.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador do layout usado para persistencia e coordenacao interna. |
| `defaultState` | `SgDockLayoutState` | não | Estado inicial das toolbars e zonas do layout. |
| `children` | `ReactNode` | sim | Zonas, toolbars e conteudo estrutural do layout. |
| `className` | `string` | não | Classes adicionais do container raiz. |

## Tags
layout, dock, workspace, shell, zones, zone-layout, drag-drop, persistent-state, toolbar-placement, drop-preview, dock layout, workspace layout, zone layout, docking shell
