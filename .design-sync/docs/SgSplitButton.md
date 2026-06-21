# SgSplitButton

Botao de acao com trigger principal e menu secundario acoplado para variacoes contextuais da mesma tarefa.

## Quando usar
- Acoes com um caminho principal e opcoes secundarias relacionadas no mesmo contexto.
- Fluxos como salvar, exportar, compartilhar ou criar com variacoes de execucao.
- Toolbars e rodapes que precisam reduzir repeticao de botoes de acao.

## Quando evitar
- Acoes simples com uma unica intencao; nesses casos prefira SgButton.
- Estruturar layout ou agrupar conteudo; nesses casos prefira SgPanel, SgCard ou SgAccordion.
- Capturar dados do usuario; nesses casos prefira componentes de input.

## Composição
- Usar com SgPanel e SgCard em cabecalhos de bloco ou areas de acao.
- Combinar com componentes de input em formularios com variacoes de submit.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `label` | `ReactNode` | não | Conteudo textual principal da acao. |
| `items` | `SgSplitButtonItem[]` | sim | Lista de acoes secundarias exibidas no menu dropdown. |
| `severity` | `"primary" \| "secondary" \| "success" \| "info" \| "warning" \| "help" \| "danger"` | não | Peso visual e semantico da acao principal. |
| `appearance` | `"solid" \| "outline" \| "ghost"` | não | Variante visual base do split button. |
| `disabled` | `boolean` | não | Desabilita a acao principal e o menu secundario. |
| `loading` | `boolean` | não | Exibe estado de carregamento na acao principal. |
| `leftIcon` | `ReactNode` | não | Icone exibido junto do label principal. |
| `onClick` | `() => void` | não | Callback disparado na acao principal. |

## Tags
action, button, menu, dropdown, cta, primary-action, secondary-actions, menu-items, severity, loading, disabled, split button, dropdown action button, menu button, compound action
