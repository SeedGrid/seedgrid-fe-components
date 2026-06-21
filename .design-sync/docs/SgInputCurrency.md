# SgInputCurrency

Campo monetario com formatacao de moeda, simbolo e validacao para precos, valores financeiros e totais.

## Quando usar
- Captura de precos, totais, descontos e valores financeiros.
- Campos monetarios que exigem formatacao de moeda e simbolo visual.
- Entradas financeiras em formularios de venda, faturamento e cadastro.

## Quando evitar
- Numeros genericos sem semantica monetaria; nesses casos prefira SgInputNumber.
- Texto livre; nesses casos prefira SgInputText ou SgInputTextArea.
- Datas e horas; nesses casos prefira SgInputDate.

## Composição
- Combinar com SgInputNumber para quantidades e com SgButton para acoes de submit.
- Usar dentro de SgPanel em secoes financeiras ou comerciais.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador unico do campo monetario. |
| `name` | `string` | não | Nome do campo para formularios. |
| `label` | `string` | não | Rotulo principal exibido ao usuario. |
| `currency` | `string` | não | Codigo ou configuracao de moeda usada na formatacao. |
| `symbol` | `string` | não | Simbolo monetario exibido no campo. |
| `required` | `boolean` | não | Marca o campo como obrigatorio. |
| `min` | `number` | não | Valor monetario minimo aceito. |
| `max` | `number` | não | Valor monetario maximo aceito. |
| `onChange` | `(value: number \| null) => void` | não | Callback com o valor monetario normalizado. |

## Tags
form, currency, money, price, rhf, controlled, currency-format, symbol, min-max, validation, currency input, money field, price input, amount input
