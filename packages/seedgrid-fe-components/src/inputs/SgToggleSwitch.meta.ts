import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.toggle",
  package: "@seedgrid/fe-components",
  exportName: "SgToggleSwitch",
  slug: "sg-toggle-switch",
  displayName: "SgToggleSwitch",
  category: "input",
  subcategory: "toggle",
  description: "Interruptor booleano para ativar ou desativar estados, flags e configuracoes simples.",
  tags: ["form", "toggle", "switch", "boolean", "rhf"],
  capabilities: ["rhf", "boolean-value", "on-off", "visual-state"],
  fieldSemantics: ["boolean", "flag", "enabledState", "onOff"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador unico do componente.", semanticRole: "data", bindable: false },
    { name: "label", type: "string", description: "Rotulo exibido ao usuario.", semanticRole: "label", bindable: true },
    { name: "checked", type: "boolean", description: "Valor booleano atual.", semanticRole: "value", bindable: true },
    { name: "disabled", type: "boolean", default: false, description: "Desabilita interacao.", semanticRole: "behavior", bindable: true },
    { name: "readOnly", type: "boolean", default: false, description: "Permite visualizacao sem alteracao.", semanticRole: "behavior", bindable: true },
    { name: "checkedLabel", type: "string", description: "Texto exibido no estado ligado.", semanticRole: "appearance", bindable: true },
    { name: "uncheckedLabel", type: "string", description: "Texto exibido no estado desligado.", semanticRole: "appearance", bindable: true },
    { name: "onChange", type: "(checked: boolean) => void", description: "Callback de mudanca.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "checked", "unchecked", "disabled", "readOnly"],
  showcase: { route: "/components/sg-toggle-switch", hasPlayground: true, hasPropsTable: true },
  sdui: {
    rendererType: "field.toggle",
    acceptsDataBinding: true,
    defaultProps: { checked: false, disabled: false }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Flags booleanas e configuracoes simples.",
    "Estados ligado/desligado com feedback visual direto.",
    "Preferencias, ativacoes e permissoes binarias."
  ],
  avoidUseCases: [
    "Acoes imediatas; nesses casos prefira SgButton.",
    "Escolhas entre mais de dois estados.",
    "Texto livre ou numeros."
  ],
  synonyms: ["toggle", "switch", "boolean switch", "on off control"],
  relatedEntityFields: ["enabled", "active", "published", "visible", "notificationsEnabled"],
  compositionHints: [
    "Combinar com SgCheckboxGroup em telas de configuracao.",
    "Usar em formularios de preferencia e administracao."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.88, date: 0, number: 0, denseLayout: 0.78 }
};
