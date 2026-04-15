import type { SgAiHintsV0, SgMetaV0 } from "../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "gadget.digit.segment",
  package: "@seedgrid/fe-components",
  exportName: "SgSegmentDigit",
  slug: "sg-segment-digit",
  displayName: "SgSegmentDigit",
  category: "gadget",
  subcategory: "digit",
  description:
    "Digito em estilo segmentado para relogios, paines industriais e displays numericos classicos.",
  tags: ["gadget", "digit", "segment", "clock", "industrial"],
  capabilities: ["single-character-display", "segmented-style", "clock-composition", "industrial-look"],
  fieldSemantics: ["digitDisplay", "segmentDigit", "industrialCounter", "clockDigit"],
  props: [
    { name: "value", type: "string", required: true, description: "Caractere exibido no display.", semanticRole: "value", bindable: true },
    { name: "fontSize", type: "number", default: 72, description: "Escala visual do digito.", semanticRole: "appearance", bindable: true },
    { name: "color", type: "string", description: "Cor dos segmentos ativos.", semanticRole: "appearance", bindable: true },
    { name: "backgroundColor", type: "string", description: "Cor de fundo do display.", semanticRole: "appearance", bindable: true },
    { name: "className", type: "string", description: "Classes CSS adicionais.", semanticRole: "appearance", bindable: true }
  ],
  states: ["idle"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/digits/sg-segment-digit/samples/basico.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/digits/sg-segment-digit/sg-segment-digit.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/digits/sg-segment-digit", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "gadget.digit.segment", acceptsDataBinding: true, defaultProps: { fontSize: 72 } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Relogios digitais e paineis com linguagem de segmentos.",
    "Indicadores industriais ou retro-digital.",
    "Displays de numeros com identidade tecnica."
  ],
  avoidUseCases: [
    "Campos editaveis e entrada de dados.",
    "Texto livre ou conteudo narrativo.",
    "Listagens densas de informacao."
  ],
  synonyms: ["segment digit", "segmented digit", "digital segment display"],
  relatedEntityFields: ["digit", "counter", "clock", "metric", "display"],
  compositionHints: [
    "Combinar varios SgSegmentDigit para relogios e contadores.",
    "Usar com SgClock, SgCard e dashboards tecnicos."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0.14, number: 0.72, denseLayout: 0.33 }
};
