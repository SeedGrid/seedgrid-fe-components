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
  description: "Tabela de dados interativa com colunas configuraveis, paginacao, ordenacao, filtro, selecao e persistencia de layout de colunas. Em celular vira lista de cartoes automaticamente (mobileMode omitido = automatico).",
  tags: ["data", "table", "grid", "listing", "interactive"],
  capabilities: ["pagination", "sorting", "filtering", "selection", "column-config", "column-layout-persistence", "row-actions", "mobile-cards"],
  fieldSemantics: ["tabularData", "dataGrid", "listing", "collectionView"],
  props: [
    { name: "id", type: "string", description: "Identificador da tabela usado para DOM e persistencia do layout de colunas.", semanticRole: "data", bindable: true },
    { name: "columns", type: "SgDatatableColumn[]", description: "Definicao das colunas da tabela.", semanticRole: "data", bindable: true },
    { name: "rows", type: "number", description: "Linhas por pagina quando a paginacao esta ativa (os dados vao em value).", semanticRole: "behavior", bindable: true },
    { name: "selectionMode", type: "\"single\" | \"multiple\"", description: "Modo de selecao de linhas.", semanticRole: "behavior", bindable: true },
    { name: "loading", type: "boolean", default: false, description: "Indica estado de carregamento.", semanticRole: "appearance", bindable: true },
    { name: "mobileMode", type: "\"scroll\" | \"cards\"", default: "(omitido = automatico)", description: "Comportamento em tela estreita. Omitido (padrao): cartoes quando o container fica abaixo de 600 px, tabela acima; cards: forca cartoes em qualquer largura; scroll: forca a tabela com rolagem horizontal. Nos cartoes mantem ordenacao, selecao, acoes, rodape e paginacao.", semanticRole: "behavior", bindable: true },
    { name: "infiniteScroll", type: "boolean", default: "(true nos cartoes, false na tabela)", description: "Rolagem infinita: sem paginador, ao chegar perto do fim da lista avanca a pagina (rows) e acrescenta os proximos registros, com indicador de carregando e de fim da lista. Padrao ligado quando a lista e exibida como cartoes (abaixo de 600 px no modo automatico) e desligado na tabela. Exige paginator. Com lazy, o pai acrescenta a proxima pagina a value (first/rows/page vem em onPage/onLoadMore).", semanticRole: "behavior", bindable: true },
    { name: "onLoadMore", type: "(event: SgDatatablePageEvent) => void", description: "Chamado (alem de onPage) quando a rolagem infinita pede a proxima pagina.", semanticRole: "event", bindable: false },
    { name: "paginator", type: "boolean", default: false, description: "Ativa paginacao.", semanticRole: "behavior", bindable: true },
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
    "Tabelas com acoes por linha e selecao.",
    "Listagens que precisam funcionar em celular: por padrao (mobileMode omitido) a tabela vira cartoes abaixo de 600 px; use \"scroll\" para forcar a tabela."
  ],
  avoidUseCases: [
    "Formularios de entrada simples.",
    "Colecoes muito visuais em formato de cards.",
    "Dados pequenos onde uma lista simples basta."
  ],
  synonyms: ["datatable", "tabela no celular", "tabela responsiva", "data grid", "table", "listing grid", "tabela mobile", "lista de cartoes", "cards no celular", "responsive table", "mobile table"],
  relatedEntityFields: ["rows", "records", "items", "results", "tableData"],
  compositionHints: [
    "Combinar com filtros acima da tabela usando inputs de busca e selecao.",
    "Usar com dialogs e buttons para acoes de linha."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.4, date: 0, number: 0.1, denseLayout: 0.98 }
};
