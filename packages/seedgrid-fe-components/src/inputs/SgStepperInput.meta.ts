import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.stepper",
  package: "@seedgrid/fe-components",
  exportName: "SgStepperInput",
  slug: "sg-stepper-input",
  displayName: "SgStepperInput",
  category: "input",
  subcategory: "stepper",
  description: "Campo numerico com botoes de incremento e decremento para ajuste discreto de quantidade.",
  tags: ["form", "stepper", "numeric", "quantity", "rhf"],
  capabilities: ["rhf", "increment-decrement", "min-max", "step", "numeric-entry"],
  fieldSemantics: ["quantity", "stepNumber", "countControl", "discreteNumber"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador unico do componente.", semanticRole: "data", bindable: false },
    { name: "minValue", type: "number", required: true, description: "Valor minimo permitido.", semanticRole: "validation", bindable: true },
    { name: "maxValue", type: "number", required: true, description: "Valor maximo permitido.", semanticRole: "validation", bindable: true },
    { name: "step", type: "number", default: 1, description: "Incremento e decremento aplicados.", semanticRole: "behavior", bindable: true },
    { name: "value", type: "number", description: "Valor atual controlado.", semanticRole: "value", bindable: true },
    { name: "readOnly", type: "boolean", default: false, description: "Permite visualizacao sem edicao direta.", semanticRole: "behavior", bindable: true },
    { name: "disabled", type: "boolean", default: false, description: "Desabilita interacao.", semanticRole: "behavior", bindable: true },
    { name: "onChange", type: "(value: number) => void", description: "Callback de mudanca.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "disabled", "readOnly", "error"],
  showcase: { route: "/components/sg-stepper-input", hasPlayground: true, hasPropsTable: true },
  sdui: {
    rendererType: "field.stepper",
    acceptsDataBinding: true,
    defaultProps: { minValue: 0, maxValue: 100, step: 1 }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Controle de quantidade com incremento discreto.",
    "Cenarios de carrinho, estoque ou contagem.",
    "Valores inteiros onde o usuario tende a usar botoes."
  ],
  avoidUseCases: [
    "Numeros decimais complexos; nesses casos prefira SgInputNumber.",
    "Texto livre, datas ou moedas.",
    "Faixas continuas; nesses casos prefira SgSlider."
  ],
  synonyms: ["stepper", "quantity input", "increment input", "counter field"],
  relatedEntityFields: ["quantity", "count", "units", "seats", "items"],
  compositionHints: [
    "Combinar com SgButton em fluxos de pedido ou configuracao.",
    "Usar ao lado de SgInputCurrency em cenarios de quantidade x preco."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.1, date: 0, number: 0.93, denseLayout: 0.6 }
};
