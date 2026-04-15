import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "action.button",
  package: "@seedgrid/fe-components",
  exportName: "SgButton",
  slug: "sg-button",
  displayName: "SgButton",
  category: "action",
  subcategory: "button",
  description:
    "Botao de acao com suporte a severity, appearance, shape, loading e icones para acoes principais e secundarias.",
  tags: ["action", "button", "trigger", "cta"],
  capabilities: ["trigger", "submit", "severity", "appearance", "loading", "icon-support"],
  fieldSemantics: ["primaryAction", "secondaryAction", "submit", "confirm", "dismiss"],
  props: [
    {
      name: "label",
      type: "ReactNode",
      description: "Conteudo textual principal do botao.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "severity",
      type: '"primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger"',
      default: "primary",
      description: "Define o peso visual e semantico da acao.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "appearance",
      type: '"solid" | "outline" | "ghost"',
      default: "solid",
      description: "Variante visual base do botao.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "type",
      type: '"button" | "submit" | "reset"',
      default: "button",
      description: "Comportamento HTML da acao dentro de formularios.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "loading",
      type: "boolean",
      default: false,
      description: "Exibe spinner e bloqueia interacao enquanto a acao esta em progresso.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "disabled",
      type: "boolean",
      default: false,
      description: "Desabilita a interacao do botao.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "leftIcon",
      type: "ReactNode",
      description: "Icone exibido antes do label.",
      semanticRole: "appearance",
      bindable: false
    },
    {
      name: "rightIcon",
      type: "ReactNode",
      description: "Icone exibido depois do label.",
      semanticRole: "appearance",
      bindable: false
    },
    {
      name: "onClick",
      type: "MouseEventHandler<HTMLButtonElement>",
      description: "Callback disparado quando a acao e executada.",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["default", "disabled", "loading"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-button/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-button/sg-button.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-button",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "action.button",
    acceptsDataBinding: true,
    defaultProps: {
      appearance: "solid",
      severity: "primary",
      type: "button"
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Acoes primarias e secundarias em formularios e telas CRUD.",
    "Submit, confirmacao, salvar, cancelar e outras acoes explicitas do usuario.",
    "Chamadas para acao com feedback visual de loading."
  ],
  avoidUseCases: [
    "Agrupar conteudo ou estruturar layout; nesses casos prefira SgPanel, SgCard ou SgStack.",
    "Captura de dados; nesses casos prefira componentes de input.",
    "Blocos de navegacao complexa; nesses casos prefira componentes de menu ou breadcrumb."
  ],
  synonyms: ["button", "cta", "action button", "submit button"],
  relatedEntityFields: ["submit", "save", "cancel", "confirm", "delete"],
  compositionHints: [
    "Combinar com SgInputText e outros campos em formularios.",
    "Usar dentro de SgPanel ou SgDialog para acoes contextuais."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.4
  }
};
