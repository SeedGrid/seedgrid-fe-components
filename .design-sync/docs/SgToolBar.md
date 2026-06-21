# SgToolBar

Barra de ferramentas para agrupar acoes frequentes com suporte a orientacao, colapso, arraste e encaixe em zonas de layout.

## Quando usar
- Agrupar acoes frequentes em uma faixa horizontal ou vertical persistente.
- Toolbars contextuais com suporte a colapso, arraste e encaixe.
- Ambientes de trabalho, editores e dashboards com comandos recorrentes.

## Quando evitar
- Navegacao hierarquica de aplicacao; nesses casos prefira SgMenu.
- Acoes isoladas simples; nesses casos prefira SgButton.
- Agrupamento de conteudo sem acoes.

## Composição
- Usar com SgToolbarIconButton e SgButton para compor acoes.
- Combinar com SgPanel, SgCard e SgMenu em layouts de trabalho.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador estavel da toolbar. |
| `title` | `ReactNode` | não | Titulo opcional exibido na barra. |
| `orientationDirection` | `"vertical-up" \| "vertical-down" \| "horizontal-left" \| "horizontal-right"` | não | Direcao e orientacao da toolbar. |
| `buttonsPerDirection` | `number` | não | Quantidade de botoes distribuidos por direcao. |
| `dockZone` | `"top" \| "bottom" \| "left" \| "right" \| "free"` | não | Zona de encaixe da toolbar. |
| `draggable` | `boolean` | não | Permite arrastar a toolbar. |
| `collapsible` | `boolean` | não | Permite recolher a toolbar. |
| `children` | `ReactNode` | não | Botoes e elementos de acao da toolbar. |

## Tags
navigation, toolbar, actions, dock, draggable, action-grouping, dockable, collapsible, orientation-control, action bar, command bar, floating toolbar
