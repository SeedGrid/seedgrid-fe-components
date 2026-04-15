import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.autocomplete",
  package: "@seedgrid/fe-components",
  exportName: "SgAutocomplete",
  slug: "sg-autocomplete",
  displayName: "SgAutocomplete",
  category: "input",
  subcategory: "autocomplete",
  description:
    "Campo de busca assistida com sugestoes, fonte assincrona, cache e selecao de item a partir de texto digitado.",
  tags: ["form", "autocomplete", "search", "suggestions", "rhf"],
  capabilities: ["rhf", "async-source", "search", "cache", "grouped-results", "custom-render"],
  fieldSemantics: ["searchSelection", "lookup", "entityReference", "assistedSearch"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador unico do campo.", semanticRole: "data", bindable: false },
    { name: "label", type: "string", description: "Rotulo exibido ao usuario.", semanticRole: "label", bindable: true },
    { name: "source", type: "(query: string) => Promise<T[]> | T[]", description: "Fonte de resultados para busca.", semanticRole: "data", bindable: false },
    { name: "minLengthForSearch", type: "number", description: "Quantidade minima de caracteres para buscar.", semanticRole: "behavior", bindable: true },
    { name: "delay", type: "number", description: "Debounce da pesquisa em milissegundos.", semanticRole: "behavior", bindable: true },
    { name: "maxResult", type: "number", description: "Limite de resultados exibidos.", semanticRole: "behavior", bindable: true },
    { name: "allowCustomValue", type: "boolean", default: false, description: "Permite valor fora da lista.", semanticRole: "behavior", bindable: true },
    { name: "openOnFocus", type: "boolean", default: false, description: "Abre sugestoes ao focar.", semanticRole: "behavior", bindable: true },
    { name: "onSelect", type: "(item: SgAutocompleteItem) => void", description: "Callback disparado ao selecionar item.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "focused", "open", "loading", "disabled", "error"],
  showcase: { route: "/components/sg-autocomplete", hasPlayground: true, hasPropsTable: true },
  sdui: {
    rendererType: "field.autocomplete",
    acceptsDataBinding: true,
    defaultProps: { minLengthForSearch: 2, openOnFocus: false, allowCustomValue: false }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Busca de entidades ou referencias em listas grandes.",
    "Selecao assistida com pesquisa incremental.",
    "Campos onde o usuario sabe parte do valor, mas nao a lista completa."
  ],
  avoidUseCases: [
    "Listas pequenas e fixas; nesses casos prefira SgCombobox ou SgRadioGroup.",
    "Texto livre sem sugestoes.",
    "Valores monetarios, datas ou documentos mascarados."
  ],
  synonyms: ["autocomplete", "typeahead", "search select", "lookup field"],
  relatedEntityFields: ["customer", "supplier", "city", "category", "assignee"],
  compositionHints: [
    "Combinar com SgPanel em blocos de filtros e formularios relacionais.",
    "Usar com SgButton em fluxos de busca e selecao."
  ],
  rankingSignals: { freeText: 0.35, structuredChoice: 0.9, date: 0, number: 0, denseLayout: 0.7 }
};
