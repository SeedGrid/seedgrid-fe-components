# SgLinearGauge

Gauge linear para exibicao de medicao, faixas de valor, ponteiros adicionais e ajuste arrastavel em eixos horizontal ou vertical.

## Quando usar
- Exibir medicao continua em eixo linear com faixas de referencia.
- Representar progresso, temperatura, estoque ou nivel em dashboards operacionais.
- Permitir ajuste arrastavel quando o gauge tambem atua como controle visual.

## Quando evitar
- Entrada numerica textual simples; nesses casos prefira SgInputNumber.
- Comparacao tabular de muitos registros; nesses casos prefira Datatable.
- Visual circular ou speedometer; nesses casos prefira SgRadialGauge.

## Composição
- Usar com Card, Dashboard e paines operacionais para indicadores de status.
- Combinar com Button ou sliders auxiliares em demos interativas.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `min` | `number` | não | Valor minimo da escala. |
| `max` | `number` | não | Valor maximo da escala. |
| `value` | `number` | não | Valor do ponteiro principal. |
| `onValueChange` | `(value: number) => void` | não | Callback do ponteiro principal. |
| `pointers` | `SgLinearGaugePointer[]` | não | Ponteiros adicionais renderizados sobre o eixo. |
| `ranges` | `SgLinearGaugeRange[]` | não | Faixas coloridas aplicadas sobre a escala. |
| `orientation` | `"horizontal" \| "vertical"` | não | Orientacao do gauge. |
| `showLabels` | `boolean` | não | Exibe rotulos da escala. |
| `showTicks` | `boolean` | não | Exibe ticks da escala. |
| `primaryPointerDraggable` | `boolean` | não | Permite arrastar o ponteiro principal. |

## Tags
gadget, gauge, linear, meter, measurement, linear-meter, range-highlights, draggable-pointers, horizontal-vertical, tick-label-control, linear gauge, linear meter, level indicator, measurement bar
