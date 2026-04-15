import type { SgAiHintsV0, SgMetaV0 } from "../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "gadget.string-animator",
  package: "@seedgrid/fe-components",
  exportName: "SgStringAnimator",
  slug: "sg-string-animator",
  displayName: "SgStringAnimator",
  category: "gadget",
  subcategory: "text-animation",
  description:
    "Componente para animar transicao entre strings usando estilos como roller3d, flip e neon em displays textuais curtos.",
  tags: ["gadget", "string", "animation", "display", "text"],
  capabilities: ["string-transition", "multiple-animation-styles", "manual-trigger", "alignment-control"],
  fieldSemantics: ["animatedText", "labelTransition", "displayText", "headlineAnimator"],
  props: [
    { name: "sourceString", type: "string", required: true, description: "Texto inicial da animacao.", semanticRole: "value", bindable: true },
    { name: "targetString", type: "string", required: true, description: "Texto final da animacao.", semanticRole: "value", bindable: true },
    { name: "stringAnimatorStyle", type: '"roller3d" | "flip" | "neon" | "fade" | "matrix" | "discard" | "segment" | "sevenSegment"', default: "roller3d", description: "Estilo visual usado na transicao.", semanticRole: "appearance", bindable: true },
    { name: "alignTo", type: '"left" | "center" | "right"', default: "left", description: "Alinhamento do texto animado.", semanticRole: "appearance", bindable: true },
    { name: "fontSize", type: "number", default: 28, description: "Escala visual do display.", semanticRole: "appearance", bindable: true }
  ],
  states: ["idle", "animating", "completed"],
  examples: [
    { id: "roller3d", title: "Roller 3D", file: "apps/showcase/src/app/components/gadgets/sg-string-animator/samples/roller3d.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/gadgets/sg-string-animator/sg-string-animator.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/gadgets/sg-string-animator", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "gadget.string-animator", acceptsDataBinding: true, defaultProps: { stringAnimatorStyle: "roller3d", alignTo: "left", fontSize: 28 } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Animar mudanca de labels, titulos curtos e textos de destaque.",
    "Criar widgets textuais com transicao visual em dashboards e landing sections.",
    "Representar evolucao entre dois estados textuais curtos."
  ],
  avoidUseCases: [
    "Paragrafos longos ou conteudo de leitura extensa.",
    "Campos editaveis de formulario.",
    "Tabelas e listas com alto volume de linhas."
  ],
  synonyms: ["string animator", "animated text", "text transition", "display animator"],
  relatedEntityFields: ["title", "statusLabel", "headline", "label", "displayText"],
  compositionHints: [
    "Usar com SgCard e SgDashboard em secoes de destaque.",
    "Combinar com digitos animados para paineis hibridos de texto e numero."
  ],
  rankingSignals: { freeText: 0.38, structuredChoice: 0, date: 0, number: 0.12, denseLayout: 0.28 }
};
