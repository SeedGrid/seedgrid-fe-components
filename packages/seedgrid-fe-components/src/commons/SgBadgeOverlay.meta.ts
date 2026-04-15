import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "feedback.badge-overlay",
  package: "@seedgrid/fe-components",
  exportName: "SgBadgeOverlay",
  slug: "sg-badge-overlay",
  displayName: "SgBadgeOverlay",
  category: "feedback",
  subcategory: "badge-overlay",
  description:
    "Wrapper para sobrepor badges e indicadores compactos sobre avatares, icones e outros elementos visuais.",
  tags: ["feedback", "badge", "overlay", "indicator"],
  capabilities: ["overlay-indicator", "badge-positioning", "status-overlay"],
  fieldSemantics: ["statusOverlay", "counterOverlay", "indicatorOverlay"],
  props: [
    { name: "children", type: "ReactNode", required: true, description: "Elemento base que recebera o badge sobreposto.", semanticRole: "data", bindable: false },
    { name: "badge", type: "ReactNode", required: true, description: "Conteudo do indicador exibido sobre o elemento base.", semanticRole: "label", bindable: true },
    { name: "placement", type: '"top-left" | "top-right" | "bottom-left" | "bottom-right" | "right" | "left" | "top" | "bottom"', default: "top-right", description: "Posicao do badge sobreposto.", semanticRole: "appearance", bindable: true }
  ],
  states: ["default"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/sg-badge-overlay/samples/basico.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/sg-badge-overlay/sg-badge-overlay.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/sg-badge-overlay", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "feedback.badge-overlay", acceptsDataBinding: true, defaultProps: { placement: "top-right" } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Adicionar contadores ou estados sobre avatares, icones e botoes.",
    "Indicar notificacoes, status online e pequenos marcadores contextuais.",
    "Sobrepor badges sem alterar a estrutura do elemento base."
  ],
  avoidUseCases: [
    "Badges independentes sem elemento base; nesses casos prefira SgBadge.",
    "Conteudo longo ou estruturas de layout.",
    "Fluxos de interacao complexos."
  ],
  synonyms: ["badge overlay", "notification overlay", "indicator overlay"],
  relatedEntityFields: ["notificationCount", "statusOverlay", "avatarStatus"],
  compositionHints: [
    "Usar com SgAvatar, SgButton e icones de menu.",
    "Combinar com SgBadge para reaproveitar o visual do indicador."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0.2, denseLayout: 0.75 }
};
