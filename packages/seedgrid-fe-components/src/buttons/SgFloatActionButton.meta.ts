import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "action.float-button",
  package: "@seedgrid/fe-components",
  exportName: "SgFloatActionButton",
  slug: "sg-float-action-button",
  displayName: "SgFloatActionButton",
  category: "action",
  subcategory: "floating-action-button",
  description:
    "Botao de acao flutuante para tarefas de alto destaque, com suporte a hint, posicao fixa e expansao de acoes secundarias.",
  tags: ["action", "floating", "fab", "quick-action", "overlay"],
  capabilities: ["floating-position", "quick-action", "action-groups", "hint", "drag-drop", "auto-hide"],
  fieldSemantics: ["floatingAction", "quickAction", "primaryAction", "contextAction"],
  props: [
    {
      name: "icon",
      type: "ReactNode",
      required: true,
      description: "Icone principal exibido no FAB.",
      semanticRole: "label",
      bindable: false
    },
    {
      name: "actions",
      type: "SgFABAction[]",
      description: "Acoes secundarias exibidas a partir do botao flutuante.",
      semanticRole: "data",
      bindable: true
    },
    {
      name: "position",
      type: '"bottom-right" | "bottom-left" | "top-right" | "top-left"',
      default: "bottom-right",
      description: "Posicao do FAB na area visivel.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "hint",
      type: "string",
      description: "Rotulo textual complementar exibido como hint.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "severity",
      type: '"primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger"',
      default: "primary",
      description: "Peso visual da acao flutuante.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "disabled",
      type: "boolean",
      default: false,
      description: "Desabilita a acao principal e as acoes derivadas.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "loading",
      type: "boolean",
      default: false,
      description: "Exibe estado de carregamento no FAB.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "onClick",
      type: "() => void",
      description: "Callback da acao principal do FAB.",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["default", "disabled", "loading", "expanded", "dragging"],
  examples: [
    {
      id: "positions",
      title: "Positions",
      file: "apps/showcase/src/app/components/sg-float-action-button/samples/positions.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-float-action-button/sg-float-action-button.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-float-action-button",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "action.float-button",
    acceptsDataBinding: true,
    defaultProps: {
      position: "bottom-right",
      severity: "primary",
      autoHideOnScroll: false
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Acoes rapidas de alto destaque que precisam permanecer visiveis na tela.",
    "Criar, adicionar ou abrir fluxos principais em layouts mobile e dashboards.",
    "Menus compactos de acoes contextuais com expansao radial ou linear."
  ],
  avoidUseCases: [
    "Acoes comuns de formulario em linha; nesses casos prefira SgButton ou SgSplitButton.",
    "Agrupar conteudo ou criar secoes visuais; nesses casos prefira componentes de layout.",
    "Capturar dados do usuario; nesses casos prefira componentes de input."
  ],
  synonyms: ["fab", "floating action button", "quick action button", "floating cta"],
  relatedEntityFields: ["createAction", "quickActions", "floatingMenu", "primaryShortcut"],
  compositionHints: [
    "Usar sobre SgPanel, SgCard ou telas longas como atalho de acao principal.",
    "Combinar com listas e datatables quando a acao precisa ficar sempre acessivel."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.8
  }
};
