# SgToggleSwitch

Interruptor booleano para ativar ou desativar estados, flags e configuracoes simples.

## Quando usar
- Flags booleanas e configuracoes simples.
- Estados ligado/desligado com feedback visual direto.
- Preferencias, ativacoes e permissoes binarias.

## Quando evitar
- Acoes imediatas; nesses casos prefira SgButton.
- Escolhas entre mais de dois estados.
- Texto livre ou numeros.

## Composição
- Combinar com SgCheckboxGroup em telas de configuracao.
- Usar em formularios de preferencia e administracao.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador unico do componente. |
| `label` | `string` | não | Rotulo exibido ao usuario. |
| `checked` | `boolean` | não | Valor booleano atual. |
| `disabled` | `boolean` | não | Desabilita interacao. |
| `readOnly` | `boolean` | não | Permite visualizacao sem alteracao. |
| `checkedLabel` | `string` | não | Texto exibido no estado ligado. |
| `uncheckedLabel` | `string` | não | Texto exibido no estado desligado. |
| `onChange` | `(checked: boolean) => void` | não | Callback de mudanca. |

## Tags
form, toggle, switch, boolean, rhf, boolean-value, on-off, visual-state, boolean switch, on off control
