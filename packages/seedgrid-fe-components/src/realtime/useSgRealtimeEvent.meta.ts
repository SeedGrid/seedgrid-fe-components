import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "hook.realtime-event",
  package: "@seedgrid/fe-components",
  exportName: "useSgRealtimeEvent",
  slug: "use-sg-realtime-event",
  displayName: "useSgRealtimeEvent",
  category: "hook",
  subcategory: "realtime",
  description:
    "Hook que chama o handler a cada aviso do SgRealtimeProvider no channel informado cujo evento casa o padrao (nome, lista, prefixo.* ou *).",
  tags: ["hook", "realtime", "pulse", "event"],
  capabilities: ["event-subscription", "wildcard-match"],
  fieldSemantics: ["realtimeChannel", "eventPattern", "eventHandler"],
  props: [
    { name: "channel", type: "string", required: true, description: "Channel do aviso (ex.: \"backup\").", semanticRole: "data", bindable: false },
    { name: "events", type: "string | string[]", required: true, description: "Nome do evento, lista, \"prefixo.*\" ou \"*\".", semanticRole: "data", bindable: false },
    { name: "handler", type: "(event: SgRealtimeEvent) => void", required: true, description: "Chamado a cada aviso que casa.", semanticRole: "behavior", bindable: false }
  ],
  states: ["listening"],
  examples: [
    { id: "uso-basico", title: "Uso basico", file: "apps/showcase/src/app/components/hooks/use-sg-realtime-event/samples/uso-basico.tsx.sample", kind: "sample" }
  ],
  showcase: { route: "/components/hooks/use-sg-realtime-event", hasPlayground: true, hasPropsTable: true }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: ["Recarregar uma tela quando o backend avisa que um processo terminou."],
  avoidUseCases: ["Ler dados de negocio do aviso: ele so traz identificadores."],
  synonyms: ["realtime event", "pulse event", "on notice"],
  relatedEntityFields: ["channel", "event"],
  compositionHints: ["Usar dentro de um SgRealtimeProvider que assina o channel."],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0, denseLayout: 0 }
};
