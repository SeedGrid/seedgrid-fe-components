import type { SgAiHintsV0, SgMetaV0 } from "../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "gadget.digit.roller3d",
  package: "@seedgrid/fe-components",
  exportName: "SgRoller3DDigit",
  slug: "sg-roller3d-digit",
  displayName: "SgRoller3DDigit",
  category: "gadget",
  subcategory: "digit",
  description:
    "Digito animado com efeito roller 3D para mostrar caracteres unicos em relogios, marcadores e displays visuais.",
  tags: ["gadget", "digit", "roller3d", "clock", "display"],
  capabilities: ["single-character-display", "3d-animation", "clock-composition", "themeable"],
  fieldSemantics: ["digitDisplay", "3dCounterDigit", "clockDigit", "animatedCharacter"],
  props: [
    { name: "value", type: "string", required: true, description: "Caractere exibido no display.", semanticRole: "value", bindable: true },
    { name: "fontSize", type: "number", default: 72, description: "Tamanho da fonte do digito.", semanticRole: "appearance", bindable: true },
    { name: "color", type: "string", description: "Cor principal do digito.", semanticRole: "appearance", bindable: true },
    { name: "backgroundColor", type: "string", description: "Cor do fundo do display.", semanticRole: "appearance", bindable: true },
    { name: "className", type: "string", description: "Classes CSS adicionais.", semanticRole: "appearance", bindable: true }
  ],
  states: ["idle", "animating"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/digits/sg-roller3d-digit/samples/basico.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/digits/sg-roller3d-digit/sg-roller3d-digit.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/digits/sg-roller3d-digit", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "gadget.digit.roller3d", acceptsDataBinding: true, defaultProps: { fontSize: 72 } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Displays numericos com identidade visual forte e tridimensional.",
    "Relogios e contadores com animacao roller.",
    "KPIs compactos com enfase em movimento visual."
  ],
  avoidUseCases: [
    "Entradas editaveis pelo usuario.",
    "Texto corrido ou conteudo de leitura longa.",
    "Listagens com alta densidade informacional."
  ],
  synonyms: ["roller 3d digit", "3d digit", "animated roller digit"],
  relatedEntityFields: ["digit", "counter", "score", "clock", "metric"],
  compositionHints: [
    "Combinar varios SgRoller3DDigit para displays compostos.",
    "Usar com SgCard e SgDashboard em areas de destaque."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0.12, number: 0.72, denseLayout: 0.32 }
};
