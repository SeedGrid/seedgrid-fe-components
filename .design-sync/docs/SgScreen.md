# SgScreen

Container estrutural de alto nivel para composicao de telas com area client, fullscreen opcional e suporte a docking.

## Quando usar
- Compor shells de aplicacao, workspaces e layouts de tela completos.
- Criar area raiz para estruturas com docking, sidebars, header e footer.
- Organizar conteudo de pagina com controle explicito de largura, altura e padding.

## Quando evitar
- Blocos locais de agrupamento; nesses casos prefira Panel, Card ou GroupBox.
- Acoes ou entradas de dados; nesses casos prefira Button ou componentes de input.
- Menus de navegacao especializados; nesses casos prefira DockMenu, Menu ou Breadcrumb.

## Composição
- Usar com Panel, Stack e DockMenu para montar a estrutura completa da tela.
- Combinar com dialogs, popups e componentes de navegacao em shells complexos.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `children` | `ReactNode` | não | Conteudo estrutural da tela, normalmente com panels dockados. |
| `fullscreen` | `boolean` | não | Define se a tela ocupa toda a viewport. |
| `width` | `number \| string` | não | Largura explicita quando a tela nao for fullscreen. |
| `height` | `number \| string` | não | Altura explicita quando a tela nao for fullscreen. |
| `padding` | `number \| string` | não | Espacamento interno aplicado ao root da tela. |
| `className` | `string` | não | Classes adicionais aplicadas ao container principal. |

## Tags
layout, screen, shell, page, docking, full-screen-container, dock-layout, root-shell, responsive-sizing, client-area, page shell, layout shell, workspace
