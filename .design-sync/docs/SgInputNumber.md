# SgInputNumber

Campo numerico com suporte a valores inteiros e decimais, validacao de limites e integracao com react-hook-form.

## Quando usar
- Captura de quantidades, medidas, percentuais e outros valores numericos genericos.
- Campos que exigem validacao numerica com limites minimos e maximos.
- Entradas inteiras ou decimais em formularios CRUD.

## Quando evitar
- Texto livre ou descricoes; nesses casos prefira SgInputText ou SgInputTextArea.
- Valores monetarios; nesses casos prefira SgInputCurrency.
- Datas e horas; nesses casos prefira SgInputDate.

## Composição
- Combinar com SgButton em formularios de calculo ou cadastro.
- Usar dentro de SgPanel ou SgGroupBox para secoes de dados numericos.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador unico do campo numerico. |
| `name` | `string` | não | Nome do campo para formularios. |
| `label` | `string` | não | Rotulo principal exibido ao usuario. |
| `required` | `boolean` | não | Marca o campo como obrigatorio. |
| `min` | `number` | não | Valor minimo aceito. |
| `max` | `number` | não | Valor maximo aceito. |
| `decimals` | `number` | não | Quantidade de casas decimais permitidas. |
| `readOnly` | `boolean` | não | Impede edicao mantendo leitura e foco. |
| `onChange` | `(value: number \| null) => void` | não | Callback com o valor numerico atual. |

## Tags
form, number, numeric, rhf, controlled, validation, min-max, decimal, clearable, number input, numeric field, quantity input, decimal input
