import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "navigation.menu",
  package: "@seedgrid/fe-components",
  exportName: "SgMenu",
  slug: "sg-menu",
  displayName: "SgMenu",
  category: "navigation",
  subcategory: "menu",
  description:
    "Componente de navegacao estruturada com suporte a sidebar, drawer, menu inline e variantes hierarquicas ou mega menu.",
  tags: ["navigation", "menu", "sidebar", "drawer", "mega-menu"],
  capabilities: ["hierarchical-navigation", "search", "collapse", "pin", "dock", "brand-user-sections"],
  fieldSemantics: ["navigation", "menuTree", "appNavigation", "hierarchicalMenu"],
  props: [
    {
      name: "menu",
      type: "SgMenuNode[]",
      required: true,
      description: "Arvore de itens e subitens do menu.",
      semanticRole: "data",
      bindable: true
    },
    {
      name: "selection",
      type: "SgMenuSelection",
      description: "Selecao ativa por id ou url.",
      semanticRole: "value",
      bindable: true
    },
    {
      name: "menuStyle",
      type: '"sidebar" | "drawer" | "inline" | "hybrid"',
      default: "sidebar",
      description: "Modo estrutural do menu.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "menuVariantStyle",
      type: '"panel" | "tiered" | "mega-horizontal" | "mega-vertical"',
      default: "panel",
      description: "Variante visual e comportamental do menu.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "collapsed",
      type: "boolean",
      description: "Controla o estado colapsado do menu.",
      semanticRole: "value",
      bindable: true
    },
    {
      name: "search",
      type: "{ enabled: boolean; placeholder?: string }",
      description: "Configuracao opcional de busca integrada.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "brand",
      type: "SgMenuBrand",
      description: "Bloco de marca no topo do menu.",
      semanticRole: "data",
      bindable: true
    },
    {
      name: "user",
      type: "SgMenuUser",
      description: "Bloco de usuario exibido no menu.",
      semanticRole: "data",
      bindable: true
    },
    {
      name: "onNavigate",
      type: "(node: SgMenuNode) => void",
      description: "Callback disparado na navegacao por um item.",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["default", "collapsed", "expanded", "pinned", "searching", "docked"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-menu/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-menu/sg-menu.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-menu",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "navigation.menu",
    acceptsDataBinding: true,
    defaultProps: {
      menuStyle: "sidebar",
      menuVariantStyle: "panel",
      closeOnNavigate: true
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Navegacao global ou lateral de aplicacoes com varias areas e niveis.",
    "Menus persistentes com busca, colapso, pinagem e seccoes de usuario.",
    "Estruturas de informacao hierarquicas que pedem submenus e mega menus."
  ],
  avoidUseCases: [
    "Indicacao simples de caminho; nesses casos prefira SgBreadcrumb.",
    "Acoes locais pequenas; nesses casos prefira SgPopup ou SgSplitButton.",
    "Containers de layout sem semantica de navegacao."
  ],
  synonyms: ["menu", "sidebar", "navigation menu", "app menu"],
  relatedEntityFields: ["menu", "navigation", "navTree", "sidebarItems", "brandMenu"],
  compositionHints: [
    "Usar com SgBreadcrumb para navegacao local e contexto de pagina.",
    "Combinar com SgAvatar e SgBadge em seccoes de usuario e notificacoes."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0.2,
    date: 0,
    number: 0,
    denseLayout: 0.95
  }
};
