# SgInputCNPJ

Campo especializado para CNPJ com mascara, validacao de digitos e suporte opcional a consulta externa.

## Quando usar
- Captura de CNPJ em formularios de empresa.
- Identificacao fiscal de organizacoes brasileiras.
- Fluxos de cadastro de fornecedor, cliente corporativo e emitente.

## Quando evitar
- CPF ou documentos de pessoa fisica; nesses casos prefira SgInputCPF.
- Texto livre, codigos internos ou email.
- Valores numericos genericos e datas.

## Composição
- Combinar com SgInputEmail, SgInputPhone e SgInputPostalCode em cadastros de empresa.
- Usar dentro de SgPanel em secoes de identificacao corporativa.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador unico do campo. |
| `name` | `string` | não | Nome do campo em formularios. |
| `label` | `string` | não | Rotulo exibido ao usuario. |
| `required` | `boolean` | não | Marca o campo como obrigatorio. |
| `validateWithPublicaCnpj` | `boolean` | não | Ativa validacao externa opcional. |
| `publicaCnpjErrorMessage` | `string` | não | Mensagem para falha na consulta externa. |
| `invalidMessage` | `string` | não | Mensagem para CNPJ invalido. |
| `validateOnBlur` | `boolean` | não | Executa validacao no blur. |
| `onValidation` | `(message: string \| null) => void` | não | Callback para estado de validacao. |

## Tags
form, document, cnpj, brazil, rhf, mask, validation, publica-cnpj, clearable, company tax id, documento cnpj, business tax id
