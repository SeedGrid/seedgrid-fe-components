# SgInputOTP

Campo OTP multi-slot para codigos de verificacao com suporte a mascara, colagem, eventos de conclusao e acesso por ref.

## Quando usar
- Captura de codigo temporario de verificacao.
- Fluxos de autenticacao em dois fatores e confirmacao de login.
- Entradas curtas e estruturadas com conclusao automatica.

## Quando evitar
- Senha permanente; nesses casos prefira SgInputPassword.
- Texto livre, email ou telefone.
- Selecoes estruturadas ou valores monetarios.

## Composição
- Combinar com SgInputEmail ou SgInputPhone em fluxos de verificacao.
- Usar com SgButton para reenvio de codigo e confirmacao.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador unico do componente. |
| `name` | `string` | não | Nome do campo em formularios. |
| `label` | `string` | não | Rotulo exibido ao usuario. |
| `mask` | `string` | não | Mascara de slots para o codigo. |
| `required` | `boolean` | não | Marca o campo como obrigatorio. |
| `validateOnBlur` | `boolean` | não | Executa validacao no blur. |
| `onRawChange` | `(rawValue: string) => void` | não | Callback com o valor bruto do codigo. |
| `onComplete` | `(value: string) => void` | não | Callback disparado ao completar o codigo. |
| `onValidation` | `(message: string \| null) => void` | não | Callback para estado de validacao. |

## Tags
form, otp, verification, code, security, rhf, mask, multi-slot, paste-support, on-complete, clearable, one time password, verification code, auth code, token input
