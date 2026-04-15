import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.rating",
  package: "@seedgrid/fe-components",
  exportName: "SgRating",
  slug: "sg-rating",
  displayName: "SgRating",
  category: "input",
  subcategory: "rating",
  description: "Controle de avaliacao ordinal para notas, estrelas e feedback rapido do usuario.",
  tags: ["form", "rating", "stars", "feedback", "rhf"],
  capabilities: ["rhf", "ordinal-value", "visual-rating", "icons"],
  fieldSemantics: ["rating", "score", "reviewScore", "ordinalFeedback"],
  props: [
    { name: "id", type: "string", description: "Identificador unico do componente.", semanticRole: "data", bindable: false },
    { name: "label", type: "string", description: "Rotulo do campo.", semanticRole: "label", bindable: true },
    { name: "value", type: "number", description: "Nota atual.", semanticRole: "value", bindable: true },
    { name: "max", type: "number", description: "Quantidade maxima de itens de avaliacao.", semanticRole: "validation", bindable: true },
    { name: "readOnly", type: "boolean", default: false, description: "Impede alteracao da nota.", semanticRole: "behavior", bindable: true },
    { name: "disabled", type: "boolean", default: false, description: "Desabilita interacao.", semanticRole: "behavior", bindable: true },
    { name: "size", type: "string", description: "Tamanho visual do controle.", semanticRole: "appearance", bindable: true },
    { name: "onChange", type: "(value: number | null) => void", description: "Callback de mudanca.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "disabled", "readOnly", "error"],
  showcase: { route: "/components/sg-rating", hasPlayground: true, hasPropsTable: true },
  sdui: {
    rendererType: "field.rating",
    acceptsDataBinding: true,
    defaultProps: { max: 5, readOnly: false }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Coleta de nota ou avaliacao visual.",
    "Pesquisas rapidas de satisfacao.",
    "Feedback com escala pequena e intuitiva."
  ],
  avoidUseCases: [
    "Precisao numerica de negocio; nesses casos prefira inputs numericos.",
    "Texto livre de comentario; use componente complementar.",
    "Escolhas nominais ou filtros complexos."
  ],
  synonyms: ["rating", "stars", "score", "review rating"],
  relatedEntityFields: ["rating", "score", "satisfaction", "reviewScore", "stars"],
  compositionHints: [
    "Combinar com SgInputTextArea para feedback detalhado.",
    "Usar em formularios de avaliacao e pesquisa."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.55, date: 0, number: 0.7, denseLayout: 0.7 }
};
