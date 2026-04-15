import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "navigation.dock-menu",
  package: "@seedgrid/fe-components",
  exportName: "SgDockMenu",
  slug: "sg-dock-menu",
  displayName: "SgDockMenu",
  category: "navigation",
  subcategory: "dock-menu",
  description:
    "Menu de acoes ou navegacao com estilo dock, suporte a badges, magnify, posicoes ancoradas e persistencia de arraste.",
  tags: ["navigation", "menu", "dock", "actions", "launcher"],
  capabilities: ["dock-layout", "anchored-navigation", "badges", "magnify", "drag-drop", "persistent-position"],
  fieldSemantics: ["navigation", "dock", "quickActions", "appLauncher", "shortcutMenu"],
  props: [
    {
      name: "items",
      type: "SgDockMenuItem[]",
      required: true,
      description: "Itens exibidos no dock com icone, label, badge e acao.",
      semanticRole: "data",
      bindable: true
    },
    {
      name: "position",
      type: '"left-top" | "left-center" | "left-bottom" | "center-top" | "center-bottom" | "right-top" | "right-center" | "right-bottom"',
      default: "center-bottom",
      description: "Posicionamento principal do dock na area alvo.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "enableDragDrop",
      type: "boolean",
      default: false,
      description: "Permite reposicionamento manual do dock.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "showLabels",
      type: "boolean",
      default: true,
      description: "Exibe labels contextuais dos itens.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "magnify",
      type: "boolean",
      default: true,
      description: "Ativa efeito de ampliacao ao passar o mouse.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "itemSize",
      type: "number",
      default: 48,
      description: "Tamanho visual padrao dos itens do dock.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "gap",
      type: "number",
      default: 16,
      description: "Espacamento entre os itens do dock.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "zIndex",
      type: "number",
      default: 50,
      description: "Camada visual usada quando o dock esta sobreposto.",
      semanticRole: "behavior",
      bindable: true
    }
  ],
  states: ["default", "hovered", "dragging", "menu-open", "badged"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-dock-menu/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-dock-menu/sg-dock-menu.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-dock-menu",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "navigation.dock-menu",
    acceptsDataBinding: true,
    defaultProps: {
      position: "center-bottom",
      showLabels: true,
      magnify: true
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Expor atalhos de navegacao e acoes frequentes em estilo dock.",
    "Criar launcher de modulos, menus flutuantes e barras ancoradas com icones.",
    "Exibir notificacoes contextuais com badges em menus persistentes."
  ],
  avoidUseCases: [
    "Menus textuais extensos ou arvores hierarquicas; nesses casos prefira Menu ou TreeView.",
    "Acoes unitarias simples; nesses casos prefira Button ou SplitButton.",
    "Containers estruturais; nesses casos prefira Panel, Card ou Screen."
  ],
  synonyms: ["dock menu", "launcher", "quick menu", "floating dock"],
  relatedEntityFields: ["shortcuts", "modules", "quickActions", "dockItems", "navigationItems"],
  compositionHints: [
    "Usar com Screen e Panel em shells de aplicacao.",
    "Combinar com Badge para contadores de notificacao e estados contextuais."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0.55,
    date: 0,
    number: 0,
    denseLayout: 0.9
  }
};
