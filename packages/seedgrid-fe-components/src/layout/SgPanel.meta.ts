import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "layout.panel",
  package: "@seedgrid/fe-components",
  exportName: "SgPanel",
  slug: "sg-panel",
  displayName: "SgPanel",
  category: "layout",
  subcategory: "panel",
  description:
    "Container visual e estrutural para agrupamento de conteudo, composicao de secoes e cenarios com dock, padding e scroll.",
  tags: ["layout", "container", "panel", "group"],
  capabilities: ["container", "grouping", "dock-layout", "scrollable", "grid-span"],
  fieldSemantics: ["container", "section", "group", "formSection", "highlightedContent"],
  props: [
    {
      name: "align",
      type: '"top" | "left" | "right" | "bottom" | "client"',
      default: "client",
      description: "Posicionamento relativo ao container pai em cenarios de dock.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "width",
      type: "number | string",
      description: "Largura do painel quando dockado ou usado em composicoes controladas.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "height",
      type: "number | string",
      description: "Altura do painel quando dockado ou usado em composicoes controladas.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "borderStyle",
      type: '"none" | "solid" | "dashed"',
      default: "dashed",
      description: "Estilo visual da borda do container.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "padding",
      type: "number | string",
      default: 0,
      description: "Espacamento externo do painel em relacao ao slot recebido do pai.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "contentPadding",
      type: "number | string",
      default: 0,
      description: "Espacamento interno entre a borda e o conteudo.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "scrollable",
      type: 'boolean | "auto" | "x" | "y"',
      default: false,
      description: "Habilita scroll apenas quando desejado.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "scrollbarGutter",
      type: "boolean",
      default: false,
      description: "Reserva espaco visual para scrollbar.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "children",
      type: "ReactNode",
      description: "Conteudo livre ou outros elementos de layout aninhados.",
      semanticRole: "data",
      bindable: false
    }
  ],
  states: ["default", "scrollable", "nested"],
  examples: [
    {
      id: "dock-basic",
      title: "Dock basico",
      file: "apps/showcase/src/app/components/sg-panel/samples/align-width-height.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-panel/sg-panel.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-panel",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "layout.panel",
    acceptsDataBinding: true,
    defaultProps: {
      align: "client",
      borderStyle: "dashed",
      scrollable: false
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Agrupar visualmente conteudo relacionado em secoes ou blocos de formulario.",
    "Estruturar layouts com dock, areas laterais, cabecalho e rodape.",
    "Destacar conteudo ou criar containers com scroll controlado."
  ],
  avoidUseCases: [
    "Executar acoes; nesses casos prefira SgButton.",
    "Capturar dados; nesses casos prefira componentes de input.",
    "Substituir navegacao especializada; nesses casos prefira componentes de menu e layout dedicados."
  ],
  synonyms: ["panel", "container", "section", "group box", "content block"],
  relatedEntityFields: ["section", "group", "formBlock", "contentArea"],
  compositionHints: [
    "Usar como container para campos como SgInputText.",
    "Combinar com SgButton em rodapes de secao ou areas de acao."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.95
  }
};
