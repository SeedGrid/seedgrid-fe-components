# SgToolbarIconButton

Botao compacto para toolbars com icone, label opcional, hint, loading e severidade visual.

## Quando usar
- Acoes compactas em toolbars com predominancia visual de icone.
- Atalhos de navegacao ou comando rapido em barras horizontais e verticais.
- Botoes de baixo peso para filtros, refresh, configuracoes e utilitarios.

## Quando evitar
- Acoes primarias de formulario; nesses casos prefira SgButton ou SplitButton.
- Agrupamento estrutural; nesses casos prefira ToolBar ou Panel.
- Menus complexos com muitas opcoes textuais; nesses casos prefira Menu ou DockMenu.

## Composição
- Usar dentro de SgToolBar em cenarios de workspace e dashboards.
- Combinar com DockLayout e DockScreen para acoes contextuais por zona.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `icon` | `ReactNode \| string` | não | Icone principal exibido no botao. |
| `label` | `string` | não | Rotulo textual da acao. |
| `hint` | `string` | não | Texto auxiliar usado como dica contextual. |
| `showLabel` | `boolean` | não | Exibe o rotulo junto do icone quando suportado pela toolbar. |
| `loading` | `boolean` | não | Indica processamento em andamento. |
| `severity` | `"primary" \| "secondary" \| "success" \| "info" \| "warning" \| "help" \| "danger" \| "plain"` | não | Tom visual do botao de toolbar. |
| `disabled` | `boolean` | não | Desabilita interacao. |
| `onClick` | `() => void \| Promise<void>` | não | Callback executado ao clicar no item. |

## Tags
action, toolbar, icon-button, compact-action, shortcut, icon-action, compact-toolbar-action, loading, hint, severity, toolbar icon button, icon action, quick toolbar action, shortcut button
