import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.yearPartSelector",
  package: "@seedgrid/fe-components",
  exportName: "SgYearPartSelector",
  slug: "sg-year-part-selector",
  displayName: "SgYearPartSelector",
  category: "input",
  subcategory: "period",
  description:
    "Seletor de recorte de ano: o usuario escolhe ANO + RECORTE (semestre, trimestre ou bimestre) + FATIA, e o componente resolve para um intervalo real e fechado de datas. E' o irmao ABSOLUTO do SgPeriodSelector: aquele resolve presets RELATIVOS a hoje (\"este semestre\"), este resolve um recorte fixo de um ano civil informado (\"o 1o semestre DE 2024\"), que nao muda de significado com a passagem do tempo.",
  tags: ["form", "period", "year", "semester", "quarter", "bimester", "date-range", "filter", "report", "rhf"],
  capabilities: [
    "single-selection",
    "date-resolution",
    "absolute-period",
    "year-range-limits",
    "kind-filtering",
    "part-clamping",
    "leap-year-safe"
  ],
  fieldSemantics: ["dateRange", "periodFilter", "fiscalPeriod", "structuredChoice", "year"],
  props: [
    { name: "id", type: "string", default: "sg-year-part-selector", description: "Prefixo dos ids dos tres controles internos (ano, recorte, fatia). Nao e' o id de um campo unico: o componente monta tres.", semanticRole: "data", bindable: false },
    { name: "label", type: "string", description: "Rotulo exibido ao usuario.", semanticRole: "label", bindable: true },
    { name: "value", type: "YearPartValue", description: "Recorte selecionado no modo controlado: { year, kind, part }, com part em base 1 (1..2 no semestre, 1..4 no trimestre, 1..6 no bimestre).", semanticRole: "value", bindable: true },
    { name: "onChange", type: "(resolved: ResolvedYearPart) => void", description: "Callback com o recorte ja resolvido: value, label e o intervalo fechado startDate/endDate. As datas NUNCA vem nulas, diferente do ResolvedPeriod do SgPeriodSelector.", semanticRole: "event", bindable: false },
    { name: "allowedKinds", type: "YearPartKind[]", default: ["SEMESTER", "QUARTER", "BIMESTER"], description: "Recortes oferecidos no combo. Reduza a lista quando o dominio so' aceita um deles (fechamento trimestral, por exemplo); com um unico item o combo de recorte deixa de fazer sentido na tela.", semanticRole: "behavior", bindable: true },
    { name: "minYear", type: "number", default: "ano corrente - 30", description: "Primeiro ano oferecido na lista de anos.", semanticRole: "behavior", bindable: true },
    { name: "maxYear", type: "number", default: "ano corrente + 10", description: "Ultimo ano oferecido na lista de anos.", semanticRole: "behavior", bindable: true },
    { name: "locale", type: "string", default: "pt-BR", description: "Locale dos rotulos de recorte e fatia. A sigla entre parenteses acompanha o idioma: Q1..Q4 em pt-BR e en-US, T1..T4 em es, fr e pt-PT; bimestre nao tem sigla e sai sem parenteses.", semanticRole: "behavior", bindable: true },
    { name: "disabled", type: "boolean", default: false, description: "Desabilita os tres combos (ano, recorte e fatia).", semanticRole: "behavior", bindable: true },
    { name: "required", type: "boolean", default: false, description: "Marca o campo como obrigatorio.", semanticRole: "validation", bindable: true },
    { name: "className", type: "string", description: "Classes extras aplicadas ao container do campo.", semanticRole: "appearance", bindable: false }
  ],
  states: ["default", "focused", "open", "disabled", "required", "error"],
  showcase: {
    route: "/components/sg-year-part-selector",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "field.yearPartSelector",
    acceptsDataBinding: true,
    defaultProps: {
      allowedKinds: ["SEMESTER", "QUARTER", "BIMESTER"],
      locale: "pt-BR",
      disabled: false,
      required: false
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Filtro de relatorio em que o periodo e' um recorte ABSOLUTO de um ano informado: \"1o semestre de 2024\", \"Q3 de 2023\", \"4o bimestre de 2025\".",
    "Comparacao entre anos: mesma fatia, ano diferente (Q1/2024 contra Q1/2025).",
    "Fechamentos periodicos (contabil, fiscal, apuracao de metas) que sempre caem em semestre, trimestre ou bimestre cheios.",
    "Consultas a periodos historicos, em que o usuario sabe o ano e a fatia mas nao a data exata de inicio e fim."
  ],
  avoidUseCases: [
    "Periodo relativo a hoje (\"este mes\", \"ultimo trimestre\", \"ultimos 30 dias\"); use SgPeriodSelector, que reavalia a regra a cada abertura da tela.",
    "Intervalo arbitrario que nao respeita as bordas do recorte (05/03 a 17/08); use um date range ou o modo customizado do SgPeriodSelector.",
    "Recorte mensal isolado ou semana; este componente so' fatia o ano em 2, 4 ou 6 partes iguais.",
    "Selecao de uma unica data; prefira SgInputDate.",
    "Selecao apenas do ano, sem fatia; um combo simples resolve."
  ],
  synonyms: [
    "year part selector",
    "seletor de recorte de ano",
    "seletor de semestre",
    "seletor de trimestre",
    "seletor de bimestre",
    "quarter picker",
    "semester picker",
    "half-year selector",
    "fiscal period selector",
    "periodo do ano"
  ],
  relatedEntityFields: ["ano", "exercicio", "semestre", "trimestre", "bimestre", "competencia", "periodoApuracao", "dataInicio", "dataFim"],
  compositionHints: [
    "Usar como filtro superior de SgDatatable e de graficos comparativos entre anos.",
    "Colocar dentro de SgToolBar ou de um SgPanel de filtros, ao lado dos demais recortes.",
    "Quando a tela precisa dos dois modos, ofereca SgPeriodSelector para o relativo e SgYearPartSelector para o absoluto; os dois entregam startDate/endDate no mesmo formato, entao o consumidor trata os dois com o mesmo codigo.",
    "Ao trocar o recorte, a fatia fora de faixa cai para a primeira (clampYearPart); nao e' preciso tratar isso no consumidor."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0.9,
    date: 0.9,
    number: 0.3,
    denseLayout: 0.6
  }
};
