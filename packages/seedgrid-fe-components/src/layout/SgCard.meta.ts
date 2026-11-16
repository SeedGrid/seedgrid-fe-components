import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "layout.card",
  package: "@seedgrid/fe-components",
  exportName: "SgCard",
  slug: "sg-card",
  displayName: "SgCard",
  category: "layout",
  subcategory: "card",
  description:
    "Container visual para destacar conteúdo em blocos com cabeçalho, descrição, ações, rodapé e estados colapsáveis.",
  tags: ["layout", "card", "container", "surface", "content-block"],
  capabilities: ["header-footer", "highlighted-content", "collapsible", "clickable", "draggable", "surface-styles"],
  fieldSemantics: ["container", "contentCard", "summaryBlock", "highlightedContent", "section"],
  props: [
    {
      name: "title",
      type: "ReactNode",
      description: "Título principal do card.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "description",
      type: "ReactNode",
      description: "Descrição ou subtítulo complementar do cabeçalho.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: "Conteúdo principal exibido dentro do card.",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "cardStyle",
      type: '"default" | "outlined" | "elevated" | "flat"',
      default: "default",
      description: "Estilo visual da superfície do card.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: "md",
      description: "Escala geral de espaços e dimensões do card.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "collapsible",
      type: "boolean",
      default: false,
      description: "Permite recolher e expandir o conteúdo do card.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "clickable",
      type: "boolean",
      default: false,
      description: "Transforma o card em superfície clicável.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "onClick",
      type: "React.MouseEventHandler<HTMLElement>",
      description: "Callback disparado quando o card e acionado.",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["default", "clickable", "collapsed", "expanded", "disabled", "dragging"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-card/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-card/sg-card.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-card",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "layout.card",
    acceptsDataBinding: true,
    defaultProps: {
      cardStyle: "default",
      size: "md",
      collapsible: false
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Destacar informacoes resumidas, KPIs, blocos de conteudo e areas de detalhe.",
    "Agrupar cabecalho, corpo e rodape em um bloco visual independente.",
    "Criar cards clicaveis, colapsaveis ou arrastaveis em dashboards e listas."
  ],
  avoidUseCases: [
    "Executar acoes diretas; nesses casos prefira componentes de botao.",
    "Capturar dados do usuario; nesses casos prefira componentes de input.",
    "Layouts de seccao mais neutros e sem destaque visual; nesses casos prefira SgPanel."
  ],
  synonyms: ["card", "content card", "summary card", "surface block"],
  relatedEntityFields: ["summary", "highlight", "metricCard", "detailCard", "contentBlock"],
  compositionHints: [
    "Usar com SgButton em rodapes de acao ou cabecalhos de resumo.",
    "Combinar com SgAccordion e SgPanel em telas analiticas e dashboards."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.85
  }
};
