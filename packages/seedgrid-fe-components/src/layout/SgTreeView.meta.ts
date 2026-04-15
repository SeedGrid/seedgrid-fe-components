import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "navigation.tree",
  package: "@seedgrid/fe-components",
  exportName: "SgTreeView",
  slug: "sg-tree-view",
  displayName: "SgTreeView",
  category: "navigation",
  subcategory: "tree-view",
  description:
    "Navegacao hierarquica para estruturas em arvore com expansao, selecao, busca, checkboxes e suporte a dados aninhados.",
  tags: ["navigation", "tree", "hierarchy", "selection", "search"],
  capabilities: ["hierarchical-navigation", "node-selection", "checkboxes", "search", "expand-collapse", "json-mapping"],
  fieldSemantics: ["hierarchy", "tree", "nestedNavigation", "permissionTree", "categoryTree"],
  props: [
    {
      name: "nodes",
      type: "SgTreeNode[]",
      required: true,
      description: "Lista hierarquica de nos exibidos pela arvore.",
      semanticRole: "data",
      bindable: true
    },
    {
      name: "selectionMode",
      type: '"single" | "multiple" | "checkbox"',
      default: "single",
      description: "Modo principal de selecao dos nos.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "selectedIds",
      type: "string[]",
      description: "Nos selecionados de forma controlada.",
      semanticRole: "value",
      bindable: true
    },
    {
      name: "checkedIds",
      type: "string[]",
      description: "Nos marcados em cenarios de checkbox tree.",
      semanticRole: "value",
      bindable: true
    },
    {
      name: "searchable",
      type: "boolean",
      default: false,
      description: "Habilita campo interno de busca para filtrar nos.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "expandAllByDefault",
      type: "boolean",
      default: false,
      description: "Expande a arvore inteira na montagem inicial.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: "md",
      description: "Escala visual da arvore e dos itens.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "onSelectionChange",
      type: "(ids: string[]) => void",
      description: "Callback disparado quando a selecao muda.",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["default", "searching", "expanded", "collapsed", "selected", "checked"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-tree-view/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-tree-view/sg-tree-view.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-tree-view",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "navigation.tree",
    acceptsDataBinding: true,
    defaultProps: {
      selectionMode: "single",
      searchable: false,
      expandAllByDefault: false
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Navegar estruturas hierarquicas como permissoes, categorias e menus aninhados.",
    "Selecionar ou marcar nos em arvores administrativas e exploradores de estrutura.",
    "Exibir relacoes pai-filho com busca e expansao progressiva."
  ],
  avoidUseCases: [
    "Listas planas simples; nesses casos prefira listas, tabelas ou selects.",
    "Acoes primarias; nesses casos prefira componentes de botao.",
    "Containers de layout sem hierarquia; nesses casos prefira Panel, Card ou Stack."
  ],
  synonyms: ["tree view", "hierarchy tree", "permission tree", "navigation tree"],
  relatedEntityFields: ["categories", "permissions", "tree", "folders", "menuTree"],
  compositionHints: [
    "Usar com SgCard ou SgPanel em sidebars e telas administrativas.",
    "Combinar com SgButton e dialogs em fluxos de selecao ou configuracao."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0.8,
    date: 0,
    number: 0,
    denseLayout: 0.85
  }
};
