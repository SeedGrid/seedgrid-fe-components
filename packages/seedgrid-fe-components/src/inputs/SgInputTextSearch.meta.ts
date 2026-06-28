import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.textsearch",
  package: "@seedgrid/fe-components",
  exportName: "SgInputTextSearch",
  slug: "sg-input-text-search",
  displayName: "SgInputTextSearch",
  category: "input",
  subcategory: "search",
  description:
    "Campo de busca que embrulha o SgInputText com debounce sem dependencia externa: onChange imediato e onSearchChange disparado apos o debounce com o termo normalizado (trim + gate por minChars).",
  tags: ["form", "search", "debounce", "text", "filter"],
  capabilities: ["debounce", "min-chars-gate", "distinct", "controlled"],
  fieldSemantics: ["freeText", "search", "filter"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador unico do campo.", semanticRole: "data", bindable: false },
    { name: "label", type: "string", description: "Rotulo exibido ao usuario.", semanticRole: "label", bindable: true },
    { name: "placeholder", type: "string", description: "Texto de apoio dentro do input.", semanticRole: "label", bindable: true },
    { name: "minChars", type: "number", default: 3, description: "Minimo de caracteres (apos trim) para disparar onSearchChange; 0 caracteres tambem dispara (limpar busca).", semanticRole: "behavior", bindable: true },
    { name: "debounceMs", type: "number", default: 350, description: "Atraso do debounce em milissegundos antes de disparar onSearchChange.", semanticRole: "behavior", bindable: true },
    { name: "onChange", type: "(value: string) => void", description: "Disparado imediatamente a cada digitacao, com o valor cru.", semanticRole: "event", bindable: false },
    { name: "onSearchChange", type: "(value: string) => void", required: true, description: "Disparado apos o debounce, com o termo normalizado.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "focused", "disabled", "error"],
  showcase: { route: "/components/sg-input-text-search", hasPlayground: false, hasPropsTable: true },
  sdui: {
    rendererType: "field.textsearch",
    acceptsDataBinding: true,
    defaultProps: { minChars: 3, debounceMs: 350 }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Campo de busca/filtro que dispara requisicoes apos o usuario parar de digitar.",
    "Filtragem de listas, tabelas ou grids com termo de pesquisa debounced.",
    "Buscas onde se quer evitar disparos a cada tecla e exigir um minimo de caracteres."
  ],
  avoidUseCases: [
    "Entrada de texto comum sem busca; nesses casos prefira SgInputText.",
    "Selecao a partir de uma lista fechada; nesses casos prefira SgAutocomplete ou SgCombobox.",
    "Busca instantanea sem debounce; nesses casos use SgInputText com onChange direto."
  ],
  synonyms: ["search input", "search field", "campo de busca", "debounced search", "filtro de busca"],
  relatedEntityFields: ["query", "search", "term", "filter", "busca"],
  compositionHints: [
    "Combinar com SgDatatable ou listas para filtrar resultados.",
    "Agrupar com SgPanel/SgToolBar em cabecalhos de listagem."
  ],
  rankingSignals: { freeText: 0.9, structuredChoice: 0.1, date: 0, number: 0, denseLayout: 0.7 }
};
