# SgCheckboxGroup

Grupo de checkboxes para multisselecao com orientacao, estilo de selecao e suporte opcional a marcar todos.

## Quando usar
- Multisselecao de opcoes independentes.
- Filtros com varias categorias ativas ao mesmo tempo.
- Configuracoes booleanas agrupadas.

## Quando evitar
- Escolha unica; nesses casos prefira SgRadioGroup ou SgCombobox.
- Listas muito grandes com busca; nesses casos prefira componentes de lookup.
- Texto livre ou dados numericos.

## Composição
- Combinar com SgRadioGroup para formularios com escolhas simples e multiplas.
- Usar dentro de SgPanel em configuracoes e filtros.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `title` | `string` | não | Titulo do grupo. |
| `source` | `SgCheckboxGroupOption[]` | não | Opcoes disponiveis. |
| `value` | `(string \| number)[]` | não | Valores selecionados. |
| `orientation` | `"horizontal" \| "vertical"` | não | Orientacao visual do grupo. |
| `selectionStyle` | `"checkbox" \| "highlight"` | não | Estilo visual de selecao. |
| `showCheckAll` | `boolean` | não | Exibe acao de marcar todos. |
| `required` | `boolean` | não | Marca o grupo como obrigatorio. |
| `onChange` | `(value: (string \| number)[]) => void` | não | Callback de mudanca. |

## Tags
form, checkbox, multi-select, options, rhf, multi-selection, check-all, group-box, highlight-style, checkbox group, multi select, multiple choice, checklist field
