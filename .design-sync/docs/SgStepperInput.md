# SgStepperInput

Campo numerico com botoes de incremento e decremento para ajuste discreto de quantidade.

## Quando usar
- Controle de quantidade com incremento discreto.
- Cenarios de carrinho, estoque ou contagem.
- Valores inteiros onde o usuario tende a usar botoes.

## Quando evitar
- Numeros decimais complexos; nesses casos prefira SgInputNumber.
- Texto livre, datas ou moedas.
- Faixas continuas; nesses casos prefira SgSlider.

## Composição
- Combinar com SgButton em fluxos de pedido ou configuracao.
- Usar ao lado de SgInputCurrency em cenarios de quantidade x preco.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador unico do componente. |
| `minValue` | `number` | sim | Valor minimo permitido. |
| `maxValue` | `number` | sim | Valor maximo permitido. |
| `step` | `number` | não | Incremento e decremento aplicados. |
| `value` | `number` | não | Valor atual controlado. |
| `readOnly` | `boolean` | não | Permite visualizacao sem edicao direta. |
| `disabled` | `boolean` | não | Desabilita interacao. |
| `onChange` | `(value: number) => void` | não | Callback de mudanca. |

## Tags
form, stepper, numeric, quantity, rhf, increment-decrement, min-max, step, numeric-entry, quantity input, increment input, counter field
