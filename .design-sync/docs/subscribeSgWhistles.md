# subscribeSgWhistles

Funcao para se inscrever em mudancas de whistles. Permite monitorar e reagir quando novos whistles sao criados ou removidos.

## Quando usar
- Renderizar lista customizada de whistles.
- Implementar analytics ou logging de notificacoes.
- Sincronizar estado de whistles com componente nao-React.
- Reagir quando um whistle especifico aparece (ex: loading → success).

## Quando evitar
- Controlar exibicao de whistles; use SgWhistleHost para isso.
- Modificar whistles dentro do listener; cria efeitos colaterais.

## Composição
- Usar em useEffect com cleanup para unsubscribe.
- Guardar o unsubscribe retornado para limpeza.
- Combinar com sgWhistle() e dismissSgWhistle() para controle completo.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `listener` | `(whistles: SgWhistleRecord[]) => void` | sim | Callback chamado quando whistles mudam. Recebe lista snapshot de whistles atual. |

## Tags
hook, whistle, subscription, reactive, subscribe, listen, reactive-updates, listen to whistles, whistle observer
