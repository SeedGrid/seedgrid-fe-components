import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "navigation.wizard",
  package: "@seedgrid/fe-components",
  exportName: "SgWizard",
  slug: "sg-wizard",
  displayName: "SgWizard",
  category: "navigation",
  subcategory: "wizard",
  description:
    "Fluxo multi-etapas com stepper, validacao por etapa, navegacao controlada e finalizacao assincrona.",
  tags: ["navigation", "wizard", "steps", "flow", "form"],
  capabilities: ["multi-step", "validation", "stepper", "previous-next", "async-finish"],
  fieldSemantics: ["wizard", "multiStepFlow", "stepForm", "guidedFlow", "journey"],
  props: [
    { name: "children", type: "ReactNode", required: true, description: "Paginas do wizard renderizadas em ordem.", semanticRole: "data", bindable: false },
    { name: "initialStep", type: "number", default: 0, description: "Indice inicial da etapa ativa.", semanticRole: "value", bindable: true },
    { name: "stepper", type: '"numbered" | "icons" | "none"', default: "none", description: "Modo visual do stepper.", semanticRole: "appearance", bindable: true },
    { name: "stepNavigation", type: '"none" | "previous" | "previous-and-next"', default: "previous-and-next", description: "Define quais etapas podem ser acessadas clicando no stepper.", semanticRole: "behavior", bindable: true },
    { name: "validateStep", type: "(stepIndex: number) => boolean | Promise<boolean>", description: "Valida a etapa atual antes de avancar.", semanticRole: "validation", bindable: false },
    { name: "onStepChange", type: "(index: number) => void", description: "Callback disparado ao trocar de etapa.", semanticRole: "event", bindable: false },
    { name: "onFinish", type: "() => void | Promise<void>", required: true, description: "Acao executada ao concluir o wizard.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "validating", "finishing", "completed"],
  examples: [
    { id: "auto-validation", title: "Auto validation", file: "apps/showcase/src/app/components/sg-wizard/samples/auto-validation.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/sg-wizard/sg-wizard.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/sg-wizard", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "navigation.wizard", acceptsDataBinding: true, defaultProps: { initialStep: 0, stepper: "none", stepNavigation: "previous-and-next" } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Guiar o usuario por um fluxo multi-etapas com validacao progressiva.",
    "Organizar cadastros complexos, onboarding e configuracoes assistidas.",
    "Separar coleta de dados em passos com navegacao controlada."
  ],
  avoidUseCases: [
    "Troca simples de abas sem sequencia; nesses casos prefira PageControl.",
    "Fluxos sem navegacao guiada; nesses casos prefira formularios comuns com Panel e inputs.",
    "Dialogs curtos com uma unica acao."
  ],
  synonyms: ["wizard", "step form", "multi-step flow", "guided flow"],
  relatedEntityFields: ["steps", "wizard", "onboarding", "setup", "journey"],
  compositionHints: [
    "Usar com SgWizardPage e inputs para formularios complexos.",
    "Combinar com Button e dialogs de confirmacao quando houver etapa final de submit."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.65, date: 0, number: 0, denseLayout: 0.8 }
};
