import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "layout.accordion",
  package: "@seedgrid/fe-components",
  exportName: "SgAccordion",
  slug: "sg-accordion",
  displayName: "SgAccordion",
  category: "layout",
  subcategory: "accordion",
  description:
    "Container colapsavel por secoes para organizar conteudo em paineis expansivos, verticais ou horizontais.",
  tags: ["layout", "accordion", "collapse", "sections", "disclosure"],
  capabilities: ["collapsible-sections", "multiple-open", "horizontal", "controlled-state", "keep-mounted"],
  fieldSemantics: ["container", "sectionGroup", "collapsibleSection", "disclosure"],
  props: [
    {
      name: "items",
      type: "SgAccordionItem[]",
      required: true,
      description: "Colecao de secoes renderizadas pelo accordion.",
      semanticRole: "data",
      bindable: true
    },
    {
      name: "orientation",
      type: '"vertical" | "horizontal"',
      default: "vertical",
      description: "Direcao de expansao dos paineis.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "multiple",
      type: "boolean",
      default: false,
      description: "Permite manter varios paineis abertos simultaneamente.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "collapsible",
      type: "boolean",
      default: true,
      description: "Permite fechar um painel ja ativo.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "activeIndex",
      type: "number[]",
      description: "Estado controlado dos paineis abertos.",
      semanticRole: "value",
      bindable: true
    },
    {
      name: "defaultActiveIndex",
      type: "number[]",
      description: "Estado inicial dos paineis abertos.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "headerBackgroundColor",
      type: "string",
      description: "Cor base dos headers do accordion.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "onActiveIndexChange",
      type: "(indexes: number[]) => void",
      description: "Callback disparado quando o conjunto de paineis abertos muda.",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["default", "expanded", "collapsed", "controlled", "horizontal"],
  examples: [
    {
      id: "basic-vertical-single",
      title: "Basico vertical",
      file: "apps/showcase/src/app/components/sg-accordion/samples/basico-vertical-single.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-accordion/sg-accordion.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-accordion",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "layout.accordion",
    acceptsDataBinding: true,
    defaultProps: {
      orientation: "vertical",
      multiple: false,
      collapsible: true
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Agrupar conteudo em secoes expansivas quando o espaco vertical precisa ser economizado.",
    "Exibir FAQs, detalhes tecnicos, filtros avancados ou configuracoes em blocos colapsaveis.",
    "Layouts com conteudo progressivo ou dividido por categorias."
  ],
  avoidUseCases: [
    "Acoes primarias ou triggers; nesses casos prefira componentes de acao.",
    "Captura direta de dados; nesses casos prefira componentes de input.",
    "Blocos sempre visiveis sem necessidade de colapso; nesses casos prefira SgPanel ou SgCard."
  ],
  synonyms: ["accordion", "collapsible sections", "expansion panels", "disclosure group"],
  relatedEntityFields: ["faqSections", "detailsSections", "filterSections", "advancedSettings"],
  compositionHints: [
    "Usar com SgInputText e outros inputs em filtros avancados ou formularios em etapas.",
    "Combinar com SgCard ou SgPanel quando o accordion fizer parte de um bloco maior."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.9
  }
};
