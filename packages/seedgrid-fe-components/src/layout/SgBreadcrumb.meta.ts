import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "navigation.breadcrumb",
  package: "@seedgrid/fe-components",
  exportName: "SgBreadcrumb",
  slug: "sg-breadcrumb",
  displayName: "SgBreadcrumb",
  category: "navigation",
  subcategory: "breadcrumb",
  description:
    "Navegacao hierarquica compacta para indicar caminho atual e permitir retorno a niveis anteriores.",
  tags: ["navigation", "breadcrumb", "hierarchy", "path"],
  capabilities: ["hierarchical-navigation", "overflow-collapse", "home-icon", "custom-separator"],
  fieldSemantics: ["navigation", "hierarchy", "breadcrumbPath", "locationTrail"],
  props: [
    {
      name: "items",
      type: "SgBreadcrumbItem[]",
      required: true,
      description: "Lista ordenada de niveis do caminho de navegacao.",
      semanticRole: "data",
      bindable: true
    },
    {
      name: "separator",
      type: '"slash" | "chevron" | "dot" | "arrow" | ReactNode',
      default: "chevron",
      description: "Separador visual entre os niveis.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "maxItems",
      type: "number",
      description: "Quantidade maxima de itens visiveis antes do colapso.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "overflowBehavior",
      type: '"collapse" | "scroll"',
      default: "collapse",
      description: "Comportamento quando o caminho excede o espaco disponivel.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "showHomeIcon",
      type: "boolean",
      default: false,
      description: "Adiciona um item inicial com icone de home.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "variant",
      type: '"default" | "subtle" | "primary"',
      default: "default",
      description: "Variante visual do breadcrumb.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "onNavigate",
      type: "(item: SgBreadcrumbItem, index: number) => void",
      description: "Callback disparado ao navegar por um item.",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["default", "collapsed", "scrolling"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-breadcrumb/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-breadcrumb/sg-breadcrumb.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-breadcrumb",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "navigation.breadcrumb",
    acceptsDataBinding: true,
    defaultProps: {
      separator: "chevron",
      overflowBehavior: "collapse",
      showHomeIcon: false
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Indicar caminho atual em navegacao hierarquica de telas e seções.",
    "Permitir retorno rapido a niveis anteriores em apps com estrutura profunda.",
    "Complementar cabecalhos de pagina com contexto de localizacao."
  ],
  avoidUseCases: [
    "Menus completos de navegacao lateral ou superior; nesses casos prefira SgMenu.",
    "Acoes do usuario sem hierarquia de pagina.",
    "Conteudo de layout ou agrupamento visual."
  ],
  synonyms: ["breadcrumb", "navigation trail", "path navigation", "hierarchy trail"],
  relatedEntityFields: ["breadcrumbs", "path", "currentSection", "navigationPath"],
  compositionHints: [
    "Usar junto de SgCard, SgPanel e cabecalhos de pagina.",
    "Combinar com SgMenu quando houver navegacao global e local."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.65
  }
};
