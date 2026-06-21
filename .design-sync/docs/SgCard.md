# SgCard

Container visual para destacar conteudo em blocos com cabecalho, descricao, acoes, rodape e estados colapsaveis.

## Quando usar
- Destacar informacoes resumidas, KPIs, blocos de conteudo e areas de detalhe.
- Agrupar cabecalho, corpo e rodape em um bloco visual independente.
- Criar cards clicaveis, colapsaveis ou arrastaveis em dashboards e listas.

## Quando evitar
- Executar acoes diretas; nesses casos prefira componentes de botao.
- Capturar dados do usuario; nesses casos prefira componentes de input.
- Layouts de seccao mais neutros e sem destaque visual; nesses casos prefira SgPanel.

## Composição
- Usar com SgButton em rodapes de acao ou cabecalhos de resumo.
- Combinar com SgAccordion e SgPanel em telas analiticas e dashboards.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `title` | `ReactNode` | não | Titulo principal do card. |
| `description` | `ReactNode` | não | Descricao ou subtitulo complementar do cabecalho. |
| `children` | `ReactNode` | sim | Conteudo principal exibido dentro do card. |
| `cardStyle` | `"default" \| "outlined" \| "elevated" \| "flat"` | não | Estilo visual da superficie do card. |
| `size` | `"sm" \| "md" \| "lg"` | não | Escala geral de espacos e dimensoes do card. |
| `collapsible` | `boolean` | não | Permite recolher e expandir o conteudo do card. |
| `clickable` | `boolean` | não | Transforma o card em superficie clicavel. |
| `onClick` | `() => void` | não | Callback disparado quando o card e acionado. |

## Tags
layout, card, container, surface, content-block, header-footer, highlighted-content, collapsible, clickable, draggable, surface-styles, content card, summary card, surface block
