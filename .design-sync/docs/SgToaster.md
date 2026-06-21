# SgToaster

Host visual de notificacoes toast globais, com controle de posicao, duracao, quantidade visivel e estilos ricos.

## Quando usar
- Exibir feedback global leve e nao bloqueante para sucesso, erro e informacao.
- Notificar operacoes assincronas sem interromper o fluxo do usuario.
- Centralizar a renderizacao de toasts em uma aplicacao.

## Quando evitar
- Confirmacoes criticas; nesses casos prefira SgConfirmationDialog.
- Conteudo modal ou detalhado; nesses casos prefira SgDialog.
- Status persistentes dentro do layout; nesses casos prefira badge ou whistle.

## Composição
- Usar com a API `toast` para publicar mensagens.
- Combinar com SgToastHost quando for preciso controlar o ponto de renderizacao.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `position` | `"top-right" \| "top-left" \| "top-center" \| "bottom-right" \| "bottom-left" \| "bottom-center"` | não | Posicao global do stack de toasts. |
| `duration` | `number` | não | Duracao padrao dos toasts em milissegundos. |
| `visibleToasts` | `number` | não | Quantidade maxima de toasts visiveis simultaneamente. |
| `closeButton` | `boolean` | não | Exibe botao de fechar em cada toast. |
| `richColors` | `boolean` | não | Ativa paleta visual rica por tipo de toast. |

## Tags
feedback, toast, notification, toaster, toast-hosting, global-feedback, positioning, duration-control, rich-colors, toast container, toast notifications
