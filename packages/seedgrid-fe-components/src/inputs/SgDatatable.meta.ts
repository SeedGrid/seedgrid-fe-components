import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "data.datatable",
  package: "@seedgrid/fe-components",
  exportName: "SgDatatable",
  slug: "sg-datatable",
  displayName: "SgDatatable",
  category: "data",
  subcategory: "datatable",
  description: "Tabela de dados interativa com colunas configuraveis, paginacao, ordenacao, filtro e selecao.",
  tags: ["data", "table", "grid", "listing", "interactive"],
  capabilities: ["pagination", "sorting", "filtering", "selection", "column-config", "row-actions"],
  fieldSemantics: ["tabularData", "dataGrid", "listing", "collectionView"],
  props: [
    { name: "columns", type: "SgDatatableColumn[]", description: "Definicao das colunas da tabela.", semanticRole: "data", bindable: true },
    { name: "rows", type: "SgDatatableRow[]", description: "Linhas exibidas na tabela.", semanticRole: "value", bindable: true },
    { name: "selectionMode", type: "string", description: "Modo de selecao de linhas.", semanticRole: "behavior", bindable: true },
    { name: "loading", type: "boolean", default: false, description: "Indica estado de carregamento.", semanticRole: "appearance", bindable: true },
    { name: "paginator", type: "boolean", default: false, description: "Ativa paginacao.", semanticRole: "behavior", bindable: true },
    { name: "rowsPerPage", type: "number", description: "Quantidade de linhas por pagina.", semanticRole: "behavior", bindable: true },
    { name: "onPage", type: "(event: SgDatatablePageEvent) => void", description: "Callback de paginacao.", semanticRole: "event", bindable: false },
    { name: "onSort", type: "(event: SgDatatableSortEvent) => void", description: "Callback de ordenacao.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "loading", "empty", "filtered"],
  showcase: { route: "/components/sg-datatable", hasPlayground: true, hasPropsTable: true },
  sdui: {
    rendererType: "data.datatable",
    acceptsDataBinding: true,
    defaultProps: { paginator: false, loading: false }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Exibicao de colecoes tabulares com interacao.",
    "Listagens administrativas com filtro, ordenacao e pagina.",
    "Tabelas com acoes por linha e selecao."
  ],
  avoidUseCases: [
    "Formularios de entrada simples.",
    "Colecoes muito visuais em formato de cards.",
    "Dados pequenos onde uma lista simples basta."
  ],
  synonyms: ["datatable", "data grid", "table", "listing grid"],
  relatedEntityFields: ["rows", "records", "items", "results", "tableData"],
  compositionHints: [
    "Combinar com filtros acima da tabela usando inputs de busca e selecao.",
    "Usar com dialogs e buttons para acoes de linha."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.4, date: 0, number: 0.1, denseLayout: 0.98 }
};
