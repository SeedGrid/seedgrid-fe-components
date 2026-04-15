import type { SgAiHintsV0, SgMetaV0 } from "../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "gadget.digit.discard",
  package: "@seedgrid/fe-components",
  exportName: "SgDiscardDigit",
  slug: "sg-discard-digit",
  displayName: "SgDiscardDigit",
  category: "gadget",
  subcategory: "digit",
  description:
    "Digito animado com transicao de descarte para representar mudanca de valores em displays compactos.",
  tags: ["gadget", "digit", "discard", "display", "counter"],
  capabilities: ["single-character-display", "discard-animation", "counter-composition", "custom-colors"],
  fieldSemantics: ["digitDisplay", "counterDigit", "animatedCharacter", "transitionalMetric"],
  props: [
    { name: "value", type: "string", required: true, description: "Caractere exibido no display.", semanticRole: "value", bindable: true },
    { name: "fontSize", type: "number", default: 72, description: "Escala visual do digito.", semanticRole: "appearance", bindable: true },
    { name: "color", type: "string", description: "Cor do caractere.", semanticRole: "appearance", bindable: true },
    { name: "backgroundColor", type: "string", description: "Cor do fundo do card.", semanticRole: "appearance", bindable: true },
    { name: "className", type: "string", description: "Classes CSS adicionais.", semanticRole: "appearance", bindable: true }
  ],
  states: ["idle", "animating"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/digits/sg-discard-digit/samples/basico.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/digits/sg-discard-digit/sg-discard-digit.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/digits/sg-discard-digit", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "gadget.digit.discard", acceptsDataBinding: true, defaultProps: { fontSize: 72 } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Displays de contagem com transicao visual mais expressiva.",
    "Indicadores numericos compactos em dashboards.",
    "Widgets que priorizam efeito de troca entre caracteres."
  ],
  avoidUseCases: [
    "Entrada de dados do usuario.",
    "Texto longo e leitura continua.",
    "Tabelas e grids com muitas celulas."
  ],
  synonyms: ["discard digit", "animated digit", "counter digit"],
  relatedEntityFields: ["digit", "counter", "score", "metric", "display"],
  compositionHints: [
    "Combinar varios SgDiscardDigit para relogios e contadores.",
    "Usar com SgCard, SgPanel e widgets de destaque."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0.06, number: 0.66, denseLayout: 0.31 }
};
