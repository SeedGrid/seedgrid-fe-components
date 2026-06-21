# toast

Funcao para disparar notificacoes toast. Oferece tipos predefinidos (success, error, warning, info, loading, default) com duracao customizavel, acoes e estilo.

## Quando usar
- Notificar sucesso de operacoes (save, delete, submit).
- Comunicar erros e problemas ao usuario.
- Exibir avisos e informacoes nao-bloqueantes.
- Mostrar progresso de operacoes async com tipo 'loading'.

## Quando evitar
- Dados que requerem confirmacao explícita; use SgDialog ou SgConfirmationDialog.
- Mensagens persistentes que o usuario deve entender; use SgBanner ou SgAlert.
- Feedback de validacao de formulario; use erros inline nos campos.

## Composição
- Envolver a arvore com SgToastHost para exibir toasts.
- Usar com try-catch para disparar toast de erro.
- Combinar com promise para loading → success/error automático.
- Usar subscribeSgToasts para monitorar toasts programaticamente.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `type` | `SgToastType` | sim | Tipo de toast (success, error, warning, info, loading, default). |
| `title` | `ReactNode` | sim | Titulo ou mensagem principal do toast. |
| `options.id` | `string` | não | ID unico para referenciar o toast. |
| `options.description` | `ReactNode` | não | Descricao ou mensagem secundaria. |
| `options.duration` | `number` | não | Duracao em milissegundos antes de auto-fechar (0 = permanente). |
| `options.action` | `SgToastAction` | não | Acao customizada (label e onClick). |
| `options.closeButton` | `boolean` | não | Mostrar botao de fechar. |
| `options.className` | `string` | não | Classe CSS customizada. |
| `options.style` | `CSSProperties` | não | Estilos inline customizados. |

## Tags
hook, toast, notification, alert, type-support, custom-styling, actions, promises, dismiss, toast notification, snackbar
