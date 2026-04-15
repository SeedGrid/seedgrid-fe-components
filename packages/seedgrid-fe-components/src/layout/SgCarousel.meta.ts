import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "layout.carousel",
  package: "@seedgrid/fe-components",
  exportName: "SgCarousel",
  slug: "sg-carousel",
  displayName: "SgCarousel",
  category: "layout",
  subcategory: "carousel",
  description:
    "Componente de navegacao sequencial para colecoes visuais com autoplay, navegadores e indicadores.",
  tags: ["layout", "carousel", "slider", "gallery"],
  capabilities: ["sequential-navigation", "autoplay", "indicators", "orientation", "circular-loop"],
  fieldSemantics: ["carousel", "gallery", "sequentialContent", "slidingCollection"],
  props: [
    { name: "items", type: "ReactNode[]", required: true, description: "Colecao de slides renderizados.", semanticRole: "data", bindable: true },
    { name: "numVisible", type: "number", default: 1, description: "Quantidade de itens visiveis simultaneamente.", semanticRole: "behavior", bindable: true },
    { name: "numScroll", type: "number", default: 1, description: "Quantidade de itens avancados por interacao.", semanticRole: "behavior", bindable: true },
    { name: "orientation", type: '"horizontal" | "vertical"', default: "horizontal", description: "Orientacao do fluxo do carousel.", semanticRole: "behavior", bindable: true },
    { name: "circular", type: "boolean", default: true, description: "Permite loop continuo dos itens.", semanticRole: "behavior", bindable: true },
    { name: "autoPlay", type: "boolean", default: false, description: "Ativa reproducao automatica do carousel.", semanticRole: "behavior", bindable: true },
    { name: "showIndicators", type: "boolean", default: true, description: "Exibe indicadores de pagina.", semanticRole: "appearance", bindable: true }
  ],
  states: ["idle", "sliding", "autoplay"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/sg-carousel/samples/basico.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/sg-carousel/sg-carousel.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/sg-carousel", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "layout.carousel", acceptsDataBinding: true, defaultProps: { numVisible: 1, numScroll: 1, orientation: "horizontal" } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Exibir galerias, destaques, banners e colecoes navegaveis por deslize.",
    "Rotacionar conteudo visual ou promocional em espacos limitados.",
    "Apresentar grupos de cards ou imagens em navegacao sequencial."
  ],
  avoidUseCases: [
    "Listas completas sempre visiveis; nesses casos prefira grid ou stack.",
    "Navegacao hierarquica de paginas.",
    "Conteudo de formulario e captura de dados."
  ],
  synonyms: ["carousel", "slider", "gallery slider", "content rotator"],
  relatedEntityFields: ["banners", "highlights", "gallery", "slides"],
  compositionHints: [
    "Usar com SgCard e SgBadge para destaque de itens visuais.",
    "Combinar com SgScreen e SgPanel em landing pages e dashboards."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0, denseLayout: 0.72 }
};
