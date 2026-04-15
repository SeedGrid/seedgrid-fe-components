import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "navigation.toolbar",
  package: "@seedgrid/fe-components",
  exportName: "SgToolBar",
  slug: "sg-toolbar",
  displayName: "SgToolBar",
  category: "navigation",
  subcategory: "toolbar",
  description:
    "Barra de ferramentas para agrupar acoes frequentes com suporte a orientacao, colapso, arraste e encaixe em zonas de layout.",
  tags: ["navigation", "toolbar", "actions", "dock", "draggable"],
  capabilities: ["action-grouping", "dockable", "draggable", "collapsible", "orientation-control"],
  fieldSemantics: ["toolbar", "actionBar", "contextActions", "dockedActions"],
  props: [
    {
      name: "id",
      type: "string",
      required: true,
      description: "Identificador estavel da toolbar.",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "title",
      type: "ReactNode",
      description: "Titulo opcional exibido na barra.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "orientationDirection",
      type: '"vertical-up" | "vertical-down" | "horizontal-left" | "horizontal-right"',
      description: "Direcao e orientacao da toolbar.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "buttonsPerDirection",
      type: "number",
      description: "Quantidade de botoes distribuidos por direcao.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "dockZone",
      type: '"top" | "bottom" | "left" | "right" | "free"',
      default: "free",
      description: "Zona de encaixe da toolbar.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "draggable",
      type: "boolean",
      default: false,
      description: "Permite arrastar a toolbar.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "collapsible",
      type: "boolean",
      default: true,
      description: "Permite recolher a toolbar.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "children",
      type: "ReactNode",
      description: "Botoes e elementos de acao da toolbar.",
      semanticRole: "data",
      bindable: false
    }
  ],
  states: ["default", "collapsed", "expanded", "docked", "dragging"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-toolbar/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-toolbar/sg-toolbar.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-toolbar",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "navigation.toolbar",
    acceptsDataBinding: true,
    defaultProps: {
      dockZone: "free",
      draggable: false,
      collapsible: true
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Agrupar acoes frequentes em uma faixa horizontal ou vertical persistente.",
    "Toolbars contextuais com suporte a colapso, arraste e encaixe.",
    "Ambientes de trabalho, editores e dashboards com comandos recorrentes."
  ],
  avoidUseCases: [
    "Navegacao hierarquica de aplicacao; nesses casos prefira SgMenu.",
    "Acoes isoladas simples; nesses casos prefira SgButton.",
    "Agrupamento de conteudo sem acoes."
  ],
  synonyms: ["toolbar", "action bar", "command bar", "floating toolbar"],
  relatedEntityFields: ["toolbar", "actionsBar", "quickCommands", "editorToolbar"],
  compositionHints: [
    "Usar com SgToolbarIconButton e SgButton para compor acoes.",
    "Combinar com SgPanel, SgCard e SgMenu em layouts de trabalho."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0.1,
    date: 0,
    number: 0,
    denseLayout: 0.9
  }
};
