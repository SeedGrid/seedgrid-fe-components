# SgInputPhone

Campo especializado para telefone com mascara, validacao de comprimento e integracao com formularios.

## Quando usar
- Captura de telefone ou celular de contato.
- Formularios de cadastro e atendimento com validacao basica de comprimento.
- Campos que exigem mascara e inputMode numerico.

## Quando evitar
- Email ou outros contatos estruturados; nesses casos prefira o componente especifico.
- Texto livre, observacoes ou codigos internos.
- Valores monetarios, datas e selecoes estruturadas.

## Composição
- Combinar com SgInputEmail e SgButton em formularios de contato.
- Usar dentro de SgPanel em blocos de dados cadastrais.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador unico do campo. |
| `name` | `string` | não | Nome do campo em formularios. |
| `label` | `string` | não | Rotulo exibido ao usuario. |
| `required` | `boolean` | não | Marca o campo como obrigatorio. |
| `lengthMessage` | `string` | não | Mensagem para telefone com tamanho invalido. |
| `invalidMessage` | `string` | não | Mensagem para telefone invalido. |
| `validateOnBlur` | `boolean` | não | Executa validacao no blur. |
| `inputProps` | `InputHTMLAttributes<HTMLInputElement>` | não | Props nativos do input. |
| `onValidation` | `(message: string \| null) => void` | não | Callback para estado de validacao. |

## Tags
form, phone, contact, mask, rhf, validation, phone-format, clearable, telephone, mobile, phone input, contact phone
