# SgInputDate

Campo de data com validacao de intervalo e suporte a selecao temporal para eventos, prazos e datas de referencia.

## Quando usar
- Captura de datas de vencimento, agendamento, cadastro e referencia temporal.
- Campos que exigem validacao de intervalo minimo e maximo de datas.
- Selecao de data em formularios com contexto de calendario.

## Quando evitar
- Texto livre ou descricoes; nesses casos prefira SgInputText ou SgInputTextArea.
- Numeros ou valores monetarios; nesses casos prefira SgInputNumber ou SgInputCurrency.
- Escolhas estruturadas sem contexto temporal; nesses casos prefira select ou combobox.

## Composição
- Combinar com SgButton para filtros por periodo e formulários com datas.
- Usar dentro de SgPanel para blocos de agendamento ou dados temporais.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador unico do campo de data. |
| `name` | `string` | não | Nome do campo para formularios. |
| `label` | `string` | não | Rotulo principal exibido ao usuario. |
| `required` | `boolean` | não | Marca o campo como obrigatorio. |
| `minDate` | `string \| Date` | não | Data minima permitida. |
| `maxDate` | `string \| Date` | não | Data maxima permitida. |
| `placeholder` | `string` | não | Texto de apoio para orientar o preenchimento da data. |
| `readOnly` | `boolean` | não | Impede edicao mantendo leitura e foco. |
| `onChange` | `(value: string \| null) => void` | não | Callback com a data selecionada ou digitada. |

## Tags
form, date, calendar, rhf, controlled, date-format, min-max, calendar-selection, date input, calendar field, deadline input, schedule date
