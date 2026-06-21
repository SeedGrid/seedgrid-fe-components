# SgInputCPF

Campo especializado para CPF com mascara, validacao de digitos e integracao com fluxos de cadastro de pessoa fisica.

## Quando usar
- Captura de CPF em formularios de pessoa fisica.
- Identificacao fiscal brasileira com validacao automatica.
- Fluxos de cadastro, onboarding e confirmacao de identidade.

## Quando evitar
- CNPJ ou documentos empresariais; nesses casos prefira SgInputCNPJ.
- Texto livre ou codigos genericos.
- Entradas monetarias, datas ou selecoes estruturadas.

## Composição
- Combinar com SgInputBirthDate e SgInputEmail em cadastro de pessoa fisica.
- Usar dentro de SgPanel em blocos de identificacao.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador unico do campo. |
| `name` | `string` | não | Nome do campo em formularios. |
| `label` | `string` | não | Rotulo exibido ao usuario. |
| `required` | `boolean` | não | Marca o campo como obrigatorio. |
| `requiredMessage` | `string` | não | Mensagem para ausencia de valor. |
| `lengthMessage` | `string` | não | Mensagem para tamanho invalido. |
| `invalidMessage` | `string` | não | Mensagem para CPF invalido. |
| `validateOnBlur` | `boolean` | não | Executa validacao no blur. |
| `onValidation` | `(message: string \| null) => void` | não | Callback para estado de validacao. |

## Tags
form, document, cpf, brazil, rhf, mask, validation, clearable, tax id, documento cpf, personal tax id
