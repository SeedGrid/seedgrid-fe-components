import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.combobox",
  package: "@seedgrid/fe-components",
  exportName: "SgCombobox",
  slug: "sg-combobox",
  displayName: "SgCombobox",
  category: "input",
  subcategory: "combobox",
  description:
    "Campo de escolha assistida que combina digitacao e selecao de item com suporte a fonte local ou remota.",
  tags: ["form", "combobox", "choice", "lookup", "rhf"],
  capabilities: ["search", "single-selection", "async-source", "custom-render", "grouped-results"],
  fieldSemantics: ["structuredChoice", "lookup", "entityReference", "searchSelection"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador unico do campo.", semanticRole: "data", bindable: false },
    { name: "label", type: "string", description: "Rotulo exibido ao usuario.", semanticRole: "label", bindable: true },
    { name: "source", type: "T[] | ((query: string) => Promise<T[]> | T[])", description: "Fonte de itens.", semanticRole: "data", bindable: false },
    { name: "value", type: "string | number | null", description: "Valor selecionado.", semanticRole: "value", bindable: true },
    { name: "grouped", type: "boolean", default: false, description: "Agrupa resultados por categoria.", semanticRole: "appearance", bindable: true },
    { name: "openOnFocus", type: "boolean", default: false, description: "Abre lista ao focar.", semanticRole: "behavior", bindable: true },
    { name: "loadingText", type: "string", description: "Texto exibido durante carregamento.", semanticRole: "appearance", bindable: true },
    { name: "onValueChange", type: "(value: string | number | null) => void", description: "Callback de mudanca de valor.", semanticRole: "event", bindable: false },
    { name: "onSelect", type: "(value: T) => void", description: "Callback ao selecionar item.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "focused", "open", "loading", "disabled", "error"],
  showcase: { route: "/components/sg-combobox", hasPlayground: true, hasPropsTable: true },
  sdui: {
    rendererType: "field.combobox",
    acceptsDataBinding: true,
    defaultProps: { grouped: false, openOnFocus: false }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Escolha unica com busca assistida em listas medias ou grandes.",
    "Campos relacionais em formularios CRUD.",
    "Selecao com melhor UX do que um select nativo."
  ],
  avoidUseCases: [
    "Listas muito pequenas e fixas; nesses casos prefira SgRadioGroup ou SgCheckboxGroup conforme o caso.",
    "Texto livre sem expectativa de selecao.",
    "Multisselecao; nesses casos prefira outros componentes especializados."
  ],
  synonyms: ["combobox", "searchable select", "lookup combo", "assisted select"],
  relatedEntityFields: ["status", "role", "category", "city", "owner"],
  compositionHints: [
    "Combinar com SgAutocomplete quando houver campos de lookup com requisitos diferentes.",
    "Usar dentro de SgPanel em formularios relacionais."
  ],
  rankingSignals: { freeText: 0.2, structuredChoice: 0.95, date: 0, number: 0, denseLayout: 0.72 }
};
