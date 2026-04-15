import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "layout.screen",
  package: "@seedgrid/fe-components",
  exportName: "SgScreen",
  slug: "sg-screen",
  displayName: "SgScreen",
  category: "layout",
  subcategory: "screen",
  description:
    "Container estrutural de alto nivel para composicao de telas com area client, fullscreen opcional e suporte a docking.",
  tags: ["layout", "screen", "shell", "page", "docking"],
  capabilities: ["full-screen-container", "dock-layout", "root-shell", "responsive-sizing", "client-area"],
  fieldSemantics: ["screen", "pageLayout", "appShell", "workspace", "clientArea"],
  props: [
    {
      name: "children",
      type: "ReactNode",
      description: "Conteudo estrutural da tela, normalmente com panels dockados.",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "fullscreen",
      type: "boolean",
      default: true,
      description: "Define se a tela ocupa toda a viewport.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "width",
      type: "number | string",
      description: "Largura explicita quando a tela nao for fullscreen.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "height",
      type: "number | string",
      description: "Altura explicita quando a tela nao for fullscreen.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "padding",
      type: "number | string",
      description: "Espacamento interno aplicado ao root da tela.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "className",
      type: "string",
      description: "Classes adicionais aplicadas ao container principal.",
      semanticRole: "appearance",
      bindable: true
    }
  ],
  states: ["default", "fullscreen", "embedded"],
  examples: [
    {
      id: "complete-example",
      title: "Exemplo completo",
      file: "apps/showcase/src/app/components/sg-screen/samples/complete-example.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-screen/sg-screen.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-screen",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "layout.screen",
    acceptsDataBinding: true,
    defaultProps: {
      fullscreen: true,
      padding: 0
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Compor shells de aplicacao, workspaces e layouts de tela completos.",
    "Criar area raiz para estruturas com docking, sidebars, header e footer.",
    "Organizar conteudo de pagina com controle explicito de largura, altura e padding."
  ],
  avoidUseCases: [
    "Blocos locais de agrupamento; nesses casos prefira Panel, Card ou GroupBox.",
    "Acoes ou entradas de dados; nesses casos prefira Button ou componentes de input.",
    "Menus de navegacao especializados; nesses casos prefira DockMenu, Menu ou Breadcrumb."
  ],
  synonyms: ["screen", "page shell", "layout shell", "workspace"],
  relatedEntityFields: ["screen", "page", "workspace", "shell", "mainLayout"],
  compositionHints: [
    "Usar com Panel, Stack e DockMenu para montar a estrutura completa da tela.",
    "Combinar com dialogs, popups e componentes de navegacao em shells complexos."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.98
  }
};
