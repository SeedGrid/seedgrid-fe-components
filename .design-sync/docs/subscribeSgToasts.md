# subscribeSgToasts

Funcao para se inscrever em mudancas de toasts. Permite monitorar e reagir quando novos toasts sao criados ou removidos.

## Quando usar
- Renderizar lista customizada de toasts.
- Implementar analytics ou logging de notificacoes.
- Sincronizar estado de toasts com componente nao-React.
- Reagir quando um toast especifico aparece (ex: loading → success).

## Quando evitar
- Controlar exibicao de toasts; use SgToastHost para isso.
- Modificar toasts dentro do listener; cria efeitos colaterais.

## Composição
- Usar em useEffect com cleanup para unsubscribe.
- Guardar o unsubscribe retornado para limpeza.
- Combinar com toast() e dismissSgToast() para controle completo.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `listener` | `(toasts: SgToastRecord[]) => void` | sim | Callback chamado quando toasts mudam. Recebe lista snapshot de toasts atual. |

## Tags
hook, toast, subscription, reactive, subscribe, listen, reactive-updates, listen to toasts, toast observer
