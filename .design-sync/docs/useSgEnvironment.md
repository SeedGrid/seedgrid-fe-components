# useSgEnvironment

Hook para acessar configuracao de ambiente (namespace, estrategia de persistencia, modo e escopo). Retorna o contexto completo do SgEnvironmentProvider.

## Quando usar
- Acessar namespace e escopo de persistencia dentro de uma subtree.
- Validar que SgEnvironmentProvider esta presente.
- Implementar persistencia customizada em cima da estrategia configurada.

## Quando evitar
- Usar para dados de aplicacao; use useSgPersistence ou useSgPersistentState.
- Mudar configuracao de ambiente em tempo de execucao; provider e imutavel.

## Composição
- Envolver a arvore com SgEnvironmentProvider antes de usar.
- Usar com useSgPersistence e useSgPersistentState para persistencia.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `returns.namespaceProvider` | `NamespaceProvider` | não | Provedor que fornece namespace/tenant atual. |
| `returns.persistenceStrategy` | `PersistenceStrategy` | não | Estrategia que carrega, salva e limpa estado persistido. |
| `returns.persistence.scope` | `string` | não | Escopo logico para chaves persistidas (ex: 'app:myapp'). |
| `returns.persistence.mode` | `SgPersistenceMode` | não | Modo de persistencia (local, api, fallback). |
| `returns.persistence.stateVersion` | `number` | não | Versao logica do estado persistido para migracao. |

## Tags
hook, environment, persistence, namespace, namespace-access, persistence-config, environment-context, environment context, environment hook, persistence context
