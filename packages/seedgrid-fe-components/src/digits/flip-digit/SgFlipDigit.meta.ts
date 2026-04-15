import type { SgAiHintsV0, SgMetaV0 } from "../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "gadget.digit.flip",
  package: "@seedgrid/fe-components",
  exportName: "SgFlipDigit",
  slug: "sg-flip-digit",
  displayName: "SgFlipDigit",
  category: "gadget",
  subcategory: "digit",
  description:
    "Digito animado estilo flip para exibir numeros ou caracteres unicos em relogios, contadores e paines visuais.",
  tags: ["gadget", "digit", "flip", "clock", "counter"],
  capabilities: ["single-character-display", "flip-animation", "clock-composition", "size-variants"],
  fieldSemantics: ["digitDisplay", "counterDigit", "clockDigit", "animatedCharacter"],
  props: [
    { name: "value", type: "string", required: true, description: "Caractere exibido no card flip.", semanticRole: "value", bindable: true },
    { name: "width", type: "number", default: 80, description: "Largura visual do card.", semanticRole: "appearance", bindable: true },
    { name: "height", type: "number", default: 120, description: "Altura visual do card.", semanticRole: "appearance", bindable: true },
    { name: "fontSize", type: "number", default: 70, description: "Tamanho da fonte do digito.", semanticRole: "appearance", bindable: true },
    { name: "className", type: "string", description: "Classes CSS adicionais no container.", semanticRole: "appearance", bindable: true }
  ],
  states: ["idle", "animating"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/digits/sg-flip-digit/samples/basico.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/digits/sg-flip-digit/sg-flip-digit.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/digits/sg-flip-digit", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "gadget.digit.flip", acceptsDataBinding: true, defaultProps: { width: 80, height: 120, fontSize: 70 } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Exibir digitos unicos em relogios digitais e contadores animados.",
    "Criar paines com estetica de flip clock ou scoreboards.",
    "Representar caracteres curtos com animacao de transicao visual."
  ],
  avoidUseCases: [
    "Entrada de dados pelo usuario; use componentes de input.",
    "Texto longo ou frases completas.",
    "Listas e tabelas com grande densidade de conteudo."
  ],
  synonyms: ["flip digit", "flip clock digit", "animated digit"],
  relatedEntityFields: ["digit", "counter", "clock", "score", "time"],
  compositionHints: [
    "Combinar varios SgFlipDigit para horas, minutos, segundos e placares.",
    "Usar com SgClock, SgCard e SgScreen em paineis visuais."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0.18, number: 0.7, denseLayout: 0.36 }
};
