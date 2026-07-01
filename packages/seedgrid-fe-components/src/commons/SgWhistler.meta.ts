import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "feedback.whistler",
  package: "@seedgrid/fe-components",
  exportName: "SgWhistler",
  slug: "sg-whistler",
  displayName: "SgWhistler",
  category: "feedback",
  subcategory: "whistler",
  description:
    "Renderizador de avisos persistentes ou semi-persistentes em pilha, com cores por severidade, acao opcional e controle de maximo visivel. Cede a vez quando um SgWhistleHost esta presente.",
  tags: ["feedback", "alerts", "renderer", "inline-notifications"],
  capabilities: ["alert-stacking", "severity-colors", "dismissible-items", "timed-dismiss"],
  fieldSemantics: ["alertRenderer", "persistentFeedback", "stackedAlerts"],
  props: [
    { name: "max", type: "number", default: 4, description: "Quantidade maxima de whistle items visiveis.", semanticRole: "behavior", bindable: true },
    { name: "newestOnTop", type: "boolean", default: false, description: "Inverte a ordem visual para mostrar os mais novos primeiro.", semanticRole: "behavior", bindable: true },
    { name: "gap", type: "number", default: 12, description: "Espacamento entre os avisos renderizados.", semanticRole: "appearance", bindable: true },
    { name: "rounded", type: "boolean", default: true, description: "Arredonda os cantos de cada whistle (desligue para cantos retos).", semanticRole: "appearance", bindable: true }
  ],
  states: ["idle", "showing-alerts"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/sg-whistler/samples/base-setup.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/sg-whistler/sg-whistler.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/sg-whistler", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "feedback.whistler", acceptsDataBinding: false, defaultProps: { max: 4, newestOnTop: false, rounded: true } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Exibir avisos empilhados mais persistentes do que um toast em uma area fixa.",
    "Comunicar erros, warnings e mensagens operacionais inline.",
    "Agrupar alertas com acao e dismiss local, sem precisar de multiplos pontos de montagem."
  ],
  avoidUseCases: [
    "Precisar de varios pontos de montagem coexistindo; nesses casos use SgWhistleHost.",
    "Feedback ultraleve e efemero; prefira toaster.",
    "Modais de confirmacao."
  ],
  synonyms: ["alert renderer", "message stack", "persistent notifications"],
  relatedEntityFields: ["alerts", "warnings", "inlineMessages", "systemMessages"],
  compositionHints: [
    "Usar com a API `sgWhistle` para publicar avisos.",
    "Para varios locais de exibicao no layout, prefira SgWhistleHost (host com registry)."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0, denseLayout: 0.7 }
};
