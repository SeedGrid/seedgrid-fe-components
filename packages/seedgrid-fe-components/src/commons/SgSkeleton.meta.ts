import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "feedback.skeleton",
  package: "@seedgrid/fe-components",
  exportName: "SgSkeleton",
  slug: "sg-skeleton",
  displayName: "SgSkeleton",
  category: "feedback",
  subcategory: "skeleton",
  description:
    "Placeholder visual para estados de carregamento, simulando texto, blocos e avatares antes da chegada dos dados reais.",
  tags: ["feedback", "loading", "placeholder", "skeleton"],
  capabilities: ["loading-state", "shape-variants", "animation", "size-control"],
  fieldSemantics: ["loadingPlaceholder", "skeleton", "pendingContent", "progressiveLoading"],
  props: [
    {
      name: "shape",
      type: '"text" | "rectangle" | "rounded" | "square" | "circle"',
      default: "text",
      description: "Forma visual base do placeholder.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "animation",
      type: '"wave" | "pulse" | "none"',
      default: "wave",
      description: "Animacao aplicada ao placeholder.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "width",
      type: "number | string",
      description: "Largura do placeholder.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "height",
      type: "number | string",
      description: "Altura do placeholder.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "size",
      type: "number | string",
      description: "Tamanho unico para placeholders quadrados ou circulares.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "borderRadius",
      type: "number | string",
      description: "Raio de borda customizado.",
      semanticRole: "appearance",
      bindable: true
    }
  ],
  states: ["loading", "static"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-skeleton/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-skeleton/sg-skeleton.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-skeleton",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "feedback.skeleton",
    acceptsDataBinding: false,
    defaultProps: {
      shape: "text",
      animation: "wave"
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Representar carregamento de conteudo antes dos dados reais estarem disponiveis.",
    "Simular listas, cards, tabelas e detalhes de perfil em estado pending.",
    "Evitar layout shift durante carregamentos assíncronos."
  ],
  avoidUseCases: [
    "Exibir feedback final de erro ou sucesso; nesses casos prefira componentes de alerta ou toast.",
    "Conteudo real persistente; o skeleton e apenas placeholder.",
    "Acoes e interacoes diretas do usuario."
  ],
  synonyms: ["skeleton", "loading placeholder", "content shimmer", "loading block"],
  relatedEntityFields: ["loadingState", "pendingList", "pendingCard", "asyncPlaceholder"],
  compositionHints: [
    "Usar junto de SgCard, SgAvatar e SgDatatable para estados de carregamento.",
    "Combinar varios skeletons em SgStack e SgGrid para simular layouts completos."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.8
  }
};
