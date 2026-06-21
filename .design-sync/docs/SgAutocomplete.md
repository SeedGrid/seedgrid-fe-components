# SgAutocomplete

Campo de busca assistida com sugestoes, fonte assincrona, cache e selecao de item a partir de texto digitado.

## Quando usar
- Busca de entidades ou referencias em listas grandes.
- Selecao assistida com pesquisa incremental.
- Campos onde o usuario sabe parte do valor, mas nao a lista completa.

## Quando evitar
- Listas pequenas e fixas; nesses casos prefira SgCombobox ou SgRadioGroup.
- Texto livre sem sugestoes.
- Valores monetarios, datas ou documentos mascarados.

## Composição
- Combinar com SgPanel em blocos de filtros e formularios relacionais.
- Usar com SgButton em fluxos de busca e selecao.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | sim | Identificador unico do campo. |
| `label` | `string` | não | Rotulo exibido ao usuario. |
| `source` | `(query: string) => Promise<T[]> \| T[]` | não | Fonte de resultados para busca. |
| `minLengthForSearch` | `number` | não | Quantidade minima de caracteres para buscar. |
| `delay` | `number` | não | Debounce da pesquisa em milissegundos. |
| `maxResult` | `number` | não | Limite de resultados exibidos. |
| `allowCustomValue` | `boolean` | não | Permite valor fora da lista. |
| `openOnFocus` | `boolean` | não | Abre sugestoes ao focar. |
| `onSelect` | `(item: SgAutocompleteItem) => void` | não | Callback disparado ao selecionar item. |

## Tags
form, autocomplete, search, suggestions, rhf, async-source, cache, grouped-results, custom-render, typeahead, search select, lookup field
