# SgRadioGroup

Grupo de radios para escolha unica com orientacao e estilo visual configuravel.

## Quando usar
- Escolha unica com opcoes visiveis ao mesmo tempo.
- Perguntas binárias ou enumeradas com poucas alternativas.
- Cenarios onde a comparacao visual entre opcoes importa.

## Quando evitar
- Multisselecao; nesses casos prefira SgCheckboxGroup.
- Listas longas; nesses casos prefira select ou combobox.
- Texto livre ou valores numericos.

## Composição
- Combinar com SgCheckboxGroup em formularios com diferentes tipos de escolha.
- Usar dentro de SgPanel para secoes de preferencia e configuracao.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `title` | `string` | não | Titulo do grupo. |
| `source` | `SgRadioGroupOption[]` | não | Opcoes disponiveis. |
| `value` | `string \| number` | não | Valor selecionado. |
| `orientation` | `"horizontal" \| "vertical"` | não | Orientacao visual do grupo. |
| `selectionStyle` | `"radio" \| "highlight"` | não | Estilo visual de selecao. |
| `required` | `boolean` | não | Marca o grupo como obrigatorio. |
| `readOnly` | `boolean` | não | Impede alteracoes no valor. |
| `onChange` | `(value: string \| number \| null) => void` | não | Callback de mudanca. |

## Tags
form, radio, single-choice, options, rhf, single-selection, group-box, highlight-style, radio group, single choice, one of many, option group
