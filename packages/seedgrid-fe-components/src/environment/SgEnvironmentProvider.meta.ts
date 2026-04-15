import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "provider.environment",
  package: "@seedgrid/fe-components",
  exportName: "SgEnvironmentProvider",
  slug: "sg-environment-provider",
  displayName: "SgEnvironmentProvider",
  category: "provider",
  subcategory: "environment",
  description:
    "Provider de ambiente para namespace, escopo e estrategia de persistencia usados pelos componentes SeedGrid.",
  tags: ["provider", "environment", "persistence", "namespace", "context"],
  capabilities: ["namespace-scoping", "persistence-strategy", "state-key-building", "local-or-api-storage"],
  fieldSemantics: ["environmentProvider", "persistenceScope", "namespaceContext"],
  props: [
    { name: "value.namespaceProvider", type: "NamespaceProvider", description: "Fornecedor do namespace atual para isolar estado e persistencia.", semanticRole: "behavior", bindable: true },
    { name: "value.persistenceStrategy", type: "PersistenceStrategy", description: "Estrategia que salva, carrega e limpa o estado persistido.", semanticRole: "behavior", bindable: true },
    { name: "value.persistence.scope", type: "string", default: "app:unknown", description: "Escopo logico usado na composicao da chave persistida.", semanticRole: "data", bindable: true },
    { name: "value.persistence.mode", type: "SgPersistenceMode", default: "fallback", description: "Modo de persistencia usado pelo ambiente.", semanticRole: "behavior", bindable: true },
    { name: "value.persistence.stateVersion", type: "number", default: 1, description: "Versao logica do estado persistido.", semanticRole: "data", bindable: true },
    { name: "children", type: "ReactNode", required: true, description: "Arvore que consome o contexto de ambiente.", semanticRole: "data", bindable: false }
  ],
  states: ["default", "namespaced", "persistent", "provider-present"],
  examples: [
    { id: "custom-namespace", title: "Namespace customizado", file: "apps/showcase/src/app/components/providers/sg-environment-provider/samples/namespace-customizado.tsx.sample", kind: "sample" },
    { id: "hybrid", title: "Persistencia hibrida", file: "apps/showcase/src/app/components/providers/sg-environment-provider/samples/hybrid-local-rest.tsx.sample", kind: "sample" }
  ],
  showcase: { route: "/components/providers/sg-environment-provider", hasPlayground: true, hasPropsTable: true },
  sdui: {
    rendererType: "provider.environment",
    acceptsDataBinding: true,
    defaultProps: { value: { persistence: { scope: "app:unknown", mode: "fallback", stateVersion: 1 } } }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Isolar persistencia por namespace, tenant ou usuario em uma subtree de componentes.",
    "Padronizar a estrategia de armazenamento usada por FABs, toolbars e outros estados locais.",
    "Compor ambientes com persistencia local, remota ou hibrida."
  ],
  avoidUseCases: [
    "Configurar apenas estilo visual; nesses casos prefira providers de tema.",
    "Internacionalizacao dos componentes; nesses casos prefira SgComponentsI18nProvider.",
    "Armazenar dados de negocio fora do fluxo de persistencia do design system."
  ],
  synonyms: ["environment provider", "persistence provider", "namespace provider", "storage context"],
  relatedEntityFields: ["namespace", "persistenceScope", "persistenceMode", "stateVersion"],
  compositionHints: [
    "Usar com hooks de persistencia e com componentes que armazenam layout ou preferencias locais.",
    "Combinar com SgComponentsI18nProvider quando for preciso persistir preferencia de locale."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0, denseLayout: 0.74 }
};
