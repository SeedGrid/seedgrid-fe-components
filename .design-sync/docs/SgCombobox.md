# SgCombobox

Campo de escolha assistida que combina digitacao e selecao de item com suporte a fonte local ou remota.

## Quando usar
- Escolha unica com busca assistida em listas medias ou grandes.
- Campos relacionais em formularios CRUD.
- Selecao com melhor UX do que um select nativo.

## Quando evitar
- Listas muito pequenas e fixas; nesses casos prefira SgRadioGroup ou SgCheckboxGroup conforme o caso.
- Texto livre sem expectativa de selecao.
- Multisselecao; nesses casos prefira outros componentes especializados.

## Composição
- Combinar com SgAutocomplete quando houver campos de lookup com requisitos diferentes.
- Usar dentro de SgPanel em formularios relacionais.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador unico do campo. |
| `label` | `string` | não | Rotulo exibido ao usuario. |
| `source` | `T[] \| ((query: string) => Promise<T[]> \| T[])` | não | Fonte de itens. |
| `value` | `string \| number \| null` | não | Valor selecionado. |
| `grouped` | `boolean` | não | Agrupa resultados por categoria. |
| `openOnFocus` | `boolean` | não | Abre lista ao focar. |
| `loadingText` | `string` | não | Texto exibido durante carregamento. |
| `onValueChange` | `(value: string \| number \| null) => void` | não | Callback de mudanca de valor. |
| `onSelect` | `(value: T) => void` | não | Callback ao selecionar item. |

## Tags
form, combobox, choice, lookup, rhf, search, single-selection, async-source, custom-render, grouped-results, searchable select, lookup combo, assisted select
