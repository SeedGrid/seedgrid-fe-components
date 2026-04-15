import type { SgAiHintsV0, SgMetaV0 } from "../../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "gadget.clock-theme-preview",
  package: "@seedgrid/fe-components",
  exportName: "SgClockThemePreview",
  slug: "sg-clock-theme-preview",
  displayName: "SgClockThemePreview",
  category: "gadget",
  subcategory: "theme-preview",
  description:
    "Preview visual compacto de um tema de relogio, renderizado em SVG para comparacao rapida de estilos.",
  tags: ["gadget", "clock", "theme", "preview", "svg"],
  capabilities: ["theme-preview", "svg-rendering", "compact-visualization", "dark-flag-aware"],
  fieldSemantics: ["themePreview", "clockThemePreview", "visualStylePreview"],
  props: [
    { name: "theme", type: "SgClockTheme", required: true, description: "Tema visual usado na renderizacao do preview.", semanticRole: "value", bindable: true },
    { name: "size", type: "number", default: 64, description: "Dimensao do preview quadrado em pixels.", semanticRole: "appearance", bindable: true },
    { name: "className", type: "string", description: "Classes adicionais aplicadas ao SVG raiz.", semanticRole: "appearance", bindable: true }
  ],
  states: ["default", "dark-aware"],
  examples: [
    { id: "provider-basic", title: "Uso com picker", file: "apps/showcase/src/app/components/providers/sg-clock-theme-provider/samples/uso-basico.tsx.sample", kind: "sample" },
    { id: "inline-theme", title: "Tema inline no clock", file: "apps/showcase/src/app/components/gadgets/sg-clock/samples/tema-inline-sem-provider.tsx.sample", kind: "sample" }
  ],
  showcase: { route: "/components/gadgets/sg-clock-theme-preview", hasPlayground: false, hasPropsTable: true },
  sdui: {
    rendererType: "gadget.clock-theme-preview",
    acceptsDataBinding: true,
    defaultProps: { size: 64 }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Comparar visualmente temas de relogio em galerias e seletores.",
    "Renderizar miniaturas de estilos antes da aplicacao efetiva do tema.",
    "Exibir previews compactos em listas de configuracao visual."
  ],
  avoidUseCases: [
    "Selecao direta de tema; nesses casos prefira SgClockThemePicker.",
    "Renderizacao do relogio funcional completo; nesses casos prefira SgClock.",
    "Indicadores numericos ou gauges sem relacao com temas de clock."
  ],
  synonyms: ["clock theme preview", "theme thumbnail", "theme preview", "style preview"],
  relatedEntityFields: ["theme", "themePreview", "themeThumbnail", "clockTheme"],
  compositionHints: [
    "Usar dentro de SgClockThemePicker para listas de selecao visual.",
    "Combinar com SgClockThemeProvider e SgClock em fluxos de configuracao."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.34, date: 0.08, number: 0, denseLayout: 0.58 }
};
