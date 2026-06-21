# SgPageControl

Controle de paginas em abas para alternar entre paineis de conteudo relacionados em uma mesma area da tela.

## Quando usar
- Alternar entre secoes irmas como configuracoes, cadastro e detalhes.
- Organizar conteudo em abas sem sair da mesma tela.
- Substituir navegacao lateral quando o conjunto de paginas e pequeno e relacionado.

## Quando evitar
- Navegacao global de aplicacao; nesses casos prefira menu.
- Hierarquias profundas; nesses casos prefira breadcrumb ou tree view.
- Layouts permanentes sem alternancia.

## Composição
- Usar com SgPageControlPage para estruturar paineis filhos.
- Combinar com SgCard, SgPanel e forms multi-secao.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `children` | `ReactNode` | sim | Paginas filhas definidas por SgPageControlPage. |
| `activePageId` | `string` | não | Id da pagina ativa em modo controlado. |
| `activeIndex` | `number` | não | Indice ativo em modo controlado. |
| `keepMounted` | `boolean` | não | Mantem paineis inativos montados no DOM. |
| `pageControlStyle` | `"underline" \| "pills"` | não | Estilo visual da lista de abas. |
| `size` | `"sm" \| "md" \| "lg"` | não | Escala visual das abas. |
| `onActivePageIdChange` | `(pageId: string, context: object) => void` | não | Callback disparado quando a pagina ativa muda. |

## Tags
navigation, tabs, page-control, panels, tab-navigation, controlled-active-page, hidden-pages, keyboard-navigation, page control, tabbed navigation, section tabs
