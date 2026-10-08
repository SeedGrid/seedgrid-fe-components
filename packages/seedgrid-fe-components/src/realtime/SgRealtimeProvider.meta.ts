import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "provider.realtime",
  package: "@seedgrid/fe-components",
  exportName: "SgRealtimeProvider",
  slug: "sg-realtime-provider",
  displayName: "SgRealtimeProvider",
  category: "provider",
  subcategory: "realtime",
  description:
    "Avisos em tempo real para o usuario logado pelo SeedGrid Pulse: pede o token de conexao ao backend (que o emite para o usuario da sessao), conecta direto no Pulse, reconecta sozinho, para quando a credencial e revogada e expoe o status para a tela decidir entre aviso e polling de reserva.",
  tags: ["provider", "realtime", "pulse", "websocket", "notification", "polling"],
  capabilities: ["token-from-backend", "auto-reconnect", "channel-subscription", "fallback-status"],
  fieldSemantics: ["realtimeChannels", "tokenEndpoint", "connectionStatus"],
  props: [
    { name: "channels", type: "string[]", required: true, description: "Channels que a aplicacao quer ouvir (ex.: [\"backup\"]).", semanticRole: "data", bindable: true },
    { name: "tokenEndpoint", type: "string", default: "/api/realtime/connect", description: "Rota que entrega o token de conexao do usuario logado (a BFF, na mesma origem).", semanticRole: "behavior", bindable: true },
    { name: "enabled", type: "boolean", default: true, description: "Liga/desliga (ex.: false enquanto nao ha usuario logado).", semanticRole: "behavior", bindable: true },
    { name: "children", type: "ReactNode", required: true, description: "Arvore que ouve os avisos com useSgRealtimeEvent.", semanticRole: "data", bindable: false }
  ],
  states: ["idle", "disabled", "connecting", "connected", "reconnecting", "unavailable", "auth-error"],
  examples: [
    { id: "simulador", title: "Simulador", file: "apps/showcase/src/app/components/providers/sg-realtime-provider/samples/simulador.tsx.sample", kind: "sample" },
    { id: "layout-com-bff", title: "No layout, com a BFF", file: "apps/showcase/src/app/components/providers/sg-realtime-provider/samples/layout-com-bff.tsx.sample", kind: "sample" },
    { id: "polling-de-reserva", title: "Polling de reserva", file: "apps/showcase/src/app/components/providers/sg-realtime-provider/samples/polling-de-reserva.tsx.sample", kind: "sample" }
  ],
  showcase: { route: "/components/providers/sg-realtime-provider", hasPlayground: true, hasPropsTable: true },
  sdui: {
    rendererType: "provider.realtime",
    acceptsDataBinding: true,
    defaultProps: { channels: [], tokenEndpoint: "/api/realtime/connect", enabled: true }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Avisar o usuario quando um processo demorado termina (backup, relatorio, importacao) sem polling.",
    "Atualizar uma lista quando o backend publica um evento para o usuario logado."
  ],
  avoidUseCases: [
    "Transportar dados de negocio: o aviso so leva identificadores; busque o registro pela API.",
    "Mensagens entre usuarios ou chat."
  ],
  synonyms: ["realtime provider", "pulse provider", "websocket provider", "push notifications"],
  relatedEntityFields: ["channel", "event", "userPublicId"],
  compositionHints: [
    "Montar uma vez no layout autenticado e ouvir com useSgRealtimeEvent nas telas.",
    "Usar useSgRealtimeStatus para ligar o polling de reserva quando nao estiver conectado."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0, denseLayout: 0 }
};
