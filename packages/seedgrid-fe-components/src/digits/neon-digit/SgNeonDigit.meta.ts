import type { SgAiHintsV0, SgMetaV0 } from "../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "gadget.digit.neon",
  package: "@seedgrid/fe-components",
  exportName: "SgNeonDigit",
  slug: "sg-neon-digit",
  displayName: "SgNeonDigit",
  category: "gadget",
  subcategory: "digit",
  description:
    "Digito com visual neon para relogios, contadores e displays que exigem alto contraste e identidade luminosa.",
  tags: ["gadget", "digit", "neon", "display", "counter"],
  capabilities: ["single-character-display", "neon-style", "counter-composition", "high-contrast-visual"],
  fieldSemantics: ["digitDisplay", "neonDigit", "counterDigit", "highlightMetric"],
  props: [
    { name: "value", type: "string", required: true, description: "Caractere exibido no display.", semanticRole: "value", bindable: true },
    { name: "fontSize", type: "number", default: 72, description: "Escala visual do digito.", semanticRole: "appearance", bindable: true },
    { name: "color", type: "string", description: "Cor luminosa principal.", semanticRole: "appearance", bindable: true },
    { name: "backgroundColor", type: "string", description: "Cor de fundo do display.", semanticRole: "appearance", bindable: true },
    { name: "className", type: "string", description: "Classes CSS adicionais.", semanticRole: "appearance", bindable: true }
  ],
  states: ["idle", "animating"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/digits/sg-neon-digit/samples/basico.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/digits/sg-neon-digit/sg-neon-digit.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/digits/sg-neon-digit", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "gadget.digit.neon", acceptsDataBinding: true, defaultProps: { fontSize: 72 } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Destacar numeros em paineis e dashboards com visual neon.",
    "Relogios ou contadores com estilo chamativo.",
    "Indicadores visuais de alto contraste."
  ],
  avoidUseCases: [
    "Formularios ou captura de dados.",
    "Texto longo de leitura continua.",
    "Listas densas de informacao operacional."
  ],
  synonyms: ["neon digit", "glow digit", "highlight digit"],
  relatedEntityFields: ["digit", "counter", "score", "metric", "highlight"],
  compositionHints: [
    "Combinar varios SgNeonDigit em displays compostos.",
    "Usar com SgCard, SgDashboard e areas de destaque visual."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0.08, number: 0.68, denseLayout: 0.3 }
};
