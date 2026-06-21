# sgWhistle

Funcao para disparar notificacoes whistle (banners/alertas). Oferece severidades, duracao customizavel, acoes, icones e estilos customizados.

## Quando usar
- Alertas persistentes que o usuario precisa ver (warning, error).
- Mensagens que ocupam espaco mas nao bloqueiam a interacao.
- Status de operacoes async com duracao customizavel.
- Feedback com multiplas acoes para o usuario.

## Quando evitar
- Notificacoes rapidas que desaparecem automaticamente; use toast().
- Informacoes que requerem confirmacao; use SgDialog.
- Erros que bloqueiam a pagina; use tratamento de erro apropriado.

## Composição
- Envolver a arvore com SgWhistleHost para exibir whistles.
- Usar com try-catch para disparar whistle de erro.
- Combinar com promise para loading → success/error automático.
- Usar subscribeSgWhistles para monitorar whistles programaticamente.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `options.message` | `string` | sim | Mensagem principal do whistle. |
| `options.severity` | `SgWhistleSeverity` | não | Severidade (default, success, info, warning, error, loading). |
| `options.title` | `string` | não | Titulo opcional do whistle. |
| `options.id` | `string` | não | ID unico para referenciar o whistle. |
| `options.icon` | `ReactNode` | não | Icone customizado. |
| `options.duration` | `number` | não | Duracao em milissegundos (0 = permanente, padrao = permanente). |
| `options.dismissible` | `boolean` | não | Permitir fechar manualmente. |
| `options.borderStyle` | `SgWhistleBorderStyle` | não | Estilo da borda (solid, soft, left-accent, full-accent, none). |
| `options.opacity` | `number` | não | Opacidade (0-1). |
| `options.action` | `SgWhistleAction` | não | Acao customizada (label e onClick). |
| `options.className` | `string` | não | Classe CSS customizada. |
| `options.style` | `CSSProperties` | não | Estilos inline customizados. |
| `options.onClose` | `() => void` | não | Callback quando o whistle e fechado. |

## Tags
hook, whistle, notification, banner, alert, severity-support, custom-styling, actions, promises, dismiss, notification banner
