# useSgPersistentState

Hook de alto nivel para estado persistido. Similar a useState mas sincroniza com persistencia (localStorage, API ou hibrida) com carregamento asincrono e isolamento por namespace.

## Quando usar
- Persistir estado de formulario entre sessoes.
- Salvar preferencias do usuario (tema, layout, filtros).
- Sincronizar estado local com storage com fallback para valor padrao.
- Implementar historico de acoes que sobrevive a reload.

## Quando evitar
- Estado que so existe durante a sessao; use useState.
- Dados do servidor que mudam frequentemente; use useQuery ou SWR.
- Estado muito grande que pode sobrecarregar storage; considere chunking.

## Composição
- Combinar com SgEnvironmentProvider para estrategia de persistencia customizada.
- Usar baseKey semantico como 'sidebar:collapsed' ou 'form:draft:order'.
- Implementar serialize/deserialize para tipos complexos ou versioning.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `args.baseKey` | `string` | sim | Chave base para persistencia (sera isolada por namespace e escopo). |
| `args.defaultValue` | `T` | sim | Valor padrao enquanto carrega do storage. |
| `args.serialize` | `(value: T) => unknown` | não | Funcao customizada para serializar ao persistir. |
| `args.deserialize` | `(value: unknown) => T` | não | Funcao customizada para desserializar ao carregar. |
| `returns[0]` | `T` | não | Valor atual (pode ser defaultValue durante carregamento asincrono). |
| `returns[1]` | `(value: T) => Promise<void>` | não | Funcao para atualizar estado e persistir asincronamente. |

## Tags
hook, persistent-state, storage, state-sync, state-persistence, async-init, serialization, namespace-isolation, persistent state, synced state, stored state
