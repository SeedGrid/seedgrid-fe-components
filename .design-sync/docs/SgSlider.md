# SgSlider

Controle deslizante para ajuste numerico continuo dentro de um intervalo definido.

## Quando usar
- Ajuste de valor em intervalo continuo.
- Configuracoes numericas com feedback visual.
- Filtros ou controles onde arrastar e melhor que digitar.

## Quando evitar
- Precisao numerica alta; nesses casos prefira SgInputNumber.
- Texto livre, datas ou moedas.
- Escolhas nominais entre opcoes discretas.

## Composição
- Combinar com SgInputNumber quando o usuario precisar tanto arrastar quanto digitar.
- Usar em paineis de filtro e configuracao.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador unico do componente. |
| `minValue` | `number` | sim | Valor minimo do intervalo. |
| `maxValue` | `number` | sim | Valor maximo do intervalo. |
| `value` | `number` | não | Valor atual controlado. |
| `step` | `number` | não | Passo entre valores. |
| `disabled` | `boolean` | não | Desabilita interacao. |
| `width` | `number \| string` | não | Largura do componente. |
| `onChange` | `(value: number) => void` | não | Callback de mudanca. |

## Tags
form, slider, range, numeric, rhf, continuous-value, min-max, step, range-input, range input, seek bar, value slider
