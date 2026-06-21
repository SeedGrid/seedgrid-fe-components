# SgDockScreen

Componente de conveniencia que combina SgScreen e SgDockLayout em uma unica raiz estrutural.

## Quando usar
- Montar telas completas com docking sem precisar combinar Screen e DockLayout manualmente.
- Criar workspaces administrativos e shells de aplicacao com zonas estruturais prontas.
- Usar quando o layout principal da tela inteira precisa de docking persistente.

## Quando evitar
- Secoes internas pequenas; nesses casos prefira DockLayout, Panel ou Stack.
- Apenas uma screen simples sem zonas; nesses casos prefira SgScreen.
- Conteudo puramente navegacional; nesses casos prefira Menu, PageControl ou DockMenu.

## Composição
- Usar com SgDockZone e SgToolBar para montar laterais, topo e rodape.
- Combinar com menus, dialogs e paineis em shells administrativos.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador do dock layout interno. |
| `screenId` | `string` | não | ID opcional do elemento raiz de screen. |
| `defaultState` | `SgDockLayoutState` | não | Estado inicial das toolbars e zonas internas. |
| `layoutClassName` | `string` | não | Classes adicionais aplicadas ao layout interno de dock. |
| `fullscreen` | `boolean` | não | Quando ativo, a screen ocupa a viewport inteira. |
| `children` | `ReactNode` | não | Zonas e conteudo estrutural do dock screen. |

## Tags
layout, screen, dock, workspace, shell, screen-shell, dock-layout, root-workspace, persistent-layout, dock screen, workspace screen, docking shell, dock workspace
