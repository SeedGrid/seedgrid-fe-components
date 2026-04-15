import type { SgAiHintsV0, SgMetaV0 } from "../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "gadget.clock",
  package: "@seedgrid/fe-components",
  exportName: "SgClock",
  slug: "sg-clock",
  displayName: "SgClock",
  category: "gadget",
  subcategory: "clock",
  description:
    "Relogio analogico ou digital com multiplos estilos visuais, timezone, formato 12h/24h e temas.",
  tags: ["gadget", "clock", "time", "timezone", "digital", "analog"],
  capabilities: ["analog-clock", "digital-clock", "themes", "timezone", "format-12h-24h", "card-wrapper"],
  fieldSemantics: ["clock", "timeDisplay", "timezoneClock", "digitalClock", "analogClock"],
  props: [
    { name: "clockStyle", type: '"digital" | "analog"', default: "digital", description: "Modo principal de exibicao do relogio.", semanticRole: "appearance", bindable: true },
    { name: "digitalStyle", type: '"default" | "segment" | "sevenSegment" | "roller3d" | "flip" | "fade" | "matrix" | "neon" | "discard"', default: "default", description: "Estilo visual do relogio digital.", semanticRole: "appearance", bindable: true },
    { name: "timezone", type: "string", description: "Timezone usada no calculo da hora exibida.", semanticRole: "behavior", bindable: true },
    { name: "format", type: '"12h" | "24h"', default: "24h", description: "Formato horario do relogio.", semanticRole: "behavior", bindable: true },
    { name: "showSeconds", type: "boolean", default: true, description: "Exibe ou oculta os segundos.", semanticRole: "appearance", bindable: true },
    { name: "themeId", type: "string", description: "Tema visual aplicado ao relogio.", semanticRole: "appearance", bindable: true },
    { name: "size", type: '"sm" | "md" | "lg" | number', default: "md", description: "Escala visual do relogio.", semanticRole: "appearance", bindable: true }
  ],
  states: ["default", "analog", "digital", "themed", "provider-driven"],
  examples: [
    { id: "roller-3d", title: "Roller 3D", file: "apps/showcase/src/app/components/gadgets/sg-clock/samples/roller-3d.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/gadgets/sg-clock/sg-clock.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/gadgets/sg-clock", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "gadget.clock", acceptsDataBinding: true, defaultProps: { clockStyle: "digital", digitalStyle: "default", format: "24h", showSeconds: true } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Exibir hora atual em dashboards, paredes operacionais e gadgets de status.",
    "Mostrar timezones diferentes em paineis internacionais ou de suporte.",
    "Criar widgets visuais com estilos digitais ou analogicos customizados."
  ],
  avoidUseCases: [
    "Entrada de hora pelo usuario; nesses casos use componente de input apropriado.",
    "Calendarios mensais e selecao de datas; nesses casos prefira SgCalendar ou SgInputDate.",
    "Numeros ou KPIs sem semantica temporal."
  ],
  synonyms: ["clock", "time widget", "digital clock", "analog clock", "timezone clock"],
  relatedEntityFields: ["time", "timezone", "clock", "currentTime", "worldClock"],
  compositionHints: [
    "Usar com SgClockThemeProvider e SgClockThemePicker para temas visuais.",
    "Combinar com Card, Dashboard e outros gadgets em paineis operacionais."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0.82, number: 0, denseLayout: 0.74 }
};
