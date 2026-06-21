# dismissSgToast

Funcao para fechar/remover um toast especifico ou todos os toasts. Complementa a funcao toast() para controle programatico.

## Quando usar
- Fechar um toast especifico quando o usuario clica em uma acao.
- Limpar todos os toasts quando o usuario sai da pagina ou sessao.
- Controlar o ciclo de vida de toasts programaticamente.

## Quando evitar
- Fechar toasts cuja duracao ja expirou; o sistema faz isso automaticamente.
- Usar sem ter disparado um toast antes; valide o ID.

## Composição
- Chamar apos uma acao do usuario.
- Usar em cleanup de componentes para fechar toasts orphos.
- Guardar o ID retornado por toast() para dismissSgToast(id) posterior.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `SgToastId \| undefined` | não | ID do toast a fechar. Se undefined, fecha todos os toasts. |

## Tags
hook, toast, notification, dismiss, dismiss-specific, dismiss-all, programmatic-control, dismiss toast, close notification, clear toast
