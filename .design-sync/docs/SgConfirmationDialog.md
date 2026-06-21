# SgConfirmationDialog

Dialog especializado em confirmacao de acoes sensiveis, com mensagem, severidade e botoes de confirmar e cancelar.

## Quando usar
- Confirmar acoes destrutivas, sensiveis ou irreversiveis.
- Solicitar decisao binaria antes de excluir, revogar ou prosseguir.
- Fluxos em que confirmacao e cancelamento precisam de semantica clara.

## Quando evitar
- Conteudo modal generico sem necessidade de confirmacao; nesses casos prefira SgDialog.
- Feedback apenas informativo; nesses casos prefira toast, badge ou alerta simples.
- Captura direta de dados sem contexto de risco; nesses casos prefira formularios comuns.

## Composição
- Usar com SgButton para abrir a confirmacao a partir de acoes sensiveis.
- Combinar com SgDialog apenas quando houver um fluxo modal maior ao redor.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `open` | `boolean` | não | Controla a abertura do dialog de confirmacao. |
| `title` | `ReactNode` | não | Titulo principal da confirmacao. |
| `message` | `ReactNode` | não | Mensagem principal explicando o risco ou decisao. |
| `severity` | `"primary" \| "secondary" \| "success" \| "info" \| "warning" \| "help" \| "danger" \| "plain"` | não | Tom semantico da confirmacao. |
| `confirmButton` | `SgConfirmationDialogButtonConfig` | não | Configuracao visual e comportamental do botao de confirmacao. |
| `cancelButton` | `SgConfirmationDialogButtonConfig` | não | Configuracao visual e comportamental do botao de cancelamento. |
| `onConfirm` | `() => void` | não | Callback disparado quando o usuario confirma a acao. |
| `onCancel` | `() => void` | não | Callback disparado quando o usuario cancela a acao. |

## Tags
feedback, confirmation, dialog, danger, warning, confirmation-flow, confirm-cancel, severity, custom-buttons, safe-defaults, confirmation dialog, confirm modal, danger prompt, warning confirm
