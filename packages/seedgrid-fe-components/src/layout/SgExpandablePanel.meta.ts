import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "layout.expandable-panel",
  package: "@seedgrid/fe-components",
  exportName: "SgExpandablePanel",
  slug: "sg-expandable-panel",
  displayName: "SgExpandablePanel",
  category: "layout",
  subcategory: "expandable-panel",
  description:
    "Painel expansivel inline ou overlay, com direcao, tamanho, backdrop e comportamento de foco configuraveis.",
  tags: ["layout", "panel", "expandable", "drawer", "overlay"],
  capabilities: ["inline-overlay", "directional-expansion", "resizable", "backdrop", "focus-trap"],
  fieldSemantics: ["container", "drawerPanel", "expandableRegion", "overlayPanel"],
  props: [
    { name: "children", type: "ReactNode", required: true, description: "Conteudo principal do painel.", semanticRole: "data", bindable: false },
    { name: "open", type: "boolean", description: "Controla a abertura do painel.", semanticRole: "value", bindable: true },
    { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback disparado ao abrir ou fechar o painel.", semanticRole: "event", bindable: false },
    { name: "expandTo", type: '"left" | "right" | "top" | "bottom"', required: true, description: "Direcao para a qual o painel se expande.", semanticRole: "behavior", bindable: true },
    { name: "mode", type: '"inline" | "overlay"', default: "inline", description: "Modo de renderizacao do painel.", semanticRole: "behavior", bindable: true },
    { name: "size", type: "SgExpandablePanelSize", description: "Configuracao de tamanho minimo, maximo e padrao.", semanticRole: "behavior", bindable: true },
    { name: "resizable", type: "boolean", default: false, description: "Permite redimensionar o painel.", semanticRole: "behavior", bindable: true }
  ],
  states: ["closed", "open", "overlay", "inline", "resizing"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/sg-expandable-panel/samples/basico.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/sg-expandable-panel/sg-expandable-panel.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/sg-expandable-panel", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "layout.expandable-panel", acceptsDataBinding: true, defaultProps: { mode: "inline", placement: "start", resizable: false } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Criar drawers e paineis expansivos laterais ou superiores.",
    "Exibir conteudo contextual adicional sem trocar de tela.",
    "Layouts que pedem painel redimensionavel ou overlay controlado."
  ],
  avoidUseCases: [
    "Dialogs modais completos; nesses casos prefira SgDialog.",
    "Secoes simples fixas; nesses casos prefira SgPanel.",
    "Acoes e inputs isolados."
  ],
  synonyms: ["expandable panel", "drawer", "sliding panel", "side panel"],
  relatedEntityFields: ["sidePanel", "filtersPanel", "detailsDrawer", "expandableSection"],
  compositionHints: [
    "Usar com SgButton para abrir e fechar o painel.",
    "Combinar com SgStack e sgInput* para formularios laterais."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0, denseLayout: 0.88 }
};
