import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "navigation.wizard-page",
  package: "@seedgrid/fe-components",
  exportName: "SgWizardPage",
  slug: "sg-wizard-page",
  displayName: "SgWizardPage",
  category: "navigation",
  subcategory: "wizard-page",
  description:
    "Pagina individual dentro de um wizard, com titulo, icone e conteudo associado a uma etapa.",
  tags: ["navigation", "wizard", "step", "page", "form-step"],
  capabilities: ["step-content", "title", "icon", "wizard-children"],
  fieldSemantics: ["wizardStep", "stepPage", "guidedStep", "formStep"],
  props: [
    { name: "title", type: "string", description: "Titulo exibido no stepper do wizard.", semanticRole: "label", bindable: true },
    { name: "icon", type: "ReactNode", description: "Icone opcional exibido quando o wizard usa stepper por icones.", semanticRole: "label", bindable: true },
    { name: "children", type: "ReactNode", required: true, description: "Conteudo da etapa.", semanticRole: "data", bindable: false },
    { name: "className", type: "string", description: "Classes adicionais da etapa.", semanticRole: "appearance", bindable: true }
  ],
  states: ["default", "active", "completed"],
  examples: [{ id: "auto-validation", title: "Auto validation", file: "apps/showcase/src/app/components/sg-wizard/samples/auto-validation.tsx.sample", kind: "sample" }],
  showcase: { route: "/components/sg-wizard", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "navigation.wizard-page", acceptsDataBinding: true, defaultProps: {} }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Declarar uma etapa individual dentro de um wizard.",
    "Separar conteudo, validacao e rotulos por passo em fluxos guiados.",
    "Modelar passos com icone e titulo em journeys multi-etapas."
  ],
  avoidUseCases: [
    "Abas independentes; nesses casos prefira PageControlPage.",
    "Containers soltos fora de um Wizard.",
    "Blocos de layout sem sequencia navegacional."
  ],
  synonyms: ["wizard page", "wizard step", "step page", "form step"],
  relatedEntityFields: ["step", "page", "wizardStep", "stage"],
  compositionHints: [
    "Usar sempre como filho de SgWizard.",
    "Combinar com inputs e secoes de resumo para organizar cada etapa."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.55, date: 0, number: 0, denseLayout: 0.72 }
};
