# SgBadgeOverlay

Wrapper para sobrepor badges e indicadores compactos sobre avatares, icones e outros elementos visuais.

## Quando usar
- Adicionar contadores ou estados sobre avatares, icones e botoes.
- Indicar notificacoes, status online e pequenos marcadores contextuais.
- Sobrepor badges sem alterar a estrutura do elemento base.

## Quando evitar
- Badges independentes sem elemento base; nesses casos prefira SgBadge.
- Conteudo longo ou estruturas de layout.
- Fluxos de interacao complexos.

## Composição
- Usar com SgAvatar, SgButton e icones de menu.
- Combinar com SgBadge para reaproveitar o visual do indicador.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `children` | `ReactNode` | sim | Elemento base que recebera o badge sobreposto. |
| `badge` | `ReactNode` | sim | Conteudo do indicador exibido sobre o elemento base. |
| `placement` | `"top-left" \| "top-right" \| "bottom-left" \| "bottom-right" \| "right" \| "left" \| "top" \| "bottom"` | não | Posicao do badge sobreposto. |

## Tags
feedback, badge, overlay, indicator, overlay-indicator, badge-positioning, status-overlay, badge overlay, notification overlay, indicator overlay
