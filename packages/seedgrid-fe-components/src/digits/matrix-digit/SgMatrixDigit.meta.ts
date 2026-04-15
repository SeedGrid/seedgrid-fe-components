import type { SgAiHintsV0, SgMetaV0 } from "../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "gadget.digit.matrix",
  package: "@seedgrid/fe-components",
  exportName: "SgMatrixDigit",
  slug: "sg-matrix-digit",
  displayName: "SgMatrixDigit",
  category: "gadget",
  subcategory: "digit",
  description:
    "Digito em estilo matriz para displays compactos de numeros e caracteres com estetica de painel digital.",
  tags: ["gadget", "digit", "matrix", "display", "counter"],
  capabilities: ["single-character-display", "matrix-style", "counter-composition", "pixel-look"],
  fieldSemantics: ["digitDisplay", "matrixDigit", "counterDigit", "panelDigit"],
  props: [
    { name: "value", type: "string", required: true, description: "Caractere exibido na matriz.", semanticRole: "value", bindable: true },
    { name: "fontSize", type: "number", default: 72, description: "Escala visual do display.", semanticRole: "appearance", bindable: true },
    { name: "color", type: "string", description: "Cor principal do digito.", semanticRole: "appearance", bindable: true },
    { name: "backgroundColor", type: "string", description: "Cor do fundo do display.", semanticRole: "appearance", bindable: true },
    { name: "className", type: "string", description: "Classes CSS adicionais.", semanticRole: "appearance", bindable: true }
  ],
  states: ["idle", "animating"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/digits/sg-matrix-digit/samples/basico.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/digits/sg-matrix-digit/sg-matrix-digit.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/digits/sg-matrix-digit", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "gadget.digit.matrix", acceptsDataBinding: true, defaultProps: { fontSize: 72 } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Displays com estetica de painel digital ou matriz.",
    "Contadores compactos em dashboards tecnicos.",
    "Indicadores visuais que precisam de identidade pixelada."
  ],
  avoidUseCases: [
    "Texto longo ou conteudo editorial.",
    "Entrada de dados pelo usuario.",
    "Formularios e controles de selecao."
  ],
  synonyms: ["matrix digit", "dot matrix digit", "panel digit"],
  relatedEntityFields: ["digit", "counter", "metric", "score", "display"],
  compositionHints: [
    "Combinar varios SgMatrixDigit em paines de contagem.",
    "Usar com SgCard, SgDashboard e widgets numericos."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0.08, number: 0.7, denseLayout: 0.35 }
};
