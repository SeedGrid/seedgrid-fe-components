# SgToastHost

Ponto explicito de montagem para notificacoes toast, usado quando a aplicacao precisa controlar a localizacao ativa do host.

## Quando usar
- Definir explicitamente onde os toasts devem aparecer na arvore da aplicacao.
- Priorizar um host local sobre um toaster global.
- Layouts que precisam controlar o mount point de notificacoes.

## Quando evitar
- Publicar notificacoes diretamente; para isso use a API `toast`.
- Feedback inline ou modal.
- Cenarios simples onde um unico SgToaster global basta.

## Composição
- Usar com `toast` e `SgToaster` em layouts com multiplos niveis.
- Instalar um host por area quando a aplicacao precisar priorizar contexto local.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `position` | `"top-right" \| "top-left" \| "top-center" \| "bottom-right" \| "bottom-left" \| "bottom-center"` | não | Posicao dos toasts renderizados por este host. |
| `duration` | `number` | não | Duracao padrao aplicada aos toasts deste host. |
| `visibleToasts` | `number` | não | Quantidade maxima de toasts visiveis. |

## Tags
feedback, toast, host, notification, host-priority, toast-mount-point, custom-positioning, toast host, toast mount point, notification host
