import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "layout.grid",
  package: "@seedgrid/fe-components",
  exportName: "SgGrid",
  slug: "sg-grid",
  displayName: "SgGrid",
  category: "layout",
  subcategory: "grid",
  description:
    "Primitive de layout em grade responsiva para distribuicao de cards, blocos e formularios em colunas e linhas.",
  tags: ["layout", "grid", "responsive", "columns", "container"],
  capabilities: ["responsive-columns", "auto-fit", "dense-flow", "row-span", "column-span"],
  fieldSemantics: ["container", "gridLayout", "responsiveLayout", "collectionLayout"],
  props: [
    {
      name: "columns",
      type: "number | responsive columns map",
      description: "Define a quantidade de colunas base e por breakpoint.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "minItemWidth",
      type: "number | string",
      description: "Largura minima dos itens em modo auto-fit.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "gap",
      type: "number | string",
      default: 0,
      description: "Espacamento entre os itens da grade.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "padding",
      type: "number | string",
      description: "Espacamento interno do container grid.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "dense",
      type: "boolean",
      default: false,
      description: "Ativa preenchimento denso do fluxo de grade.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "rowHeight",
      type: "number | string",
      description: "Altura automatica das linhas da grade.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "children",
      type: "ReactNode",
      description: "Itens renderizados dentro da grade.",
      semanticRole: "data",
      bindable: false
    }
  ],
  states: ["default", "dense", "responsive"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-grid/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-grid/sg-grid.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-grid",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "layout.grid",
    acceptsDataBinding: true,
    defaultProps: {
      columns: {
        base: 1
      },
      gap: 0,
      dense: false
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Distribuir cards, KPIs e blocos de conteudo em colunas responsivas.",
    "Montar formularios com varias colunas e alinhamento consistente.",
    "Criar layouts adaptativos com spans e preenchimento denso."
  ],
  avoidUseCases: [
    "Pilhas lineares simples; nesses casos prefira SgStack.",
    "Blocos unicos com destaque visual; nesses casos prefira SgCard ou SgPanel.",
    "Acoes ou captura de dados individuais; nesses casos prefira componentes especificos."
  ],
  synonyms: ["grid", "responsive grid", "columns layout", "card grid"],
  relatedEntityFields: ["dashboardGrid", "cardsLayout", "formColumns", "galleryLayout"],
  compositionHints: [
    "Usar com SgCard, SgPanel e SgBadge para dashboards.",
    "Combinar com SgStack dentro dos itens quando houver alinhamento interno."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.98
  }
};
