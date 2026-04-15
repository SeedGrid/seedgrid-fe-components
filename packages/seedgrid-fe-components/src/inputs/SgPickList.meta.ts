import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.pickList",
  package: "@seedgrid/fe-components",
  exportName: "SgPickList",
  slug: "sg-pick-list",
  displayName: "SgPickList",
  category: "input",
  subcategory: "pick-list",
  description: "Lista dual para mover itens entre origem e destino com filtros e selecao.",
  tags: ["form", "picklist", "dual-list", "transfer", "rhf"],
  capabilities: ["rhf", "transfer-list", "filter", "multi-selection", "source-target"],
  fieldSemantics: ["dualSelection", "assignmentList", "sourceTargetTransfer", "membershipSelection"],
  props: [
    { name: "id", type: "string", description: "Identificador unico do componente.", semanticRole: "data", bindable: false },
    { name: "value", type: "SgPickListValue", description: "Estado atual das listas.", semanticRole: "value", bindable: true },
    { name: "sourceLabel", type: "string", description: "Rotulo da lista de origem.", semanticRole: "label", bindable: true },
    { name: "targetLabel", type: "string", description: "Rotulo da lista de destino.", semanticRole: "label", bindable: true },
    { name: "selectionMode", type: "string", description: "Modo de selecao nas listas.", semanticRole: "behavior", bindable: true },
    { name: "showFilters", type: "boolean", default: true, description: "Exibe filtros nas listas.", semanticRole: "appearance", bindable: true },
    { name: "disabled", type: "boolean", default: false, description: "Desabilita interacao.", semanticRole: "behavior", bindable: true },
    { name: "onChange", type: "(event: SgPickListChangeEvent) => void", description: "Callback ao mover itens.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "disabled", "empty"],
  showcase: { route: "/components/sg-pick-list", hasPlayground: true, hasPropsTable: true },
  sdui: {
    rendererType: "field.pickList",
    acceptsDataBinding: true,
    defaultProps: { showFilters: true }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Atribuicao de itens entre duas listas.",
    "Selecao de membros, permissoes ou recursos em destino final.",
    "Fluxos em que o conjunto escolhido precisa ser claramente separado do disponivel."
  ],
  avoidUseCases: [
    "Escolha unica ou poucas opcoes; use componentes mais simples.",
    "Ordenacao pura; nesses casos prefira SgOrderList.",
    "Texto livre ou dados numericos."
  ],
  synonyms: ["pick list", "dual list", "transfer list", "source target list"],
  relatedEntityFields: ["members", "permissions", "selectedItems", "assignedRoles", "targetItems"],
  compositionHints: [
    "Combinar com SgOrderList quando a lista final tambem precisar de ordenacao.",
    "Usar em telas administrativas e de configuracao."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.9, date: 0, number: 0, denseLayout: 0.6 }
};
