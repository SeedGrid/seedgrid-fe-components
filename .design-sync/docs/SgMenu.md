# SgMenu

Componente de navegacao estruturada com suporte a sidebar, drawer, menu inline e variantes hierarquicas ou mega menu.

## Quando usar
- Navegacao global ou lateral de aplicacoes com varias areas e niveis.
- Menus persistentes com busca, colapso, pinagem e seccoes de usuario.
- Estruturas de informacao hierarquicas que pedem submenus e mega menus.

## Quando evitar
- Indicacao simples de caminho; nesses casos prefira SgBreadcrumb.
- Acoes locais pequenas; nesses casos prefira SgPopup ou SgSplitButton.
- Containers de layout sem semantica de navegacao.

## Composição
- Usar com SgBreadcrumb para navegacao local e contexto de pagina.
- Combinar com SgAvatar e SgBadge em seccoes de usuario e notificacoes.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `menu` | `SgMenuNode[]` | sim | Arvore de itens e subitens do menu. |
| `selection` | `SgMenuSelection` | não | Selecao ativa por id ou url. |
| `menuStyle` | `"sidebar" \| "drawer" \| "inline" \| "hybrid"` | não | Modo estrutural do menu. |
| `menuVariantStyle` | `"panel" \| "tiered" \| "mega-horizontal" \| "mega-vertical"` | não | Variante visual e comportamental do menu. |
| `collapsed` | `boolean` | não | Controla o estado colapsado do menu. |
| `search` | `{ enabled: boolean; placeholder?: string }` | não | Configuracao opcional de busca integrada. |
| `brand` | `SgMenuBrand` | não | Bloco de marca no topo do menu. |
| `user` | `SgMenuUser` | não | Bloco de usuario exibido no menu. |
| `onNavigate` | `(node: SgMenuNode) => void` | não | Callback disparado na navegacao por um item. |

## Tags
navigation, menu, sidebar, drawer, mega-menu, hierarchical-navigation, search, collapse, pin, dock, brand-user-sections, navigation menu, app menu
