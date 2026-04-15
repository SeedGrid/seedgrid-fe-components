import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "layout.dock-screen",
  package: "@seedgrid/fe-components",
  exportName: "SgDockScreen",
  slug: "sg-dock-screen",
  displayName: "SgDockScreen",
  category: "layout",
  subcategory: "dock-screen",
  description:
    "Componente de conveniencia que combina SgScreen e SgDockLayout em uma unica raiz estrutural.",
  tags: ["layout", "screen", "dock", "workspace", "shell"],
  capabilities: ["screen-shell", "dock-layout", "root-workspace", "persistent-layout"],
  fieldSemantics: ["workspaceScreen", "dockScreen", "appShell", "rootLayout"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador do dock layout interno.", semanticRole: "data", bindable: true },
    { name: "screenId", type: "string", description: "ID opcional do elemento raiz de screen.", semanticRole: "data", bindable: true },
    { name: "defaultState", type: "SgDockLayoutState", description: "Estado inicial das toolbars e zonas internas.", semanticRole: "value", bindable: true },
    { name: "layoutClassName", type: "string", description: "Classes adicionais aplicadas ao layout interno de dock.", semanticRole: "appearance", bindable: true },
    { name: "fullscreen", type: "boolean", default: true, description: "Quando ativo, a screen ocupa a viewport inteira.", semanticRole: "behavior", bindable: true },
    { name: "children", type: "ReactNode", description: "Zonas e conteudo estrutural do dock screen.", semanticRole: "data", bindable: false }
  ],
  states: ["default", "fullscreen", "embedded", "persisted"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/sg-dock-screen/samples/basico.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/sg-dock-screen/sg-dock-screen.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/sg-dock-screen", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "layout.dock-screen", acceptsDataBinding: true, defaultProps: { fullscreen: true } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Montar telas completas com docking sem precisar combinar Screen e DockLayout manualmente.",
    "Criar workspaces administrativos e shells de aplicacao com zonas estruturais prontas.",
    "Usar quando o layout principal da tela inteira precisa de docking persistente."
  ],
  avoidUseCases: [
    "Secoes internas pequenas; nesses casos prefira DockLayout, Panel ou Stack.",
    "Apenas uma screen simples sem zonas; nesses casos prefira SgScreen.",
    "Conteudo puramente navegacional; nesses casos prefira Menu, PageControl ou DockMenu."
  ],
  synonyms: ["dock screen", "workspace screen", "docking shell", "dock workspace"],
  relatedEntityFields: ["screen", "workspace", "layout", "dockScreen", "shell"],
  compositionHints: [
    "Usar com SgDockZone e SgToolBar para montar laterais, topo e rodape.",
    "Combinar com menus, dialogs e paineis em shells administrativos."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0, denseLayout: 0.99 }
};
