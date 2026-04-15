import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "provider.components-i18n",
  package: "@seedgrid/fe-components",
  exportName: "SgComponentsI18nProvider",
  slug: "sg-components-i18n-provider",
  displayName: "SgComponentsI18nProvider",
  category: "provider",
  subcategory: "i18n",
  description:
    "Provider de internacionalizacao para os componentes SeedGrid, com locale, mensagens embutidas e sobrescrita pontual por subtree.",
  tags: ["provider", "i18n", "locale", "messages", "context"],
  capabilities: ["locale-scoping", "message-overrides", "built-in-locales", "runtime-i18n-context"],
  fieldSemantics: ["i18nProvider", "localeScope", "messageOverrides"],
  props: [
    { name: "locale", type: "SgComponentsLocale", default: "en-US", description: "Locale aplicado aos componentes dentro do provider.", semanticRole: "behavior", bindable: true },
    { name: "messages", type: "SgComponentsMessages | SgComponentsMessagesByNamespace", description: "Mapa de mensagens customizadas ou sobrescritas.", semanticRole: "data", bindable: true },
    { name: "children", type: "ReactNode", required: true, description: "Arvore de componentes que consome o contexto de i18n.", semanticRole: "data", bindable: false }
  ],
  states: ["default", "locale-bound", "message-overridden"],
  examples: [
    { id: "basic", title: "Uso basico", file: "apps/showcase/src/app/components/providers/sg-components-i18n-provider/samples/uso-basico.tsx.sample", kind: "sample" },
    { id: "dynamic", title: "Troca dinamica de locale", file: "apps/showcase/src/app/components/providers/sg-components-i18n-provider/samples/troca-dinamica-de-locale.tsx.sample", kind: "sample" }
  ],
  showcase: { route: "/components/providers/sg-components-i18n-provider", hasPlayground: false, hasPropsTable: true },
  sdui: {
    rendererType: "provider.components-i18n",
    acceptsDataBinding: true,
    defaultProps: { locale: "en-US", messages: {} }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Trocar locale e mensagens internas dos componentes em um subtree controlado.",
    "Sobrescrever textos padrao sem alterar a implementacao dos componentes.",
    "Compor demos, shells ou modulos com locale diferente do restante da aplicacao."
  ],
  avoidUseCases: [
    "Traducao de conteudo de negocio externo aos componentes SeedGrid.",
    "Selecao visual de idioma pelo usuario sem provider; nesses casos use UI propria combinada com este provider.",
    "Persistencia de preferencias do usuario; nesses casos combine com ambiente ou storage."
  ],
  synonyms: ["components i18n provider", "locale provider", "messages provider", "translation context"],
  relatedEntityFields: ["locale", "messages", "translations", "i18nConfig"],
  compositionHints: [
    "Usar com hooks como useComponentsI18n e com componentes que exibem mensagens internas.",
    "Combinar com SgEnvironmentProvider quando locale e preferencias precisarem de persistencia."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0, denseLayout: 0.68 }
};
