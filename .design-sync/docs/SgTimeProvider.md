# SgTimeProvider

Provider de tempo sincronizado com o servidor, usado para clocks e gadgets temporais com atualizacao em tick controlado.

## Quando usar
- Sincronizar clocks e gadgets com o tempo do servidor em interfaces reativas.
- Evitar drift entre SSR e cliente em exibicoes de tempo vivo.
- Fornecer contexto temporal compartilhado para subtrees com relogios ou widgets sincronizados.

## Quando evitar
- Selecao de data ou hora pelo usuario; nesses casos prefira inputs temporais.
- Formatacao isolada de datas sem necessidade de contexto compartilhado.
- Persistencia ou configuracao de ambiente sem relacao com tempo.

## Composição
- Usar com SgClock e outros gadgets temporais que dependem de nowMs.
- Combinar com SgClockThemeProvider em showcases ou dashboards de tempo.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `initialServerTime` | `string` | sim | Timestamp inicial do servidor em formato ISO 8601. |
| `children` | `ReactNode` | sim | Arvore que vai consumir tempo sincronizado via useSgTime. |

## Tags
provider, time, clock, server-sync, context, server-time-sync, tick-context, nowMs-provider, hydration-aligned-updates, time provider, server time context, clock time provider, synced time provider
