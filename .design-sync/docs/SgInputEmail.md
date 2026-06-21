# SgInputEmail

Campo especializado para email com validacao de formato, bloqueio opcional de dominios temporarios e integracao com formularios.

## Quando usar
- Captura de email de contato, login ou notificacao.
- Formularios com validacao de formato de email.
- Campos que precisam bloquear dominios temporarios ou descartaveis.

## Quando evitar
- Texto livre ou identificadores genericos; nesses casos prefira SgInputText.
- Telefone ou outros contatos nao estruturados.
- Senhas, OTPs ou selecoes estruturadas.

## Composição
- Combinar com SgInputPassword em autenticacao e login.
- Usar com SgInputPhone e SgButton em formularios de contato.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador unico do campo. |
| `name` | `string` | não | Nome do campo em formularios. |
| `label` | `string` | não | Rotulo exibido ao usuario. |
| `required` | `boolean` | não | Marca o campo como obrigatorio. |
| `invalidMessage` | `string` | não | Mensagem para email invalido. |
| `blockFakeMail` | `boolean` | não | Bloqueia dominios temporarios conhecidos. |
| `blockedEmailDomains` | `string[]` | não | Lista customizada de dominios bloqueados. |
| `validateOnBlur` | `boolean` | não | Executa validacao no blur. |
| `onValidation` | `(message: string \| null) => void` | não | Callback para estado de validacao. |

## Tags
form, email, contact, login, rhf, controlled, validation, email-format, blocked-domains, clearable, email input, mail field, contact email
