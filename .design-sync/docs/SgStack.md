# SgStack

Primitive de layout flexivel para empilhar elementos em linha ou coluna com controle de gap, alinhamento e wrap.

## Quando usar
- Empilhar botoes, campos e blocos em linha ou coluna com espaco consistente.
- Criar composicoes simples e reutilizaveis dentro de cards, paineis e dialogs.
- Substituir CSS flex manual em cenarios comuns de alinhamento.

## Quando evitar
- Grades responsivas com varias colunas; nesses casos prefira SgGrid.
- Blocos com destaque visual proprio; nesses casos prefira SgCard ou SgPanel.
- Captura de dados ou acoes por si so; nesses casos prefira componentes especificos.

## Composição
- Usar dentro de SgGrid, SgCard e SgDialog para organizar o conteudo interno.
- Combinar com sgInput* para layouts de formulario lineares.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `direction` | `"row" \| "column"` | não | Direcao principal do empilhamento. |
| `gap` | `number \| string` | não | Espacamento entre os itens. |
| `justify` | `"start" \| "center" \| "end" \| "between" \| "around" \| "evenly"` | não | Distribuicao dos itens no eixo principal. |
| `align` | `"start" \| "center" \| "end" \| "stretch"` | não | Alinhamento dos itens no eixo cruzado. |
| `wrap` | `boolean` | não | Permite quebra de linha quando necessario. |
| `grow` | `boolean` | não | Permite que o stack cresca ocupando espaco disponivel. |
| `children` | `ReactNode` | não | Itens renderizados dentro do stack. |

## Tags
layout, stack, flex, row, column, row-column-layout, gap, justify, align, wrap, grow, flex stack, row/column layout, linear container
