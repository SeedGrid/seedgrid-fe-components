import type { SgAiHintsV0, SgMetaV0 } from "../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "provider.time",
  package: "@seedgrid/fe-components",
  exportName: "SgTimeProvider",
  slug: "sg-time-provider",
  displayName: "SgTimeProvider",
  category: "provider",
  subcategory: "time",
  description:
    "Provider de tempo sincronizado com o servidor, usado para clocks e gadgets temporais com atualizacao em tick controlado.",
  tags: ["provider", "time", "clock", "server-sync", "context"],
  capabilities: ["server-time-sync", "tick-context", "nowMs-provider", "hydration-aligned-updates"],
  fieldSemantics: ["timeProvider", "serverSyncedTime", "clockContext"],
  props: [
    { name: "initialServerTime", type: "string", required: true, description: "Timestamp inicial do servidor em formato ISO 8601.", semanticRole: "value", bindable: true },
    { name: "children", type: "ReactNode", required: true, description: "Arvore que vai consumir tempo sincronizado via useSgTime.", semanticRole: "data", bindable: false }
  ],
  states: ["default", "hydrating", "tick-updating", "fallback-without-provider"],
  examples: [
    { id: "basic", title: "Uso basico", file: "apps/showcase/src/app/components/providers/sg-time-provider/samples/uso-basico.tsx.sample", kind: "sample" },
    { id: "nextjs", title: "Integracao com Next.js", file: "apps/showcase/src/app/components/providers/sg-time-provider/samples/integracao-com-nextjs.tsx.sample", kind: "sample" }
  ],
  showcase: { route: "/components/providers/sg-time-provider", hasPlayground: false, hasPropsTable: true },
  sdui: {
    rendererType: "provider.time",
    acceptsDataBinding: true,
    defaultProps: { initialServerTime: "1970-01-01T00:00:00.000Z" }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Sincronizar clocks e gadgets com o tempo do servidor em interfaces reativas.",
    "Evitar drift entre SSR e cliente em exibicoes de tempo vivo.",
    "Fornecer contexto temporal compartilhado para subtrees com relogios ou widgets sincronizados."
  ],
  avoidUseCases: [
    "Selecao de data ou hora pelo usuario; nesses casos prefira inputs temporais.",
    "Formatacao isolada de datas sem necessidade de contexto compartilhado.",
    "Persistencia ou configuracao de ambiente sem relacao com tempo."
  ],
  synonyms: ["time provider", "server time context", "clock time provider", "synced time provider"],
  relatedEntityFields: ["serverTime", "now", "tick", "currentTime", "clockContext"],
  compositionHints: [
    "Usar com SgClock e outros gadgets temporais que dependem de nowMs.",
    "Combinar com SgClockThemeProvider em showcases ou dashboards de tempo."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0.88, number: 0, denseLayout: 0.66 }
};
