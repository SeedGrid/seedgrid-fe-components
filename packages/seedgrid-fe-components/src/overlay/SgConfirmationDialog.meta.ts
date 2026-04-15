import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "feedback.confirmation-dialog",
  package: "@seedgrid/fe-components",
  exportName: "SgConfirmationDialog",
  slug: "sg-confirmation-dialog",
  displayName: "SgConfirmationDialog",
  category: "feedback",
  subcategory: "confirmation-dialog",
  description:
    "Dialog especializado em confirmacao de acoes sensiveis, com mensagem, severidade e botoes de confirmar e cancelar.",
  tags: ["feedback", "confirmation", "dialog", "danger", "warning"],
  capabilities: ["confirmation-flow", "confirm-cancel", "severity", "custom-buttons", "safe-defaults"],
  fieldSemantics: ["confirmationDialog", "dangerConfirmation", "warningPrompt", "decisionModal"],
  props: [
    {
      name: "open",
      type: "boolean",
      description: "Controla a abertura do dialog de confirmacao.",
      semanticRole: "value",
      bindable: true
    },
    {
      name: "title",
      type: "ReactNode",
      description: "Titulo principal da confirmacao.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "message",
      type: "ReactNode",
      description: "Mensagem principal explicando o risco ou decisao.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "severity",
      type: '"primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger" | "plain"',
      default: "warning",
      description: "Tom semantico da confirmacao.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "confirmButton",
      type: "SgConfirmationDialogButtonConfig",
      description: "Configuracao visual e comportamental do botao de confirmacao.",
      semanticRole: "data",
      bindable: true
    },
    {
      name: "cancelButton",
      type: "SgConfirmationDialogButtonConfig",
      description: "Configuracao visual e comportamental do botao de cancelamento.",
      semanticRole: "data",
      bindable: true
    },
    {
      name: "onConfirm",
      type: "() => void",
      description: "Callback disparado quando o usuario confirma a acao.",
      semanticRole: "event",
      bindable: false
    },
    {
      name: "onCancel",
      type: "() => void",
      description: "Callback disparado quando o usuario cancela a acao.",
      semanticRole: "event",
      bindable: false
    }
  ],
  states: ["closed", "open", "confirming", "cancelling"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-confirmation-dialog/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-confirmation-dialog/sg-confirmation-dialog.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-confirmation-dialog",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "feedback.confirmation-dialog",
    acceptsDataBinding: true,
    defaultProps: {
      severity: "warning",
      closeOnCancel: true,
      closeOnConfirm: true
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Confirmar acoes destrutivas, sensiveis ou irreversiveis.",
    "Solicitar decisao binaria antes de excluir, revogar ou prosseguir.",
    "Fluxos em que confirmacao e cancelamento precisam de semantica clara."
  ],
  avoidUseCases: [
    "Conteudo modal generico sem necessidade de confirmacao; nesses casos prefira SgDialog.",
    "Feedback apenas informativo; nesses casos prefira toast, badge ou alerta simples.",
    "Captura direta de dados sem contexto de risco; nesses casos prefira formularios comuns."
  ],
  synonyms: ["confirmation dialog", "confirm modal", "danger prompt", "warning confirm"],
  relatedEntityFields: ["deleteConfirm", "confirmAction", "unsavedChanges", "dangerousOperation"],
  compositionHints: [
    "Usar com SgButton para abrir a confirmacao a partir de acoes sensiveis.",
    "Combinar com SgDialog apenas quando houver um fluxo modal maior ao redor."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.6
  }
};
