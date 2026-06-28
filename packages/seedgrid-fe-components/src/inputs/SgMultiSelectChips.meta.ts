import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.multiselectchips",
  package: "@seedgrid/fe-components",
  exportName: "SgMultiSelectChips",
  slug: "sg-multi-select-chips",
  displayName: "SgMultiSelectChips",
  category: "input",
  subcategory: "multiselect",
  description:
    "Variante do multi-select onde os itens selecionados viram chips removiveis no trigger; o dropdown com checkboxes e a busca sao iguais ao SgMultiSelect.",
  tags: ["form", "multiselect", "chips", "tags", "checkbox", "rhf"],
  capabilities: ["multi-selection", "chips", "search", "clearable", "max-selected", "keyboard"],
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
    { name: "required", type: "boolean", default: false, description: "Marca o campo como obrigatorio.", semanticRole: "validation", bindable: true },
    { name: "onEnter", type: "() => void", description: "Disparado ao focar o campo.", semanticRole: "event", bindable: false },
    { name: "onExit", type: "() => void", description: "Disparado ao sair do campo.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "focused", "open", "disabled", "error"],
  showcase: { route: "/components/sg-multi-select-chips", hasPlayground: false, hasPropsTable: true },
  sdui: {
    rendererType: "field.multiselectchips",
    acceptsDataBinding: true,
    defaultProps: { searchable: false, clearable: false }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Selecao de varias opcoes onde e util ver e remover cada item escolhido individualmente (ex.: tags, destinatarios, empresas).",
    "Filtros multi-valor em que o usuario precisa enxergar tudo o que ja selecionou.",
    "Campos relacionais N:N em formularios CRUD com poucos itens visiveis por vez."
  ],
  avoidUseCases: [
    "Escolha unica; nesses casos prefira SgCombobox ou SgRadioGroup.",
    "Selecoes muito numerosas onde os chips ocupariam espaco demais; nesses casos prefira SgMultiSelect (resumo 'N selecionadas').",
    "Listas com busca remota assincrona; nesses casos prefira SgAutocomplete."
  ],
  synonyms: ["multi select chips", "multiselect tags", "selecao multipla com chips", "tag input select", "chips dropdown"],
  relatedEntityFields: ["empresas", "categorias", "tags", "permissoes", "roles", "destinatarios"],
  compositionHints: [
    "Usar dentro de SgPanel ou SgGroupBox em formularios.",
    "Preferir a SgMultiSelect quando o numero de selecoes for grande e os chips poluirem o layout."
  ],
  rankingSignals: { freeText: 0.1, structuredChoice: 0.95, date: 0, number: 0, denseLayout: 0.6 }
};
