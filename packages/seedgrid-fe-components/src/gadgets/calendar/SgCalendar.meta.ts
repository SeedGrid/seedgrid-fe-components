import type { SgAiHintsV0, SgMetaV0 } from "../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "gadget.calendar",
  package: "@seedgrid/fe-components",
  exportName: "SgCalendar",
  slug: "sg-calendar",
  displayName: "SgCalendar",
  category: "gadget",
  subcategory: "calendar",
  description:
    "Calendario mensal em formato de gadget com suporte a locale, multi-mes, regras de selecao e card configuravel.",
  tags: ["gadget", "calendar", "date", "schedule", "multi-month"],
  capabilities: ["calendar-grid", "date-selection", "multi-month", "locale", "date-rules", "card-wrapper"],
  fieldSemantics: ["calendar", "datePicker", "scheduleView", "dateSelector", "monthView"],
  props: [
    { name: "value", type: "Date | string", description: "Data selecionada de forma controlada.", semanticRole: "value", bindable: true },
    { name: "viewDate", type: "Date | string", description: "Mes visivel de forma controlada.", semanticRole: "value", bindable: true },
    { name: "locale", type: "string", default: "pt-BR", description: "Locale usado para formatacao de mes e dias.", semanticRole: "behavior", bindable: true },
    { name: "weekStartsOn", type: "0 | 1 | 2 | 3 | 4 | 5 | 6", default: 0, description: "Primeiro dia da semana.", semanticRole: "behavior", bindable: true },
    { name: "numberOfMonths", type: "number", default: 1, description: "Quantidade de meses visiveis ao mesmo tempo.", semanticRole: "appearance", bindable: true },
    { name: "minDate", type: "Date | string", description: "Limite minimo de selecao.", semanticRole: "validation", bindable: true },
    { name: "maxDate", type: "Date | string", description: "Limite maximo de selecao.", semanticRole: "validation", bindable: true },
    { name: "onValueChange", type: "(date: Date) => void", description: "Callback disparado ao selecionar uma data.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "multi-month", "disabled-dates", "controlled"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/gadgets/sg-calendar/samples/basico.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/gadgets/sg-calendar/sg-calendar.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/gadgets/sg-calendar", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "gadget.calendar", acceptsDataBinding: true, defaultProps: { locale: "pt-BR", weekStartsOn: 0, numberOfMonths: 1, showTodayShortcut: true } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Exibir ou selecionar datas em um calendario mensal visivel.",
    "Montar gadgets de agenda, planeamento e navegacao temporal.",
    "Visualizar varios meses com regras de disponibilidade e locale configuravel."
  ],
  avoidUseCases: [
    "Campos compactos de data em formularios; nesses casos prefira SgInputDate.",
    "Listas ou tabelas de eventos detalhados.",
    "Numeros, moeda ou texto livre."
  ],
  synonyms: ["calendar", "month calendar", "date gadget", "schedule calendar"],
  relatedEntityFields: ["date", "calendar", "schedule", "availability", "month"],
  compositionHints: [
    "Usar com Card e Button em gadgets de agenda e dashboards.",
    "Combinar com InputDate e dialogs quando houver selecao detalhada."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.2, date: 0.96, number: 0, denseLayout: 0.68 }
};
