import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.radioGroup",
  package: "@seedgrid/fe-components",
  exportName: "SgRadioGroup",
  slug: "sg-radio-group",
  displayName: "SgRadioGroup",
  category: "input",
  subcategory: "radio-group",
  description:
    "Grupo de radios para escolha unica com orientacao e estilo visual configuravel.",
  tags: ["form", "radio", "single-choice", "options", "rhf"],
  capabilities: ["rhf", "single-selection", "group-box", "highlight-style"],
  fieldSemantics: ["singleSelection", "optionSet", "enumChoice", "structuredChoice"],
  props: [
    { name: "title", type: "string", description: "Titulo do grupo.", semanticRole: "label", bindable: true },
    { name: "source", type: "SgRadioGroupOption[]", description: "Opcoes disponiveis.", semanticRole: "data", bindable: true },
    { name: "value", type: "string | number", description: "Valor selecionado.", semanticRole: "value", bindable: true },
    { name: "orientation", type: "\"horizontal\" | \"vertical\"", default: "vertical", description: "Orientacao visual do grupo.", semanticRole: "appearance", bindable: true },
    { name: "selectionStyle", type: "\"radio\" | \"highlight\"", default: "radio", description: "Estilo visual de selecao.", semanticRole: "appearance", bindable: true },
    { name: "required", type: "boolean", default: false, description: "Marca o grupo como obrigatorio.", semanticRole: "validation", bindable: true },
    { name: "readOnly", type: "boolean", default: false, description: "Impede alteracoes no valor.", semanticRole: "behavior", bindable: true },
    { name: "onChange", type: "(value: string | number | null) => void", description: "Callback de mudanca.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "disabled", "readOnly", "error"],
  showcase: { route: "/components/sg-radio-group", hasPlayground: true, hasPropsTable: true },
  sdui: {
    rendererType: "field.radioGroup",
    acceptsDataBinding: true,
    defaultProps: { orientation: "vertical", selectionStyle: "radio" }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Escolha unica com opcoes visiveis ao mesmo tempo.",
    "Perguntas binárias ou enumeradas com poucas alternativas.",
    "Cenarios onde a comparacao visual entre opcoes importa."
  ],
  avoidUseCases: [
    "Multisselecao; nesses casos prefira SgCheckboxGroup.",
    "Listas longas; nesses casos prefira select ou combobox.",
    "Texto livre ou valores numericos."
  ],
  synonyms: ["radio group", "single choice", "one of many", "option group"],
  relatedEntityFields: ["status", "priority", "gender", "type", "approvalMode"],
  compositionHints: [
    "Combinar com SgCheckboxGroup em formularios com diferentes tipos de escolha.",
    "Usar dentro de SgPanel para secoes de preferencia e configuracao."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.97, date: 0, number: 0, denseLayout: 0.65 }
};
