import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "layout.stack",
  package: "@seedgrid/fe-components",
  exportName: "SgStack",
  slug: "sg-stack",
  displayName: "SgStack",
  category: "layout",
  subcategory: "stack",
  description:
    "Primitive de layout flexivel para empilhar elementos em linha ou coluna com controle de gap, alinhamento e wrap.",
  tags: ["layout", "stack", "flex", "row", "column"],
  capabilities: ["row-column-layout", "gap", "justify", "align", "wrap", "grow"],
  fieldSemantics: ["container", "linearLayout", "stackLayout", "flexLayout"],
  props: [
    {
      name: "direction",
      type: '"row" | "column"',
      default: "column",
      description: "Direcao principal do empilhamento.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "gap",
      type: "number | string",
      default: 0,
      description: "Espacamento entre os itens.",
      semanticRole: "appearance",
      bindable: true
    },
    {
      name: "justify",
      type: '"start" | "center" | "end" | "between" | "around" | "evenly"',
      default: "start",
      description: "Distribuicao dos itens no eixo principal.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "align",
      type: '"start" | "center" | "end" | "stretch"',
      default: "stretch",
      description: "Alinhamento dos itens no eixo cruzado.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "wrap",
      type: "boolean",
      default: false,
      description: "Permite quebra de linha quando necessario.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "grow",
      type: "boolean",
      default: false,
      description: "Permite que o stack cresca ocupando espaco disponivel.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "children",
      type: "ReactNode",
      description: "Itens renderizados dentro do stack.",
      semanticRole: "data",
      bindable: false
    }
  ],
  states: ["default", "row", "column", "wrapped", "growing"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-stack/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-stack/sg-stack.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-stack",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "layout.stack",
    acceptsDataBinding: true,
    defaultProps: {
      direction: "column",
      gap: 0,
      wrap: false
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Empilhar botoes, campos e blocos em linha ou coluna com espaco consistente.",
    "Criar composicoes simples e reutilizaveis dentro de cards, paineis e dialogs.",
    "Substituir CSS flex manual em cenarios comuns de alinhamento."
  ],
  avoidUseCases: [
    "Grades responsivas com varias colunas; nesses casos prefira SgGrid.",
    "Blocos com destaque visual proprio; nesses casos prefira SgCard ou SgPanel.",
    "Captura de dados ou acoes por si so; nesses casos prefira componentes especificos."
  ],
  synonyms: ["stack", "flex stack", "row/column layout", "linear container"],
  relatedEntityFields: ["actionsRow", "contentStack", "detailsColumn", "toolbarGroup"],
  compositionHints: [
    "Usar dentro de SgGrid, SgCard e SgDialog para organizar o conteudo interno.",
    "Combinar com sgInput* para layouts de formulario lineares."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.92
  }
};
