# SgBadge

Indicador compacto para status, contagens, rotulos curtos e destaque visual de pequenos estados.

## Quando usar
- Exibir status curtos, contadores, tags e indicadores compactos.
- Sinalizar estados como novo, ativo, pendente, erro ou quantidade.
- Anotar cards, listas e cabecalhos com informacao de baixo peso.

## Quando evitar
- Mensagens longas ou feedback detalhado; nesses casos prefira alertas ou dialogs.
- Acoes principais; nesses casos prefira componentes de botao.
- Agrupamento de conteudo; nesses casos prefira componentes de layout.

## Composição
- Usar com SgCard, SgAvatar e listas para indicar estado ou contagem.
- Combinar com SgButton ou menus quando houver contadores contextuais.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `value` | `ReactNode` | não | Conteudo principal exibido dentro do badge. |
| `severity` | `"primary" \| "secondary" \| "success" \| "warning" \| "danger" \| "info" \| "neutral" \| "custom"` | não | Tom semantico do indicador. |
| `badgeStyle` | `"solid" \| "soft" \| "outline" \| "ghost"` | não | Variante visual do badge. |
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | não | Escala visual do badge. |
| `dot` | `boolean` | não | Exibe um pequeno marcador visual adicional. |
| `removable` | `boolean` | não | Permite remover o badge com um botao interno. |
| `onRemove` | `() => void` | não | Callback disparado ao remover o badge. |
| `onClick` | `(e: React.MouseEvent) => void` | não | Callback disparado quando o badge e clicado. |

## Tags
feedback, badge, status, counter, label, status-indicator, severity, variant, removable, dot, tag, status chip, counter badge
