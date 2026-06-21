# SgDockMenu

Menu de acoes ou navegacao com estilo dock, suporte a badges, magnify, posicoes ancoradas e persistencia de arraste.

## Quando usar
- Expor atalhos de navegacao e acoes frequentes em estilo dock.
- Criar launcher de modulos, menus flutuantes e barras ancoradas com icones.
- Exibir notificacoes contextuais com badges em menus persistentes.

## Quando evitar
- Menus textuais extensos ou arvores hierarquicas; nesses casos prefira Menu ou TreeView.
- Acoes unitarias simples; nesses casos prefira Button ou SplitButton.
- Containers estruturais; nesses casos prefira Panel, Card ou Screen.

## Composição
- Usar com Screen e Panel em shells de aplicacao.
- Combinar com Badge para contadores de notificacao e estados contextuais.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `items` | `SgDockMenuItem[]` | sim | Itens exibidos no dock com icone, label, badge e acao. |
| `position` | `"left-top" \| "left-center" \| "left-bottom" \| "center-top" \| "center-bottom" \| "right-top" \| "right-center" \| "right-bottom"` | não | Posicionamento principal do dock na area alvo. |
| `enableDragDrop` | `boolean` | não | Permite reposicionamento manual do dock. |
| `showLabels` | `boolean` | não | Exibe labels contextuais dos itens. |
| `magnify` | `boolean` | não | Ativa efeito de ampliacao ao passar o mouse. |
| `itemSize` | `number` | não | Tamanho visual padrao dos itens do dock. |
| `gap` | `number` | não | Espacamento entre os itens do dock. |
| `zIndex` | `number` | não | Camada visual usada quando o dock esta sobreposto. |

## Tags
navigation, menu, dock, actions, launcher, dock-layout, anchored-navigation, badges, magnify, drag-drop, persistent-position, dock menu, quick menu, floating dock
