# SgInputBirthDate

Campo especializado para data de nascimento com validacao de idade minima e maxima sobre a base de SgInputDate.

## Quando usar
- Captura de data de nascimento em cadastros de pessoa.
- Formularios com restricao de idade minima ou maxima.
- Campos temporais ligados a identidade pessoal.

## Quando evitar
- Datas genericas de agenda ou vencimento; nesses casos prefira SgInputDate.
- Texto livre ou documentos; nesses casos prefira os inputs especificos.
- Numeros ou valores monetarios.

## Composição
- Combinar com SgInputCPF, SgInputEmail e SgInputPhone em cadastros pessoais.
- Usar dentro de SgPanel em secoes de dados pessoais.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador unico do campo. |
| `name` | `string` | não | Nome do campo em formularios. |
| `label` | `string` | não | Rotulo exibido ao usuario. |
| `required` | `boolean` | não | Marca o campo como obrigatorio. |
| `minAge` | `number` | não | Idade minima permitida. |
| `maxAge` | `number` | não | Idade maxima permitida. |
| `minDate` | `string \| Date` | não | Data minima permitida. |
| `maxDate` | `string \| Date` | não | Data maxima permitida. |
| `onValidation` | `(message: string \| null) => void` | não | Callback para estado de validacao. |

## Tags
form, birth-date, date, age, rhf, controlled, date-format, min-age, max-age, validation, birth date, date of birth, dob, data de nascimento
