# SgFloatActionButton

Botao de acao flutuante para tarefas de alto destaque, com suporte a hint, posicao fixa e expansao de acoes secundarias.

## Quando usar
- Acoes rapidas de alto destaque que precisam permanecer visiveis na tela.
- Criar, adicionar ou abrir fluxos principais em layouts mobile e dashboards.
- Menus compactos de acoes contextuais com expansao radial ou linear.

## Quando evitar
- Acoes comuns de formulario em linha; nesses casos prefira SgButton ou SgSplitButton.
- Agrupar conteudo ou criar secoes visuais; nesses casos prefira componentes de layout.
- Capturar dados do usuario; nesses casos prefira componentes de input.

## Composição
- Usar sobre SgPanel, SgCard ou telas longas como atalho de acao principal.
- Combinar com listas e datatables quando a acao precisa ficar sempre acessivel.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `icon` | `ReactNode` | sim | Icone principal exibido no FAB. |
| `actions` | `SgFABAction[]` | não | Acoes secundarias exibidas a partir do botao flutuante. |
| `position` | `"bottom-right" \| "bottom-left" \| "top-right" \| "top-left"` | não | Posicao do FAB na area visivel. |
| `hint` | `string` | não | Rotulo textual complementar exibido como hint. |
| `severity` | `"primary" \| "secondary" \| "success" \| "info" \| "warning" \| "help" \| "danger"` | não | Peso visual da acao flutuante. |
| `disabled` | `boolean` | não | Desabilita a acao principal e as acoes derivadas. |
| `loading` | `boolean` | não | Exibe estado de carregamento no FAB. |
| `onClick` | `() => void` | não | Callback da acao principal do FAB. |

## Tags
action, floating, fab, quick-action, overlay, floating-position, action-groups, hint, drag-drop, auto-hide, floating action button, quick action button, floating cta
