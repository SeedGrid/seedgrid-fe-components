import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.checkboxGroup",
  package: "@seedgrid/fe-components",
  exportName: "SgCheckboxGroup",
  slug: "sg-checkbox-group",
  displayName: "SgCheckboxGroup",
  category: "input",
  subcategory: "checkbox-group",
  description:
    "Grupo de checkboxes para multisselecao com orientacao, estilo de selecao e suporte opcional a marcar todos.",
  tags: ["form", "checkbox", "multi-select", "options", "rhf"],
  capabilities: ["rhf", "multi-selection", "check-all", "group-box", "highlight-style"],
  fieldSemantics: ["multiSelection", "optionSet", "filterOptions", "flags"],
  props: [
    { name: "title", type: "string", description: "Titulo do grupo.", semanticRole: "label", bindable: true },
    { name: "source", type: "SgCheckboxGroupOption[]", description: "Opcoes disponiveis.", semanticRole: "data", bindable: true },
    { name: "value", type: "(string | number)[]", description: "Valores selecionados.", semanticRole: "value", bindable: true },
    { name: "orientation", type: "\"horizontal\" | \"vertical\"", default: "vertical", description: "Orientacao visual do grupo.", semanticRole: "appearance", bindable: true },
    { name: "selectionStyle", type: "\"checkbox\" | \"highlight\"", default: "checkbox", description: "Estilo visual de selecao.", semanticRole: "appearance", bindable: true },
    { name: "showCheckAll", type: "boolean", default: false, description: "Exibe acao de marcar todos.", semanticRole: "behavior", bindable: true },
    { name: "required", type: "boolean", default: false, description: "Marca o grupo como obrigatorio.", semanticRole: "validation", bindable: true },
    { name: "onChange", type: "(value: (string | number)[]) => void", description: "Callback de mudanca.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "disabled", "readOnly", "error"],
  showcase: { route: "/components/sg-checkbox-group", hasPlayground: true, hasPropsTable: true },
  sdui: {
    rendererType: "field.checkboxGroup",
    acceptsDataBinding: true,
    defaultProps: { orientation: "vertical", selectionStyle: "checkbox", showCheckAll: false }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Multisselecao de opcoes independentes.",
    "Filtros com varias categorias ativas ao mesmo tempo.",
    "Configuracoes booleanas agrupadas."
  ],
  avoidUseCases: [
    "Escolha unica; nesses casos prefira SgRadioGroup ou SgCombobox.",
    "Listas muito grandes com busca; nesses casos prefira componentes de lookup.",
    "Texto livre ou dados numericos."
  ],
  synonyms: ["checkbox group", "multi select", "multiple choice", "checklist field"],
  relatedEntityFields: ["permissions", "tags", "features", "filters", "options"],
  compositionHints: [
    "Combinar com SgRadioGroup para formularios com escolhas simples e multiplas.",
    "Usar dentro de SgPanel em configuracoes e filtros."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.96, date: 0, number: 0, denseLayout: 0.68 }
};
