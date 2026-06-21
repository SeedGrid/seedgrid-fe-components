# SgInputPassword

Campo especializado para senha com validacoes de politica, alternancia de visibilidade e indicacao de forca.

## Quando usar
- Captura de senha em login, cadastro e redefinicao de credencial.
- Campos que exigem politica minima de seguranca.
- Fluxos que precisam exibir forca de senha ou alternar visibilidade.

## Quando evitar
- OTP ou codigo temporario; nesses casos prefira SgInputOTP.
- Texto livre, email ou identificadores publicos.
- Valores numericos, monetarios ou datas.

## Composição
- Combinar com SgInputEmail em login e cadastro.
- Usar com SgButton para submit de autenticacao ou troca de senha.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador unico do campo. |
| `name` | `string` | não | Nome do campo em formularios. |
| `label` | `string` | não | Rotulo exibido ao usuario. |
| `required` | `boolean` | não | Marca o campo como obrigatorio. |
| `minSize` | `number` | não | Tamanho minimo esperado da senha. |
| `showStrengthBar` | `boolean` | não | Exibe barra de forca da senha. |
| `commonPasswordCheck` | `boolean` | não | Bloqueia senhas comuns. |
| `hidePassword` | `boolean` | não | Oculta a senha inicialmente. |
| `onValidation` | `(message: string \| null) => void` | não | Callback para estado de validacao. |

## Tags
form, password, security, auth, rhf, validation, password-policy, strength-bar, hide-show, clearable, secret, credential input, login password
