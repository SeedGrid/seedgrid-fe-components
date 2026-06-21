# useSgTime

Hook para acessar contexto de sincronizacao de tempo com servidor. Fornece timestamp atual e tick para atualizacoes periodicas.

## Quando usar
- Sincronizar relogios e contadores com o servidor.
- Animar displays de tempo ou contagens regressivas com atualizacoes de tick.
- Garantir que componentes vizuais permanecam alinhados apos SSR.

## Quando evitar
- Usar para polling rapido de dados; use callbacks ou react-query.
- Armazenar estado derivado de time; use useMemo ou useCallback.

## Composição
- Envolver a arvore com SgTimeProvider antes de usar este hook.
- Usar com SgClock ou outros gadgets de exibicao de tempo.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `returns.serverStartMs` | `number` | não | Timestamp do servidor em milissegundos quando o provider foi montado. |
| `returns.perfStartMs` | `number` | não | Marca de performance.now() quando o provider hidratou. |
| `returns.tick` | `number` | não | Contador que incrementa a cada segundo, dispara atualizacoes. |
| `returns.nowMs` | `() => number` | não | Funcao que retorna o timestamp atual sincronizado com servidor. |

## Tags
hook, time, sync, context, server-time-sync, tick-updates, fallback-local-time, time context, time sync, server time, ticker
