# SgEnvironmentProvider

Provider de ambiente para namespace, escopo e estrategia de persistencia usados pelos componentes SeedGrid.

## Quando usar
- Isolar persistencia por namespace, tenant ou usuario em uma subtree de componentes.
- Padronizar a estrategia de armazenamento usada por FABs, toolbars e outros estados locais.
- Compor ambientes com persistencia local, remota ou hibrida.

## Quando evitar
- Configurar apenas estilo visual; nesses casos prefira providers de tema.
- Internacionalizacao dos componentes; nesses casos prefira SgComponentsI18nProvider.
- Armazenar dados de negocio fora do fluxo de persistencia do design system.

## Composição
- Usar com hooks de persistencia e com componentes que armazenam layout ou preferencias locais.
- Combinar com SgComponentsI18nProvider quando for preciso persistir preferencia de locale.

## Props principais
| Prop | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `value.namespaceProvider` | `NamespaceProvider` | não | Fornecedor do namespace atual para isolar estado e persistencia. |
| `value.persistenceStrategy` | `PersistenceStrategy` | não | Estrategia que salva, carrega e limpa o estado persistido. |
| `value.persistence.scope` | `string` | não | Escopo logico usado na composicao da chave persistida. |
| `value.persistence.mode` | `SgPersistenceMode` | não | Modo de persistencia usado pelo ambiente. |
| `value.persistence.stateVersion` | `number` | não | Versao logica do estado persistido. |
| `children` | `ReactNode` | sim | Arvore que consome o contexto de ambiente. |

## Tags
provider, environment, persistence, namespace, context, namespace-scoping, persistence-strategy, state-key-building, local-or-api-storage, environment provider, persistence provider, namespace provider, storage context
