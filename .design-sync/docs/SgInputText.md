# SgInputText

Campo textual de uso geral com suporte a react-hook-form, validacao, contador de caracteres e prefixo/sufixo.

## Quando usar
- Campos textuais curtos em formularios CRUD.
- Captura de nome, titulo, codigo ou identificador textual.
- Entradas livres que precisam de validacao e integracao com react-hook-form.

## Quando evitar
- Texto longo ou rico; nesses casos prefira SgInputTextArea ou SgTextEditor.
- Escolhas fechadas; nesses casos prefira SgCombobox, SgAutocomplete ou SgRadioGroup.
- Datas, numeros ou valores com mascara especializada.

## Composição
- Combinar com SgButton para acoes de submit.
- Agrupar com SgPanel ou SgGroupBox em secoes de formulario.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador unico do campo. |
| `name` | `string` | não | Nome do campo para formularios. |
| `label` | `string` | não | Rotulo principal exibido ao usuario. |
| `placeholder` | `string` | não | Texto de apoio dentro do input. |
| `required` | `boolean` | não | Marca o campo como obrigatorio. |
| `readOnly` | `boolean` | não | Impede edicao mantendo foco e leitura. |
| `maxLength` | `number` | não | Limite maximo de caracteres. |
| `minLength` | `number` | não | Limite minimo de caracteres. |
| `onChange` | `(value: string) => void` | não | Callback com o valor textual atual. |

## Tags
form, text, field, rhf, controlled, validation, clearable, prefix-suffix, char-counter, text field, text input, campo texto, campo livre
