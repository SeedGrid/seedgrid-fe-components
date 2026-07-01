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
    "Marca o local onde os whistles aparecem. Suporta varios hosts simultaneos (ex.: topo e rodape) via registry: apenas o ultimo montado fica ativo, e o SgWhistler solto cede a vez quando qualquer host esta presente.",
  tags: ["feedback", "alerts", "host", "inline-notifications", "registry"],
  capabilities: ["alert-stacking", "severity-colors", "dismissible-items", "timed-dismiss", "multi-host-registry"],
  fieldSemantics: ["alertHost", "persistentFeedback", "stackedAlerts"],
  props: [
    { name: "max", type: "number", default: 4, description: "Quantidade maxima de whistle items visiveis neste host.", semanticRole: "behavior", bindable: true },
    { name: "newestOnTop", type: "boolean", default: false, description: "Inverte a ordem visual para mostrar os mais novos primeiro.", semanticRole: "behavior", bindable: true },
    { name: "gap", type: "number", default: 12, description: "Espacamento entre os avisos renderizados.", semanticRole: "appearance", bindable: true },
    { name: "rounded", type: "boolean", default: true, description: "Arredonda os cantos de cada whistle (desligue para cantos retos).", semanticRole: "appearance", bindable: true }
  ],
  states: ["idle", "showing-alerts", "inactive"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/sg-whistle-host/samples/base-setup.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/sg-whistle-host/sg-whistle-host.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/sg-whistle-host", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "feedback.whistle-host", acceptsDataBinding: false, defaultProps: { max: 4, newestOnTop: false, rounded: true } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Definir um ou mais pontos fixos onde os avisos empilhados devem aparecer.",
    "Layouts com hosts em zonas diferentes (ex.: um no topo e outro embaixo), com prioridade automatica ao ultimo montado.",
    "Comunicar erros, warnings e mensagens operacionais inline em area fixa."
  ],
  avoidUseCases: [
    "Um unico ponto de exibicao sem necessidade de registry; ai o SgWhistler basta.",
    "Feedback ultraleve e efemero; prefira toaster.",
    "Modais de confirmacao."
  ],
  synonyms: ["alert host", "message stack host", "persistent notifications host"],
  relatedEntityFields: ["alerts", "warnings", "inlineMessages", "systemMessages"],
  compositionHints: [
    "Usar com a API `sgWhistle` para publicar avisos.",
    "Espelha o par SgToaster/SgToastHost: SgWhistler e o renderizador, SgWhistleHost e o host com registry.",
    "Combinar com SgCard ou SgPanel em dashboards operacionais."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0, denseLayout: 0.7 }
};
