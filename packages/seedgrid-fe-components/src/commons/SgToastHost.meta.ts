import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "feedback.toast-host",
  package: "@seedgrid/fe-components",
  exportName: "SgToastHost",
  slug: "sg-toast-host",
  displayName: "SgToastHost",
  category: "feedback",
  subcategory: "toast-host",
  description:
    "Ponto explicito de montagem para notificacoes toast, usado quando a aplicacao precisa controlar a localizacao ativa do host.",
  tags: ["feedback", "toast", "host", "notification"],
  capabilities: ["host-priority", "toast-mount-point", "custom-positioning"],
  fieldSemantics: ["toastHost", "notificationMountPoint", "feedbackHost"],
  props: [
    { name: "position", type: '"top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center"', default: "top-right", description: "Posicao dos toasts renderizados por este host.", semanticRole: "appearance", bindable: true },
    { name: "duration", type: "number", default: 4000, description: "Duracao padrao aplicada aos toasts deste host.", semanticRole: "behavior", bindable: true },
    { name: "visibleToasts", type: "number", default: 6, description: "Quantidade maxima de toasts visiveis.", semanticRole: "behavior", bindable: true }
  ],
  states: ["inactive", "active-host"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/sg-toast-host/samples/basico.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/sg-toast-host/sg-toast-host.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/sg-toast-host", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "feedback.toast-host", acceptsDataBinding: false, defaultProps: { position: "top-right" } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Definir explicitamente onde os toasts devem aparecer na arvore da aplicacao.",
    "Priorizar um host local sobre um toaster global.",
    "Layouts que precisam controlar o mount point de notificacoes."
  ],
  avoidUseCases: [
    "Publicar notificacoes diretamente; para isso use a API `toast`.",
    "Feedback inline ou modal.",
    "Cenarios simples onde um unico SgToaster global basta."
  ],
  synonyms: ["toast host", "toast mount point", "notification host"],
  relatedEntityFields: ["toastHost", "notificationHost", "layoutToasts"],
  compositionHints: [
    "Usar com `toast` e `SgToaster` em layouts com multiplos niveis.",
    "Instalar um host por area quando a aplicacao precisar priorizar contexto local."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0, denseLayout: 0.5 }
};
