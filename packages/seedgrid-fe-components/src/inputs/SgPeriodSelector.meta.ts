import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.periodSelector",
  package: "@seedgrid/fe-components",
  exportName: "SgPeriodSelector",
  slug: "sg-period-selector",
  displayName: "SgPeriodSelector",
  category: "input",
  subcategory: "period",
  description:
    "Seletor de periodos pre-definidos (Este mes, Ultimo trimestre, etc.) que resolve a regra temporal para um intervalo real de datas.",
  tags: ["form", "period", "date-range", "filter", "report", "rhf"],
  capabilities: ["single-selection", "grouped-results", "date-resolution", "custom-range"],
  fieldSemantics: ["dateRange", "periodFilter", "structuredChoice"],
  props: [
    { name: "id", type: "string", description: "Identificador unico do campo.", semanticRole: "data", bindable: false },
    { name: "label", type: "string", description: "Rotulo exibido ao usuario.", semanticRole: "label", bindable: true },
    { name: "value", type: "PeriodPreset", description: "Preset selecionado (modo controlado).", semanticRole: "value", bindable: true },
    { name: "onChange", type: "(period: ResolvedPeriod) => void", description: "Callback com o preset e intervalo resolvido.", semanticRole: "event", bindable: false },
    { name: "permitPast", type: "boolean", default: true, description: "Habilita o grupo de periodos passados.", semanticRole: "behavior", bindable: true },
    { name: "permitCurrent", type: "boolean", default: true, description: "Habilita o grupo de periodos atuais.", semanticRole: "behavior", bindable: true },
    { name: "permitFuture", type: "boolean", default: true, description: "Habilita o grupo de periodos futuros.", semanticRole: "behavior", bindable: true },
    { name: "permitAll", type: "boolean", default: true, description: "Habilita a opcao Todos (sem limites de data).", semanticRole: "behavior", bindable: true },
    { name: "allowCustomPeriod", type: "boolean", default: true, description: "Habilita a opcao Periodo (intervalo customizado).", semanticRole: "behavior", bindable: true },
    { name: "locale", type: "string", default: "pt-BR", description: "Locale usado nos labels e formatacao.", semanticRole: "behavior", bindable: true },
    { name: "minDate", type: "Date", description: "Limite inferior aplicado como clamp no intervalo.", semanticRole: "behavior", bindable: true },
    { name: "maxDate", type: "Date", description: "Limite superior aplicado como clamp no intervalo.", semanticRole: "behavior", bindable: true }
  ],
  states: ["default", "focused", "open", "disabled", "error", "custom-range"],
  showcase: { route: "/components/sg-period-selector", hasPlayground: false, hasPropsTable: true },
  sdui: {
    rendererType: "field.periodSelector",
    acceptsDataBinding: true,
    defaultProps: { permitPast: true, permitCurrent: true, permitFuture: true, permitAll: true, allowCustomPeriod: true, locale: "pt-BR" }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Filtros de periodo em relatorios, dashboards e telas financeiras.",
    "Escolha rapida de intervalos recorrentes (Este mes, Ultimo trimestre, Este ano).",
    "Substituir dois date pickers quando a maioria dos filtros e por regra temporal."
  ],
  avoidUseCases: [
    "Selecao de uma unica data especifica; prefira SgInputDate.",
    "Intervalos totalmente arbitrarios sem presets; use um date range dedicado.",
    "Selecao de horario/hora do dia."
  ],
  synonyms: ["period selector", "date range preset", "seletor de periodo", "filtro de periodo", "period filter"],
  relatedEntityFields: ["periodo", "dataInicio", "dataFim", "competencia", "vencimento"],
  compositionHints: [
    "Combinar com SgDatatable e graficos como filtro superior.",
    "Usar dentro de SgToolBar ou SgPanel de filtros."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.85, date: 0.95, number: 0, denseLayout: 0.7 }
};
