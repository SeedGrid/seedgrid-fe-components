import type { SgAiHintsV0, SgMetaV0 } from "../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "gadget.digit.fade",
  package: "@seedgrid/fe-components",
  exportName: "SgFadeDigit",
  slug: "sg-fade-digit",
  displayName: "SgFadeDigit",
  category: "gadget",
  subcategory: "digit",
  description:
    "Digito animado com transicao de fade para exibicao de numeros e caracteres em relogios e contadores luminosos.",
  tags: ["gadget", "digit", "fade", "clock", "counter"],
  capabilities: ["single-character-display", "fade-animation", "clock-composition", "custom-colors"],
  fieldSemantics: ["digitDisplay", "clockDigit", "animatedCharacter", "luminousCounter"],
  props: [
    { name: "value", type: "string", required: true, description: "Caractere exibido no card.", semanticRole: "value", bindable: true },
    { name: "fontSize", type: "number", default: 72, description: "Escala visual do digito.", semanticRole: "appearance", bindable: true },
    { name: "color", type: "string", description: "Cor do caractere exibido.", semanticRole: "appearance", bindable: true },
    { name: "backgroundColor", type: "string", description: "Cor de fundo do card.", semanticRole: "appearance", bindable: true },
    { name: "className", type: "string", description: "Classes CSS adicionais.", semanticRole: "appearance", bindable: true }
  ],
  states: ["idle", "animating"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/digits/sg-fade-digit/samples/basico.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/digits/sg-fade-digit/sg-fade-digit.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/digits/sg-fade-digit", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "gadget.digit.fade", acceptsDataBinding: true, defaultProps: { fontSize: 72 } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Relogios e contadores com visual suave de transicao.",
    "Exibicao de digitos com identidade luminosa ou neon.",
    "Widgets numericos que exigem mudanca visual discreta."
  ],
  avoidUseCases: [
    "Captura de valor pelo usuario.",
    "Texto longo ou blocos informativos.",
    "Tabelas de dados com muitas celulas."
  ],
  synonyms: ["fade digit", "animated digit", "nixie-style digit"],
  relatedEntityFields: ["digit", "counter", "clock", "time", "score"],
  compositionHints: [
    "Combinar varios SgFadeDigit para relogios e contadores.",
    "Usar com SgClock, SgPanel e paineis de status."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0.15, number: 0.68, denseLayout: 0.34 }
};
