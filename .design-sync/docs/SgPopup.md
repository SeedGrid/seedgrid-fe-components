# SgPopup

Overlay contextual ancorado a um elemento para exibir acoes, detalhes curtos ou conteudo complementar sem abrir um modal completo.

## Quando usar
- Exibir conteudo contextual curto ancorado a um botao, campo ou item da interface.
- Mostrar acoes rapidas, menus leves ou detalhes auxiliares sem bloquear a tela.
- Cenarios em que um dialog seria pesado demais para o contexto.

## Quando evitar
- Fluxos modais de confirmacao ou edicao; nesses casos prefira SgDialog ou SgConfirmationDialog.
- Menus complexos de navegacao persistente; nesses casos prefira SgMenu.
- Conteudo permanente de layout; nesses casos prefira componentes estruturais.

## Composição
- Usar com SgButton, SgSplitButton ou itens clicaveis como ancora.
- Combinar com SgBadge ou SgAvatar para overlays contextuais compactos.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `anchorRef` | `React.RefObject<HTMLElement>` | sim | Elemento ancora usado para posicionar o popup. |
| `open` | `boolean` | não | Controla a visibilidade do popup em modo controlado. |
| `onOpenChange` | `(open: boolean) => void` | não | Callback disparado quando o estado de abertura muda. |
| `title` | `string` | não | Titulo opcional do popup. |
| `subtitle` | `string` | não | Subtitulo opcional do popup. |
| `actions` | `SgPopupAction[]` | não | Lista de acoes contextuais renderizadas no popup. |
| `placement` | `"auto" \| "top" \| "right" \| "bottom" \| "left"` | não | Posicionamento principal do popup em relacao a ancora. |
| `closeOnOutsideClick` | `boolean` | não | Fecha o popup quando o usuario clica fora dele. |

## Tags
feedback, popup, overlay, anchored, contextual, anchored-overlay, auto-placement, actions, controlled-open, outside-click-close, anchored popup, context menu popup, contextual overlay
