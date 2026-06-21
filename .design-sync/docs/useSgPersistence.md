# useSgPersistence

Hook de baixo nivel para carregar, salvar e limpar estado persistido. Gerencia chaves isoladas por namespace e escopo, respeitando a estrategia configurada.

## Quando usar
- Carregar estado persistido de componentes customizados no init.
- Salvar layout, preferencias ou estado do usuario.
- Implementar cache persistente com isolamento por namespace.

## Quando evitar
- Estado simples e sem persistencia; use useState.
- Dados de negocio que vem do servidor; use useQuery ou hooks de data-fetching.

## Composição
- Envolver a arvore com SgEnvironmentProvider para estrategia customizada.
- Usar com try-catch para tratar erros de persistencia.
- Preferir useSgPersistentState para casos simples de estado persistido.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `returns.namespace` | `string` | não | Namespace/tenant atual. |
| `returns.scope` | `string` | não | Escopo logico para chaves (ex: 'app:myapp'). |
| `returns.mode` | `SgPersistenceMode` | não | Modo de persistencia (local, api, fallback). |
| `returns.stateVersion` | `number` | não | Versao logica do estado para migracao. |
| `returns.load` | `(baseKey: string) => Promise<unknown>` | não | Carregar valor persistido da chave (isolada por namespace e escopo). |
| `returns.save` | `(baseKey: string, state: unknown) => Promise<void>` | não | Salvar valor persistido na chave (isolada por namespace e escopo). |
| `returns.clear` | `(baseKey: string) => Promise<void>` | não | Limpar valor persistido da chave. |

## Tags
hook, persistence, storage, state-management, load-state, save-state, clear-state, namespace-isolation, persistence hook, state storage, persistence layer
