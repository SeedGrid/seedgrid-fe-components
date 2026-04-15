import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "feedback.toaster",
  package: "@seedgrid/fe-components",
  exportName: "SgToaster",
  slug: "sg-toaster",
  displayName: "SgToaster",
  category: "feedback",
  subcategory: "toaster",
  description:
    "Host visual de notificacoes toast globais, com controle de posicao, duracao, quantidade visivel e estilos ricos.",
  tags: ["feedback", "toast", "notification", "toaster"],
  capabilities: ["toast-hosting", "global-feedback", "positioning", "duration-control", "rich-colors"],
  fieldSemantics: ["toastContainer", "notificationFeedback", "globalFeedback"],
  props: [
    { name: "position", type: '"top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center"', default: "top-right", description: "Posicao global do stack de toasts.", semanticRole: "appearance", bindable: true },
    { name: "duration", type: "number", default: 4000, description: "Duracao padrao dos toasts em milissegundos.", semanticRole: "behavior", bindable: true },
    { name: "visibleToasts", type: "number", default: 6, description: "Quantidade maxima de toasts visiveis simultaneamente.", semanticRole: "behavior", bindable: true },
    { name: "closeButton", type: "boolean", default: true, description: "Exibe botao de fechar em cada toast.", semanticRole: "appearance", bindable: true },
    { name: "richColors", type: "boolean", default: true, description: "Ativa paleta visual rica por tipo de toast.", semanticRole: "appearance", bindable: true }
  ],
  states: ["idle", "showing-toasts"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/sg-toaster/samples/basico.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/sg-toaster/sg-toaster.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/sg-toaster", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "feedback.toaster", acceptsDataBinding: false, defaultProps: { position: "top-right", duration: 4000, visibleToasts: 6 } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Exibir feedback global leve e nao bloqueante para sucesso, erro e informacao.",
    "Notificar operacoes assincronas sem interromper o fluxo do usuario.",
    "Centralizar a renderizacao de toasts em uma aplicacao."
  ],
  avoidUseCases: [
    "Confirmacoes criticas; nesses casos prefira SgConfirmationDialog.",
    "Conteudo modal ou detalhado; nesses casos prefira SgDialog.",
    "Status persistentes dentro do layout; nesses casos prefira badge ou whistle."
  ],
  synonyms: ["toaster", "toast container", "toast notifications"],
  relatedEntityFields: ["notifications", "toastFeedback", "globalMessages"],
  compositionHints: [
    "Usar com a API `toast` para publicar mensagens.",
    "Combinar com SgToastHost quando for preciso controlar o ponto de renderizacao."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0, denseLayout: 0.6 }
};
