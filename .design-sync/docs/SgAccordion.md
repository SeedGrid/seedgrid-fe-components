# SgAccordion

Container colapsavel por secoes para organizar conteudo em paineis expansivos, verticais ou horizontais.

## Quando usar
- Agrupar conteudo em secoes expansivas quando o espaco vertical precisa ser economizado.
- Exibir FAQs, detalhes tecnicos, filtros avancados ou configuracoes em blocos colapsaveis.
- Layouts com conteudo progressivo ou dividido por categorias.

## Quando evitar
- Acoes primarias ou triggers; nesses casos prefira componentes de acao.
- Captura direta de dados; nesses casos prefira componentes de input.
- Blocos sempre visiveis sem necessidade de colapso; nesses casos prefira SgPanel ou SgCard.

## Composição
- Usar com SgInputText e outros inputs em filtros avancados ou formularios em etapas.
- Combinar com SgCard ou SgPanel quando o accordion fizer parte de um bloco maior.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `items` | `SgAccordionItem[]` | sim | Colecao de secoes renderizadas pelo accordion. |
| `orientation` | `"vertical" \| "horizontal"` | não | Direcao de expansao dos paineis. |
| `multiple` | `boolean` | não | Permite manter varios paineis abertos simultaneamente. |
| `collapsible` | `boolean` | não | Permite fechar um painel ja ativo. |
| `activeIndex` | `number[]` | não | Estado controlado dos paineis abertos. |
| `defaultActiveIndex` | `number[]` | não | Estado inicial dos paineis abertos. |
| `headerBackgroundColor` | `string` | não | Cor base dos headers do accordion. |
| `onActiveIndexChange` | `(indexes: number[]) => void` | não | Callback disparado quando o conjunto de paineis abertos muda. |

## Tags
layout, accordion, collapse, sections, disclosure, collapsible-sections, multiple-open, horizontal, controlled-state, keep-mounted, collapsible sections, expansion panels, disclosure group
