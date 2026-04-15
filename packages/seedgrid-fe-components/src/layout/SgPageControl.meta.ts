import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "navigation.page-control",
  package: "@seedgrid/fe-components",
  exportName: "SgPageControl",
  slug: "sg-page-control",
  displayName: "SgPageControl",
  category: "navigation",
  subcategory: "page-control",
  description:
    "Controle de paginas em abas para alternar entre paineis de conteudo relacionados em uma mesma area da tela.",
  tags: ["navigation", "tabs", "page-control", "panels"],
  capabilities: ["tab-navigation", "controlled-active-page", "hidden-pages", "keyboard-navigation"],
  fieldSemantics: ["tabs", "pageTabs", "panelNavigation", "sectionSwitcher"],
  props: [
    { name: "children", type: "ReactNode", required: true, description: "Paginas filhas definidas por SgPageControlPage.", semanticRole: "data", bindable: false },
    { name: "activePageId", type: "string", description: "Id da pagina ativa em modo controlado.", semanticRole: "value", bindable: true },
    { name: "activeIndex", type: "number", description: "Indice ativo em modo controlado.", semanticRole: "value", bindable: true },
    { name: "keepMounted", type: "boolean", default: false, description: "Mantem paineis inativos montados no DOM.", semanticRole: "behavior", bindable: true },
    { name: "pageControlStyle", type: '"underline" | "pills"', default: "underline", description: "Estilo visual da lista de abas.", semanticRole: "appearance", bindable: true },
    { name: "size", type: '"sm" | "md" | "lg"', default: "md", description: "Escala visual das abas.", semanticRole: "appearance", bindable: true },
    { name: "onActivePageIdChange", type: "(pageId: string, context: object) => void", description: "Callback disparado quando a pagina ativa muda.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "controlled", "keyboard-navigation"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/sg-page-control/samples/basico.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/sg-page-control/sg-page-control.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/sg-page-control", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "navigation.page-control", acceptsDataBinding: true, defaultProps: { pageControlStyle: "underline", size: "md", keepMounted: false } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Alternar entre secoes irmas como configuracoes, cadastro e detalhes.",
    "Organizar conteudo em abas sem sair da mesma tela.",
    "Substituir navegacao lateral quando o conjunto de paginas e pequeno e relacionado."
  ],
  avoidUseCases: [
    "Navegacao global de aplicacao; nesses casos prefira menu.",
    "Hierarquias profundas; nesses casos prefira breadcrumb ou tree view.",
    "Layouts permanentes sem alternancia."
  ],
  synonyms: ["tabs", "page control", "tabbed navigation", "section tabs"],
  relatedEntityFields: ["tabs", "sections", "detailsTabs", "settingsTabs"],
  compositionHints: [
    "Usar com SgPageControlPage para estruturar paineis filhos.",
    "Combinar com SgCard, SgPanel e forms multi-secao."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.1, date: 0, number: 0, denseLayout: 0.78 }
};
