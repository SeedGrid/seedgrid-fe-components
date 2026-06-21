# SgWhistleHost

Host de avisos persistentes ou semi-persistentes em pilha, com cores por severidade, acao opcional e controle de maximo visivel.

## Quando usar
- Exibir avisos empilhados mais persistentes do que um toast.
- Comunicar erros, warnings e mensagens operacionais inline em uma area fixa.
- Agrupar alertas com acao e dismiss local.

## Quando evitar
- Feedback ultraleve e efemero; nesses casos prefira toaster.
- Modais de confirmacao.
- Indicadores compactos como badge.

## Composição
- Usar com a API `sgWhistle` para publicar avisos.
- Combinar com SgCard ou SgPanel em dashboards operacionais.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `max` | `number` | não | Quantidade maxima de whistle items visiveis. |
| `newestOnTop` | `boolean` | não | Inverte a ordem visual para mostrar os mais novos primeiro. |
| `gap` | `number` | não | Espacamento entre os avisos renderizados. |

## Tags
feedback, alerts, host, inline-notifications, alert-stacking, severity-colors, dismissible-items, timed-dismiss, alert host, message stack, persistent notifications
