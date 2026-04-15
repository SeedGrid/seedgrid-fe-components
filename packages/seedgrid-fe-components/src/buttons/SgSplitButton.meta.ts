import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "action.split-button",
  package: "@seedgrid/fe-components",
  exportName: "SgSplitButton",
  slug: "sg-split-button",
  displayName: "SgSplitButton",
  category: "action",
  subcategory: "split-button",
  description:
    "Botao de acao com trigger principal e menu secundario acoplado para variacoes contextuais da mesma tarefa.",
  tags: ["action", "button", "menu", "dropdown", "cta"],
  capabilities: ["primary-action", "secondary-actions", "menu-items", "severity", "loading", "disabled"],
  fieldSemantics: ["primaryAction", "secondaryAction", "menuAction", "contextAction"],
  props: [
    {
      name: "label",
      type: "ReactNode",
      description: "Conteudo textual principal da acao.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "items",
      type: "SgSplitButtonItem[]",
      required: true,
      description: "Lista de acoes secundarias exibidas no menu dropdown.",
      semanticRole: "data",
      bindable: true
    },
    {
      name: "severity",
      type: '"primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger"',
      default: "primary",
      description: "Peso visual e semantico da acao principal.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "appearance",
      type: '"solid" | "outline" | "ghost"',
      default: "solid",
      description: "Variante visual base do split button.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "disabled",
      type: "boolean",
      default: false,
      description: "Desabilita a acao principal e o menu secundario.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "loading",
      type: "boolean",
      default: false,
      description: "Exibe estado de carregamento na acao principal.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "leftIcon",
      type: "ReactNode",
      description: "Icone exibido junto do label principal.",
      semanticRole: "appearance",
      bindable: false
    },
    {
      name: "onClick",
      type: "() => void",
      description: "Callback disparado na acao principal.",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["default", "disabled", "loading", "menu-open"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-split-button/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-split-button/sg-split-button.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-split-button",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "action.split-button",
    acceptsDataBinding: true,
    defaultProps: {
      severity: "primary",
      appearance: "solid",
      disabled: false
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Acoes com um caminho principal e opcoes secundarias relacionadas no mesmo contexto.",
    "Fluxos como salvar, exportar, compartilhar ou criar com variacoes de execucao.",
    "Toolbars e rodapes que precisam reduzir repeticao de botoes de acao."
  ],
  avoidUseCases: [
    "Acoes simples com uma unica intencao; nesses casos prefira SgButton.",
    "Estruturar layout ou agrupar conteudo; nesses casos prefira SgPanel, SgCard ou SgAccordion.",
    "Capturar dados do usuario; nesses casos prefira componentes de input."
  ],
  synonyms: ["split button", "dropdown action button", "menu button", "compound action"],
  relatedEntityFields: ["saveActions", "exportActions", "shareActions", "createActions"],
  compositionHints: [
    "Usar com SgPanel e SgCard em cabecalhos de bloco ou areas de acao.",
    "Combinar com componentes de input em formularios com variacoes de submit."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.7
  }
};
