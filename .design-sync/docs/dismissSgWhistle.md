# dismissSgWhistle

Funcao para fechar/remover um whistle especifico ou todos os whistles. Complementa sgWhistle() para controle programatico.

## Quando usar
- Fechar um whistle especifico quando o usuario clica em uma acao.
- Limpar todos os whistles quando o usuario sai da pagina ou sessao.
- Controlar o ciclo de vida de whistles programaticamente.

## Quando evitar
- Fechar whistles cuja duracao ja expirou; o sistema faz isso automaticamente.
- Usar sem ter disparado um whistle antes; valide o ID.

## Composição
- Chamar apos uma acao do usuario.
- Usar em cleanup de componentes para fechar whistles orphos.
- Guardar o ID retornado por sgWhistle() para dismissSgWhistle(id) posterior.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `SgWhistleId \| undefined` | não | ID do whistle a fechar. Se undefined, fecha todos os whistles. |

## Tags
hook, whistle, notification, dismiss, dismiss-specific, dismiss-all, programmatic-control, dismiss whistle, close notification, clear alert
