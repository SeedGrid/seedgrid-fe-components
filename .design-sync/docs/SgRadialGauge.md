# SgRadialGauge

Gauge radial com ponteiros, faixas, anotacoes e controle de angulos para cenarios de speedometer, dial e medicao circular.

## Quando usar
- Representar medicao circular em speedometers, paines de telemetria e dashboards.
- Exibir indicadores de performance com foco em dial, arco e ponteiros visuais.
- Combinar anotacoes e faixas de alerta em instrumentos circulares.

## Quando evitar
- Indicadores lineares simples; nesses casos prefira SgLinearGauge.
- Entrada numerica direta por teclado; nesses casos prefira SgInputNumber.
- Graficos analiticos com series temporais; nesses casos prefira charting dedicado.

## Composição
- Usar com Card, Screen e dashboards para indicadores de alto impacto visual.
- Combinar com annotations e centerContent para KPIs operacionais.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `min` | `number` | não | Valor minimo da escala. |
| `max` | `number` | não | Valor maximo da escala. |
| `value` | `number` | não | Valor do ponteiro principal. |
| `onValueChange` | `(value: number) => void` | não | Callback do ponteiro principal. |
| `pointers` | `SgRadialGaugePointer[]` | não | Ponteiros adicionais do tipo needle, marker ou range. |
| `ranges` | `SgRadialGaugeRange[]` | não | Faixas coloridas sobre o arco principal. |
| `annotations` | `SgRadialGaugeAnnotation[]` | não | Anotacoes posicionadas por valor ou angulo. |
| `startAngle` | `number` | não | Angulo inicial do arco. |
| `endAngle` | `number` | não | Angulo final do arco. |
| `primaryPointerType` | `"needle" \| "marker" \| "range"` | não | Tipo visual do ponteiro principal. |

## Tags
gadget, gauge, radial, dial, speedometer, radial-meter, needle-marker-range-pointers, annotations, arc-configuration, drag-support, radial gauge, dial gauge, circular meter
