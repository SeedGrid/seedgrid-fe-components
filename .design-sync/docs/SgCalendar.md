# SgCalendar

Calendario mensal em formato de gadget com suporte a locale, multi-mes, regras de selecao e card configuravel.

## Quando usar
- Exibir ou selecionar datas em um calendario mensal visivel.
- Montar gadgets de agenda, planeamento e navegacao temporal.
- Visualizar varios meses com regras de disponibilidade e locale configuravel.

## Quando evitar
- Campos compactos de data em formularios; nesses casos prefira SgInputDate.
- Listas ou tabelas de eventos detalhados.
- Numeros, moeda ou texto livre.

## Composição
- Usar com Card e Button em gadgets de agenda e dashboards.
- Combinar com InputDate e dialogs quando houver selecao detalhada.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `value` | `Date \| string` | não | Data selecionada de forma controlada. |
| `viewDate` | `Date \| string` | não | Mes visivel de forma controlada. |
| `locale` | `string` | não | Locale usado para formatacao de mes e dias. |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | não | Primeiro dia da semana. |
| `numberOfMonths` | `number` | não | Quantidade de meses visiveis ao mesmo tempo. |
| `minDate` | `Date \| string` | não | Limite minimo de selecao. |
| `maxDate` | `Date \| string` | não | Limite maximo de selecao. |
| `onValueChange` | `(date: Date) => void` | não | Callback disparado ao selecionar uma data. |

## Tags
gadget, calendar, date, schedule, multi-month, calendar-grid, date-selection, locale, date-rules, card-wrapper, month calendar, date gadget, schedule calendar
