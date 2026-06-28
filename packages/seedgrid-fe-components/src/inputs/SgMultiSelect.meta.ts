import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.multiselect",
  package: "@seedgrid/fe-components",
  exportName: "SgMultiSelect",
  slug: "sg-multi-select",
  displayName: "SgMultiSelect",
  category: "input",
  subcategory: "multiselect",
  description:
    "Campo de selecao multipla no estilo select: trigger com chevron que vira check ao abrir e dropdown com checkboxes que mantem a lista aberta.",
  tags: ["form", "multiselect", "choice", "checkbox", "rhf"],
  capabilities: ["multi-selection", "search", "clearable", "max-selected", "keyboard"],
  fieldSemantics: ["structuredChoice", "multiChoice", "tags", "categories"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador unico do campo.", semanticRole: "data", bindable: false },
    { name: "label", type: "string", description: "Rotulo exibido ao usuario.", semanticRole: "label", bindable: true },
    { name: "options", type: "{ label: string; value: string | number; disabled?: boolean }[]", description: "Lista de opcoes disponiveis.", semanticRole: "data", bindable: false },
    { name: "value", type: "(string | number)[]", description: "Array de valores selecionados.", semanticRole: "value", bindable: true },
    { name: "onChange", type: "(value: (string | number)[]) => void", description: "Callback com o array atualizado de valores.", semanticRole: "event", bindable: false },
    { name: "searchable", type: "boolean", default: false, description: "Exibe campo de busca no topo do dropdown.", semanticRole: "behavior", bindable: true },
    { name: "clearable", type: "boolean", default: false, description: "Exibe botao para limpar toda a selecao.", semanticRole: "behavior", bindable: true },
    { name: "maxSelected", type: "number", description: "Limite maximo de itens selecionaveis.", semanticRole: "validation", bindable: true },
    { name: "placeholder", type: "string", description: "Texto exibido quando nada esta selecionado.", semanticRole: "label", bindable: true },
    { name: "summaryThreshold", type: "number", default: 2, description: "Quantidade de rotulos antes de mostrar 'N selecionadas'.", semanticRole: "appearance", bindable: true },
    { name: "required", type: "boolean", default: false, description: "Marca o campo como obrigatorio.", semanticRole: "validation", bindable: true },
    { name: "onEnter", type: "() => void", description: "Disparado ao focar o campo.", semanticRole: "event", bindable: false },
    { name: "onExit", type: "() => void", description: "Disparado ao sair do campo.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "focused", "open", "disabled", "error"],
  showcase: { route: "/components/sg-multi-select", hasPlayground: false, hasPropsTable: true },
  sdui: {
    rendererType: "field.multiselect",
    acceptsDataBinding: true,
    defaultProps: { searchable: false, clearable: false, summaryThreshold: 2 }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Selecao de varias opcoes a partir de uma lista fechada (ex.: empresas, categorias, tags).",
    "Filtros multi-valor em formularios e relatorios.",
    "Campos relacionais N:N em formularios CRUD."
  ],
  avoidUseCases: [
    "Escolha unica; nesses casos prefira SgCombobox ou SgRadioGroup.",
    "Listas muito grandes com busca remota assincrona; nesses casos prefira SgAutocomplete.",
    "Poucas opcoes sempre visiveis; nesses casos prefira SgCheckboxGroup."
  ],
  synonyms: ["multi select", "multiselect", "selecao multipla", "multiple choice select", "checkbox dropdown"],
  relatedEntityFields: ["empresas", "categorias", "tags", "permissoes", "roles"],
  compositionHints: [
    "Usar dentro de SgPanel ou SgGroupBox em formularios.",
    "Combinar com SgCheckboxGroup quando todas as opcoes precisam ficar sempre visiveis."
  ],
  rankingSignals: { freeText: 0.1, structuredChoice: 0.95, date: 0, number: 0, denseLayout: 0.7 }
};
