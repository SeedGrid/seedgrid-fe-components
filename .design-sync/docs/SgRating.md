# SgRating

Controle de avaliacao ordinal para notas, estrelas e feedback rapido do usuario.

## Quando usar
- Coleta de nota ou avaliacao visual.
- Pesquisas rapidas de satisfacao.
- Feedback com escala pequena e intuitiva.

## Quando evitar
- Precisao numerica de negocio; nesses casos prefira inputs numericos.
- Texto livre de comentario; use componente complementar.
- Escolhas nominais ou filtros complexos.

## Composição
- Combinar com SgInputTextArea para feedback detalhado.
- Usar em formularios de avaliacao e pesquisa.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | não | Identificador unico do componente. |
| `label` | `string` | não | Rotulo do campo. |
| `value` | `number` | não | Nota atual. |
| `max` | `number` | não | Quantidade maxima de itens de avaliacao. |
| `readOnly` | `boolean` | não | Impede alteracao da nota. |
| `disabled` | `boolean` | não | Desabilita interacao. |
| `size` | `string` | não | Tamanho visual do controle. |
| `onChange` | `(value: number \| null) => void` | não | Callback de mudanca. |

## Tags
form, rating, stars, feedback, rhf, ordinal-value, visual-rating, icons, score, review rating
