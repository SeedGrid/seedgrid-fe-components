# SgDialog

Overlay modal para apresentar conteudo focado, confirmacoes e fluxos curtos com controle de abertura, fechamento e severidade visual.

## Quando usar
- Exibir conteudo focado que interrompe temporariamente o fluxo principal.
- Abrir detalhes, formularios curtos, confirmacoes e avisos modais.
- Cenarios com controle explicito de abertura e fechamento.

## Quando evitar
- Feedback leve e nao bloqueante; nesses casos prefira toast ou badge.
- Secoes permanentes da tela; nesses casos prefira componentes de layout.
- Captura de um unico valor simples sem contexto modal; nesses casos prefira input direto.

## Composição
- Usar com SgButton para gatilhos de abertura e acoes de confirmacao.
- Combinar com SgStack e sgInput* para formularios modais curtos.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `open` | `boolean` | não | Controla a abertura do dialog em modo controlado. |
| `onOpenChange` | `(open: boolean) => void` | não | Callback disparado quando o estado de abertura muda. |
| `title` | `ReactNode` | não | Titulo principal do dialog. |
| `subtitle` | `ReactNode` | não | Subtitulo complementar do dialog. |
| `children` | `ReactNode` | não | Conteudo principal do corpo do dialog. |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "full"` | não | Escala do container modal. |
| `severity` | `"primary" \| "secondary" \| "success" \| "info" \| "warning" \| "help" \| "danger" \| "plain"` | não | Tom semantico do cabecalho e acentos visuais. |
| `closeOnOverlayClick` | `boolean` | não | Fecha o dialog ao clicar fora do conteudo. |

## Tags
feedback, dialog, modal, overlay, focus, controlled-open, severity, size, animation, auto-close, overlay modal, popup dialog
