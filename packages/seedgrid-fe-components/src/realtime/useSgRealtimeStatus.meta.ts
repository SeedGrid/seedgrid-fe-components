import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "hook.realtime-status",
  package: "@seedgrid/fe-components",
  exportName: "useSgRealtimeStatus",
  slug: "use-sg-realtime-status",
  displayName: "useSgRealtimeStatus",
  category: "hook",
  subcategory: "realtime",
  description:
    "Hook com o estado da conexao do SgRealtimeProvider com o Pulse. connected falso indica que a tela deve usar o polling de reserva.",
  tags: ["hook", "realtime", "pulse", "status", "polling"],
  capabilities: ["connection-status", "fallback-signal"],
  fieldSemantics: ["connectionStatus", "connected"],
  props: [
    { name: "returns.status", type: "SgRealtimeStatus", description: "idle, disabled, connecting, connected, reconnecting, unavailable ou auth-error.", semanticRole: "data", bindable: false },
    { name: "returns.connected", type: "boolean", description: "true so com a conexao aberta e assinada.", semanticRole: "data", bindable: false }
  ],
  states: ["disabled", "connected", "unavailable"],
  examples: [
    { id: "uso-basico", title: "Uso basico", file: "apps/showcase/src/app/components/hooks/use-sg-realtime-status/samples/uso-basico.tsx.sample", kind: "sample" }
  ],
  showcase: { route: "/components/hooks/use-sg-realtime-status", hasPlayground: true, hasPropsTable: true }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: ["Decidir entre aviso em tempo real e polling de reserva numa tela."],
  avoidUseCases: ["Decidir permissao ou autenticacao: o status so diz da conexao com o Pulse."],
  synonyms: ["realtime status", "pulse status", "connection state"],
  relatedEntityFields: ["status"],
  compositionHints: ["Usar dentro de um SgRealtimeProvider; fora dele o status e disabled."],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0, denseLayout: 0 }
};
