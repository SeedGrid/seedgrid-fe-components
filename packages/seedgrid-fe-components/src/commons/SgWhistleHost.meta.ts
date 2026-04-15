import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "feedback.whistle-host",
  package: "@seedgrid/fe-components",
  exportName: "SgWhistleHost",
  slug: "sg-whistle-host",
  displayName: "SgWhistleHost",
  category: "feedback",
  subcategory: "whistle-host",
  description:
    "Host de avisos persistentes ou semi-persistentes em pilha, com cores por severidade, acao opcional e controle de maximo visivel.",
  tags: ["feedback", "alerts", "host", "inline-notifications"],
  capabilities: ["alert-stacking", "severity-colors", "dismissible-items", "timed-dismiss"],
  fieldSemantics: ["alertHost", "persistentFeedback", "stackedAlerts"],
  props: [
    { name: "max", type: "number", default: 4, description: "Quantidade maxima de whistle items visiveis.", semanticRole: "behavior", bindable: true },
    { name: "newestOnTop", type: "boolean", default: false, description: "Inverte a ordem visual para mostrar os mais novos primeiro.", semanticRole: "behavior", bindable: true },
    { name: "gap", type: "number", default: 12, description: "Espacamento entre os avisos renderizados.", semanticRole: "appearance", bindable: true }
  ],
  states: ["idle", "showing-alerts"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/sg-whistle-host/samples/basico.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/sg-whistle-host/sg-whistle-host.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/sg-whistle-host", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "feedback.whistle-host", acceptsDataBinding: false, defaultProps: { max: 4, newestOnTop: false } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Exibir avisos empilhados mais persistentes do que um toast.",
    "Comunicar erros, warnings e mensagens operacionais inline em uma area fixa.",
    "Agrupar alertas com acao e dismiss local."
  ],
  avoidUseCases: [
    "Feedback ultraleve e efemero; nesses casos prefira toaster.",
    "Modais de confirmacao.",
    "Indicadores compactos como badge."
  ],
  synonyms: ["alert host", "message stack", "persistent notifications"],
  relatedEntityFields: ["alerts", "warnings", "inlineMessages", "systemMessages"],
  compositionHints: [
    "Usar com a API `sgWhistle` para publicar avisos.",
    "Combinar com SgCard ou SgPanel em dashboards operacionais."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0, denseLayout: 0.7 }
};
