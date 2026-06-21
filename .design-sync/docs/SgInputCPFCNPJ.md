# SgInputCPFCNPJ

Campo hibrido para CPF ou CNPJ com mascara e validacao automatica conforme o documento informado.

## Quando usar
- Campos unificados que aceitam CPF ou CNPJ no mesmo fluxo.
- Cadastros onde a entidade pode ser pessoa fisica ou juridica.
- Busca ou filtro por documento brasileiro sem tipo fixo.

## Quando evitar
- Quando o dominio ja define apenas CPF; nesses casos prefira SgInputCPF.
- Quando o dominio ja define apenas CNPJ; nesses casos prefira SgInputCNPJ.
- Texto livre, telefone, email ou valores financeiros.

## Composição
- Combinar com SgInputEmail e SgInputPhone em cadastros flexiveis.
- Usar dentro de SgPanel em secoes de identificacao principal.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador unico do campo. |
| `name` | `string` | não | Nome do campo em formularios. |
| `label` | `string` | não | Rotulo exibido ao usuario. |
| `required` | `boolean` | não | Marca o campo como obrigatorio. |
| `lengthMessage` | `string` | não | Mensagem para comprimento invalido. |
| `invalidMessage` | `string` | não | Mensagem para documento invalido. |
| `validateOnBlur` | `boolean` | não | Executa validacao no blur. |
| `validation` | `(value: string) => string \| null` | não | Validacao customizada adicional. |
| `onValidation` | `(message: string \| null) => void` | não | Callback para estado de validacao. |

## Tags
form, document, cpf, cnpj, hybrid, rhf, mask, validation, cpf-cnpj, clearable, cpf cnpj, documento misto, hybrid document, cpf or cnpj
