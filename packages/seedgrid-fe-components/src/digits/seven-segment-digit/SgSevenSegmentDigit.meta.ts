import type { SgAiHintsV0, SgMetaV0 } from "../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "gadget.digit.seven-segment",
  package: "@seedgrid/fe-components",
  exportName: "SgSevenSegmentDigit",
  slug: "sg-seven-segment-digit",
  displayName: "SgSevenSegmentDigit",
  category: "gadget",
  subcategory: "digit",
  description:
    "Digito de sete segmentos para displays classicos de relogio, paineis eletronicos e contadores numericos.",
  tags: ["gadget", "digit", "seven-segment", "clock", "counter"],
  capabilities: ["single-character-display", "seven-segment-style", "clock-composition", "retro-digital"],
  fieldSemantics: ["digitDisplay", "sevenSegmentDigit", "clockDigit", "numericPanel"],
  props: [
    { name: "value", type: "string", required: true, description: "Caractere exibido no display.", semanticRole: "value", bindable: true },
    { name: "fontSize", type: "number", default: 72, description: "Escala visual do digito.", semanticRole: "appearance", bindable: true },
    { name: "color", type: "string", description: "Cor dos segmentos ativos.", semanticRole: "appearance", bindable: true },
    { name: "backgroundColor", type: "string", description: "Cor do fundo do display.", semanticRole: "appearance", bindable: true },
    { name: "className", type: "string", description: "Classes CSS adicionais.", semanticRole: "appearance", bindable: true }
  ],
  states: ["idle"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/digits/sg-seven-segment-digit/samples/basico.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/digits/sg-seven-segment-digit/sg-seven-segment-digit.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/digits/sg-seven-segment-digit", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "gadget.digit.seven-segment", acceptsDataBinding: true, defaultProps: { fontSize: 72 } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Relogios digitais classicos e displays numericos retro.",
    "Paineis eletronicos com representacao numerica compacta.",
    "KPIs com estetica de sete segmentos."
  ],
  avoidUseCases: [
    "Entrada de dados pelo usuario.",
    "Conteudo textual longo.",
    "Interfaces de lista ou tabela densas."
  ],
  synonyms: ["seven segment digit", "7 segment display", "digital clock digit"],
  relatedEntityFields: ["digit", "counter", "clock", "metric", "time"],
  compositionHints: [
    "Combinar varios SgSevenSegmentDigit em relogios e contadores.",
    "Usar com SgClock, SgScreen e paineis operacionais."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0.16, number: 0.74, denseLayout: 0.33 }
};
