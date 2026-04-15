import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "navigation.page-control-page",
  package: "@seedgrid/fe-components",
  exportName: "SgPageControlPage",
  slug: "sg-page-control-page",
  displayName: "SgPageControlPage",
  category: "navigation",
  subcategory: "page-control-page",
  description:
    "Declaracao de uma pagina individual dentro de um SgPageControl, com titulo, hint, icone e conteudo associado.",
  tags: ["navigation", "tabs", "page", "step", "panel"],
  capabilities: ["tab-page", "title", "hint", "icon", "mount-control"],
  fieldSemantics: ["tabPage", "navigationPage", "stepPage", "contentPanel"],
  props: [
    { name: "id", type: "string", description: "Identificador estavel da pagina.", semanticRole: "value", bindable: true },
    { name: "title", type: "ReactNode", required: true, description: "Titulo exibido na aba da pagina.", semanticRole: "label", bindable: true },
    { name: "hint", type: "string", description: "Descricao curta associada a aba.", semanticRole: "label", bindable: true },
    { name: "icon", type: "ReactNode", description: "Icone opcional da aba.", semanticRole: "label", bindable: true },
    { name: "hidden", type: "boolean", default: false, description: "Oculta a pagina sem remove-la da estrutura.", semanticRole: "behavior", bindable: true },
    { name: "disabled", type: "boolean", default: false, description: "Desabilita a selecao da pagina.", semanticRole: "behavior", bindable: true },
    { name: "children", type: "ReactNode", required: true, description: "Conteudo exibido no painel desta pagina.", semanticRole: "data", bindable: false }
  ],
  states: ["default", "active", "hidden", "disabled"],
  examples: [{ id: "basic", title: "Basico", file: "apps/showcase/src/app/components/sg-page-control/samples/basico.tsx.sample", kind: "sample" }],
  showcase: { route: "/components/sg-page-control", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "navigation.page-control-page", acceptsDataBinding: true, defaultProps: { hidden: false, disabled: false } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Declarar paginas internas de um PageControl com conteudo associado.",
    "Separar secoes navegaveis em abas ou etapas de configuracao.",
    "Modelar paineis de conteudo com titulo, hint e icone na navegacao superior."
  ],
  avoidUseCases: [
    "Fluxos com botoes de navegacao e validacao sequencial; nesses casos prefira WizardPage.",
    "Containers independentes sem controle de abas; nesses casos prefira Panel ou Card.",
    "Menus soltos fora de PageControl."
  ],
  synonyms: ["tab page", "page control page", "navigation page", "tab panel"],
  relatedEntityFields: ["tabs", "pages", "sections", "steps", "panels"],
  compositionHints: [
    "Usar sempre como filho de SgPageControl.",
    "Combinar com icones e hints para melhorar a navegacao entre secoes."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.7, date: 0, number: 0, denseLayout: 0.75 }
};
