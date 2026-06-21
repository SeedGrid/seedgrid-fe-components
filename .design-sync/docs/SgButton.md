# SgButton

Botao de acao com suporte a severity, appearance, shape, loading e icones para acoes principais e secundarias.

## Quando usar
- Acoes primarias e secundarias em formularios e telas CRUD.
- Submit, confirmacao, salvar, cancelar e outras acoes explicitas do usuario.
- Chamadas para acao com feedback visual de loading.

## Quando evitar
- Agrupar conteudo ou estruturar layout; nesses casos prefira SgPanel, SgCard ou SgStack.
- Captura de dados; nesses casos prefira componentes de input.
- Blocos de navegacao complexa; nesses casos prefira componentes de menu ou breadcrumb.

## Composição
- Combinar com SgInputText e outros campos em formularios.
- Usar dentro de SgPanel ou SgDialog para acoes contextuais.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `label` | `ReactNode` | não | Conteudo textual principal do botao. |
| `severity` | `"primary" \| "secondary" \| "success" \| "info" \| "warning" \| "help" \| "danger"` | não | Define o peso visual e semantico da acao. |
| `appearance` | `"solid" \| "outline" \| "ghost"` | não | Variante visual base do botao. |
| `type` | `"button" \| "submit" \| "reset"` | não | Comportamento HTML da acao dentro de formularios. |
| `loading` | `boolean` | não | Exibe spinner e bloqueia interacao enquanto a acao esta em progresso. |
| `disabled` | `boolean` | não | Desabilita a interacao do botao. |
| `leftIcon` | `ReactNode` | não | Icone exibido antes do label. |
| `rightIcon` | `ReactNode` | não | Icone exibido depois do label. |
| `onClick` | `MouseEventHandler<HTMLButtonElement>` | não | Callback disparado quando a acao e executada. |

## Tags
action, button, trigger, cta, submit, severity, appearance, loading, icon-support, action button, submit button
