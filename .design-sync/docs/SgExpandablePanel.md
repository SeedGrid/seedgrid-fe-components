# SgExpandablePanel

Painel expansivel inline ou overlay, com direcao, tamanho, backdrop e comportamento de foco configuraveis.

## Quando usar
- Criar drawers e paineis expansivos laterais ou superiores.
- Exibir conteudo contextual adicional sem trocar de tela.
- Layouts que pedem painel redimensionavel ou overlay controlado.

## Quando evitar
- Dialogs modais completos; nesses casos prefira SgDialog.
- Secoes simples fixas; nesses casos prefira SgPanel.
- Acoes e inputs isolados.

## Composição
- Usar com SgButton para abrir e fechar o painel.
- Combinar com SgStack e sgInput* para formularios laterais.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `children` | `ReactNode` | sim | Conteudo principal do painel. |
| `open` | `boolean` | não | Controla a abertura do painel. |
| `onOpenChange` | `(open: boolean) => void` | não | Callback disparado ao abrir ou fechar o painel. |
| `expandTo` | `"left" \| "right" \| "top" \| "bottom"` | sim | Direcao para a qual o painel se expande. |
| `mode` | `"inline" \| "overlay"` | não | Modo de renderizacao do painel. |
| `size` | `SgExpandablePanelSize` | não | Configuracao de tamanho minimo, maximo e padrao. |
| `resizable` | `boolean` | não | Permite redimensionar o painel. |

## Tags
layout, panel, expandable, drawer, overlay, inline-overlay, directional-expansion, resizable, backdrop, focus-trap, expandable panel, sliding panel, side panel
