import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.slider",
  package: "@seedgrid/fe-components",
  exportName: "SgSlider",
  slug: "sg-slider",
  displayName: "SgSlider",
  category: "input",
  subcategory: "slider",
  description: "Controle deslizante para ajuste numerico continuo dentro de um intervalo definido.",
  tags: ["form", "slider", "range", "numeric", "rhf"],
  capabilities: ["rhf", "continuous-value", "min-max", "step", "range-input"],
  fieldSemantics: ["rangeValue", "continuousNumber", "tuningControl", "numericAdjustment"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador unico do componente.", semanticRole: "data", bindable: false },
    { name: "minValue", type: "number", required: true, description: "Valor minimo do intervalo.", semanticRole: "validation", bindable: true },
    { name: "maxValue", type: "number", required: true, description: "Valor maximo do intervalo.", semanticRole: "validation", bindable: true },
    { name: "value", type: "number", description: "Valor atual controlado.", semanticRole: "value", bindable: true },
    { name: "step", type: "number", description: "Passo entre valores.", semanticRole: "behavior", bindable: true },
    { name: "disabled", type: "boolean", default: false, description: "Desabilita interacao.", semanticRole: "behavior", bindable: true },
    { name: "width", type: "number | string", description: "Largura do componente.", semanticRole: "appearance", bindable: true },
    { name: "onChange", type: "(value: number) => void", description: "Callback de mudanca.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "disabled", "error"],
  showcase: { route: "/components/sg-slider", hasPlayground: true, hasPropsTable: true },
  sdui: {
    rendererType: "field.slider",
    acceptsDataBinding: true,
    defaultProps: { minValue: 0, maxValue: 100, step: 1 }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Ajuste de valor em intervalo continuo.",
    "Configuracoes numericas com feedback visual.",
    "Filtros ou controles onde arrastar e melhor que digitar."
  ],
  avoidUseCases: [
    "Precisao numerica alta; nesses casos prefira SgInputNumber.",
    "Texto livre, datas ou moedas.",
    "Escolhas nominais entre opcoes discretas."
  ],
  synonyms: ["slider", "range input", "seek bar", "value slider"],
  relatedEntityFields: ["volume", "progress", "percentage", "score", "intensity"],
  compositionHints: [
    "Combinar com SgInputNumber quando o usuario precisar tanto arrastar quanto digitar.",
    "Usar em paineis de filtro e configuracao."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.2, date: 0, number: 0.9, denseLayout: 0.55 }
};
