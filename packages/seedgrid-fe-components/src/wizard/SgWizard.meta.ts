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
    "Fluxo multi-etapas com stepper, validação por etapa, navegação controlada e finalização assíncrona.",
  tags: ["navigation", "wizard", "steps", "flow", "form"],
  capabilities: ["multi-step", "validation", "stepper", "previous-next", "async-finish"],
  fieldSemantics: ["wizard", "multiStepFlow", "stepForm", "guidedFlow", "journey"],
  props: [
    { name: "children", type: "ReactNode", required: true, description: "Páginas do wizard renderizadas em ordem.", semanticRole: "data", bindable: false },
    { name: "initialStep", type: "number", default: 0, description: "Índice inicial da etapa ativa.", semanticRole: "value", bindable: true },
    { name: "stepper", type: '"numbered" | "icons" | "none"', default: "none", description: "Modo visual do stepper.", semanticRole: "appearance", bindable: true },
    { name: "stepNavigation", type: '"none" | "previous" | "previous-and-next"', default: "previous-and-next", description: "Define quais etapas podem ser acessadas clicando no stepper.", semanticRole: "behavior", bindable: true },
    { name: "validateStep", type: "(stepIndex: number) => boolean | Promise<boolean>", description: "Valida a etapa atual antes de avançar.", semanticRole: "validation", bindable: false },
    { name: "onBeforeNext", type: "(index: number) => boolean | Promise<boolean>", description: "Roda ao clicar em Próximo; devolver false (ou uma Promise<false>) impede o avanço. Enquanto e aguardado, o botão fica desabilitado.", semanticRole: "validation", bindable: false },
    { name: "onBeforeFinish", type: "(index: number) => boolean | Promise<boolean>", description: "Roda ao clicar em concluir; devolver false impede a finalização.", semanticRole: "validation", bindable: false },
    { name: "nextDisabled", type: "boolean", default: false, description: "Desabilita o avanço de forma declarativa: o botão Próximo fica desabilitado e o stepper para de oferecer as etapas seguintes. Use quando o bloqueio JÁ é conhecido (ex.: uma checagem assíncrona já resolveu que a etapa não pode avançar) — onBeforeNext/validateStep só agem no clique e deixam o botão com aparência de clicável. Não afeta o botão da última etapa; para isso use onBeforeFinish.", semanticRole: "behavior", bindable: true },
    { name: "enabled", type: "boolean", default: true, description: "Quando false, o wizard inteiro fica desabilitado: Anterior, Próximo, Concluir e os passos do stepper deixam de responder; a etapa atual segue visível. Diferente de nextDisabled, que só bloqueia o avanço.", semanticRole: "behavior", bindable: true },
    { name: "onStepChange", type: "(index: number) => void", description: "Callback disparado ao trocar de etapa.", semanticRole: "event", bindable: false },
    { name: "onFinish", type: "() => void | Promise<void>", required: true, description: "Ação executada ao concluir o wizard.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "validating", "finishing", "completed"],
  examples: [
    { id: "validacao-automatica", title: "Validacao automatica", file: "apps/showcase/src/app/components/sg-wizard/samples/validacao-automatica.tsx.sample", kind: "sample" },
    { id: "validatestep", title: "validateStep", file: "apps/showcase/src/app/components/sg-wizard/samples/validatestep.tsx.sample", kind: "sample" },
    { id: "onbeforenext-async", title: "onBeforeNext assíncrono", file: "apps/showcase/src/app/components/sg-wizard/samples/onbeforenext-async.tsx.sample", kind: "sample" },
    { id: "nextdisabled", title: "Avanco bloqueado (nextDisabled)", file: "apps/showcase/src/app/components/sg-wizard/samples/nextdisabled.tsx.sample", kind: "sample" },
    { id: "stepnavigation", title: "stepNavigation", file: "apps/showcase/src/app/components/sg-wizard/samples/stepnavigation.tsx.sample", kind: "sample" },
    { id: "stepper-numerado", title: "Stepper numerado", file: "apps/showcase/src/app/components/sg-wizard/samples/stepper-numerado.tsx.sample", kind: "sample" },
    { id: "stepper-com-icones", title: "Stepper com icones", file: "apps/showcase/src/app/components/sg-wizard/samples/stepper-com-icones.tsx.sample", kind: "sample" },
    { id: "labels-customizados", title: "Labels customizados", file: "apps/showcase/src/app/components/sg-wizard/samples/labels-customizados.tsx.sample", kind: "sample" },
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
