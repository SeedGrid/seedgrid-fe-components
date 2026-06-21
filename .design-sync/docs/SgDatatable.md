# SgDatatable

Tabela de dados interativa com colunas configuraveis, paginacao, ordenacao, filtro, selecao e persistencia de layout de colunas.

## Quando usar
- Exibicao de colecoes tabulares com interacao.
- Listagens administrativas com filtro, ordenacao e pagina.
- Tabelas com acoes por linha e selecao.

## Quando evitar
- Formularios de entrada simples.
- Colecoes muito visuais em formato de cards.
- Dados pequenos onde uma lista simples basta.

## Composição
- Combinar com filtros acima da tabela usando inputs de busca e selecao.
- Usar com dialogs e buttons para acoes de linha.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | não | Identificador da tabela usado para DOM e persistencia do layout de colunas. |
| `columns` | `SgDatatableColumn[]` | não | Definicao das colunas da tabela. |
| `rows` | `SgDatatableRow[]` | não | Linhas exibidas na tabela. |
| `selectionMode` | `string` | não | Modo de selecao de linhas. |
| `loading` | `boolean` | não | Indica estado de carregamento. |
| `paginator` | `boolean` | não | Ativa paginacao. |
| `rowsPerPage` | `number` | não | Quantidade de linhas por pagina. |
| `onPage` | `(event: SgDatatablePageEvent) => void` | não | Callback de paginacao. |
| `onSort` | `(event: SgDatatableSortEvent) => void` | não | Callback de ordenacao. |

## Tags
data, table, grid, listing, interactive, pagination, sorting, filtering, selection, column-config, column-layout-persistence, row-actions, datatable, data grid, listing grid
