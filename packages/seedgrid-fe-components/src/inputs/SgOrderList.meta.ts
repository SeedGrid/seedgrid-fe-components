import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "form.input.orderList",
  package: "@seedgrid/fe-components",
  exportName: "SgOrderList",
  slug: "sg-order-list",
  displayName: "SgOrderList",
  category: "input",
  subcategory: "order-list",
  description: "Lista ordenavel para reordenacao manual de itens com selecao e controles de movimento.",
  tags: ["form", "ordering", "list", "priority", "rhf"],
  capabilities: ["rhf", "reordering", "selection", "drag-drop", "list-controls"],
  fieldSemantics: ["orderedCollection", "priorityList", "rankingList", "manualOrdering"],
  props: [
    { name: "title", type: "string", description: "Titulo do grupo.", semanticRole: "label", bindable: true },
    { name: "source", type: "SgOrderListItem[]", description: "Itens de origem.", semanticRole: "data", bindable: true },
    { name: "value", type: "SgOrderListItem[]", description: "Itens na ordem atual.", semanticRole: "value", bindable: true },
    { name: "selectionMode", type: "\"single\" | \"multiple\"", default: "single", description: "Modo de selecao.", semanticRole: "behavior", bindable: true },
    { name: "showControls", type: "boolean", default: true, description: "Exibe botoes de ordenacao.", semanticRole: "appearance", bindable: true },
    { name: "draggable", type: "boolean", default: false, description: "Permite arrastar itens.", semanticRole: "behavior", bindable: true },
    { name: "disabled", type: "boolean", default: false, description: "Desabilita interacao.", semanticRole: "behavior", bindable: true },
    { name: "onChange", type: "(items: SgOrderListItem[]) => void", description: "Callback ao alterar a ordem.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "disabled", "readOnly", "empty"],
  showcase: { route: "/components/sg-order-list", hasPlayground: true, hasPropsTable: true },
  sdui: {
    rendererType: "field.orderList",
    acceptsDataBinding: true,
    defaultProps: { selectionMode: "single", showControls: true, draggable: false }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Ordenacao manual de prioridades, etapas ou itens.",
    "Listas em que a ordem final tem significado de negocio.",
    "Configuracoes onde o usuario precisa reorganizar uma colecao."
  ],
  avoidUseCases: [
    "Escolha simples sem necessidade de ordenacao.",
    "Transferencia entre duas listas; nesses casos prefira SgPickList.",
    "Tabelas grandes; nesses casos prefira componentes de dados."
  ],
  synonyms: ["order list", "sortable list", "priority list", "ranking list"],
  relatedEntityFields: ["priorities", "steps", "orderedItems", "ranking", "sequence"],
  compositionHints: [
    "Combinar com SgPickList quando o fluxo exigir selecao e depois ordenacao.",
    "Usar em paineis de configuracao de preferencia."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.82, date: 0, number: 0.1, denseLayout: 0.62 }
};
