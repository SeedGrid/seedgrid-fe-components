# SgClock

Relogio analogico ou digital com multiplos estilos visuais, timezone, formato 12h/24h e temas.

## Quando usar
- Exibir hora atual em dashboards, paredes operacionais e gadgets de status.
- Mostrar timezones diferentes em paineis internacionais ou de suporte.
- Criar widgets visuais com estilos digitais ou analogicos customizados.

## Quando evitar
- Entrada de hora pelo usuario; nesses casos use componente de input apropriado.
- Calendarios mensais e selecao de datas; nesses casos prefira SgCalendar ou SgInputDate.
- Numeros ou KPIs sem semantica temporal.

## Composição
- Usar com SgClockThemeProvider e SgClockThemePicker para temas visuais.
- Combinar com Card, Dashboard e outros gadgets em paineis operacionais.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `clockStyle` | `"digital" \| "analog"` | não | Modo principal de exibicao do relogio. |
| `digitalStyle` | `"default" \| "segment" \| "sevenSegment" \| "roller3d" \| "flip" \| "fade" \| "matrix" \| "neon" \| "discard"` | não | Estilo visual do relogio digital. |
| `timezone` | `string` | não | Timezone usada no calculo da hora exibida. |
| `format` | `"12h" \| "24h"` | não | Formato horario do relogio. |
| `showSeconds` | `boolean` | não | Exibe ou oculta os segundos. |
| `themeId` | `string` | não | Tema visual aplicado ao relogio. |
| `size` | `"sm" \| "md" \| "lg" \| number` | não | Escala visual do relogio. |

## Tags
gadget, clock, time, timezone, digital, analog, analog-clock, digital-clock, themes, format-12h-24h, card-wrapper, time widget, digital clock, analog clock, timezone clock
