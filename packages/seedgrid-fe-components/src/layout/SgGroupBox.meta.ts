import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "layout.group-box",
  package: "@seedgrid/fe-components",
  exportName: "SgGroupBox",
  slug: "sg-group-box",
  displayName: "SgGroupBox",
  category: "layout",
  subcategory: "group-box",
  description:
    "Container simples com titulo visual para agrupar campos e conteudos relacionados em uma secao delimitada.",
  tags: ["layout", "group", "fieldset", "form-section", "container"],
  capabilities: ["grouping", "titled-section", "form-block", "sized-container"],
  fieldSemantics: ["container", "section", "formSection", "group"],
  props: [
    {
      name: "title",
      type: "string",
      required: true,
      description: "Titulo exibido no topo da secao agrupada.",
      semanticRole: "label",
      bindable: true
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: "Conteudo agrupado dentro do fieldset.",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "width",
      type: "number | string",
      description: "Largura do bloco de agrupamento.",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "height",
      type: "number | string",
      description: "Altura do bloco de agrupamento.",
      semanticRole: "behavior",
      bindable: true
    }
  ],
  states: ["default"],
  examples: [
    {
      id: "basic",
      title: "Basico",
      file: "apps/showcase/src/app/components/sg-group-box/samples/basico.tsx.sample",
      kind: "sample"
    },
    {
      id: "playground",
      title: "Playground",
      file: "apps/showcase/src/app/components/sg-group-box/sg-group-box.tsx.playground",
      kind: "playground"
    }
  ],
  showcase: {
    route: "/components/sg-group-box",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "layout.group-box",
    acceptsDataBinding: true,
    defaultProps: {
      width: "100%"
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Agrupar campos relacionados em formularios pequenos e medios.",
    "Criar secoes com titulo visivel em configuracoes, cadastro e dados pessoais.",
    "Delimitar visualmente conteudo sem adicionar comportamento complexo."
  ],
  avoidUseCases: [
    "Criar hierarquias colapsaveis; nesses casos prefira SgAccordion.",
    "Blocos com destaque visual mais rico; nesses casos prefira SgCard.",
    "Acoes e inputs isolados; nesses casos prefira componentes especificos."
  ],
  synonyms: ["group box", "fieldset", "form group", "titled section"],
  relatedEntityFields: ["addressSection", "contactSection", "profileSection", "settingsGroup"],
  compositionHints: [
    "Usar com componentes sgInput* para organizar formularios em secoes.",
    "Combinar com SgButton no rodape quando a secao tiver acoes locais."
  ],
  rankingSignals: {
    freeText: 0,
    structuredChoice: 0,
    date: 0,
    number: 0,
    denseLayout: 0.8
  }
};
