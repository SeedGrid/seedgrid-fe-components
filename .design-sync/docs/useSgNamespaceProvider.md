# useSgNamespaceProvider

Hook para acessar o NamespaceProvider configurado. Permite obter o namespace/tenant atual para isolamento de estado e chaves de persistencia.

## Quando usar
- Isolar estado e chaves de persistencia por namespace/tenant.
- Construir chaves de storage que respeitam namespace.
- Implementar multi-tenancy em componentes customizados.

## Quando evitar
- Usar para dados de negocio; use useSgEnvironment em vez disso.
- Assumir um namespace vazio; sempre validar a resposta.

## Composição
- Envolver a arvore com SgEnvironmentProvider com um NamespaceProvider customizado.
- Usar com useSgPersistence para construir chaves isoladas.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `returns.getNamespace` | `() => string` | não | Funcao que retorna o namespace/tenant atual. |

## Tags
hook, namespace, tenant, isolation, namespace-access, tenant-isolation, state-key-building, namespace context, tenant provider, isolation scope
