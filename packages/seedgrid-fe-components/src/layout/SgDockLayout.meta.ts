import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "layout.dock-layout",
  package: "@seedgrid/fe-components",
  exportName: "SgDockLayout",
  slug: "sg-dock-layout",
  displayName: "SgDockLayout",
  category: "layout",
  subcategory: "dock-layout",
  description:
    "Layout estrutural com zonas de dock e persistencia de estado para barras e paines arrastaveis.",
  tags: ["layout", "dock", "workspace", "shell", "zones"],
  capabilities: ["zone-layout", "drag-drop", "persistent-state", "toolbar-placement", "drop-preview"],
  fieldSemantics: ["workspaceLayout", "dockLayout", "appShell", "toolArea", "panelZones"],
  props: [
    { name: "id", type: "string", required: true, description: "Identificador do layout usado para persistencia e coordenacao interna.", semanticRole: "data", bindable: true },
    { name: "defaultState", type: "SgDockLayoutState", description: "Estado inicial das toolbars e zonas do layout.", semanticRole: "value", bindable: true },
    { name: "children", type: "ReactNode", required: true, description: "Zonas, toolbars e conteudo estrutural do layout.", semanticRole: "data", bindable: false },
    { name: "className", type: "string", description: "Classes adicionais do container raiz.", semanticRole: "appearance", bindable: true }
  ],
  states: ["default", "dragging", "drop-preview", "persisted"],
  examples: [
    { id: "basic", title: "Basico", file: "apps/showcase/src/app/components/sg-dock-layout/samples/basico.tsx.sample", kind: "sample" },
    { id: "playground", title: "Playground", file: "apps/showcase/src/app/components/sg-dock-layout/sg-dock-layout.tsx.playground", kind: "playground" }
  ],
  showcase: { route: "/components/sg-dock-layout", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "layout.dock-layout", acceptsDataBinding: true, defaultProps: { className: "relative grid h-full w-full" } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Compor workspaces com zonas dockadas para toolbars, menus e paineis.",
    "Estruturar shells administrativos com suporte a arraste e persistencia de layout.",
    "Organizar regioes top, bottom, left, right e free em uma grade coordenada."
  ],
  avoidUseCases: [
    "Blocos simples de agrupamento; nesses casos prefira SgPanel, SgCard ou SgStack.",
    "Navegacao isolada; nesses casos prefira Menu, DockMenu ou Breadcrumb.",
    "Acoes unicas; nesses casos prefira Button ou ToolBar."
  ],
  synonyms: ["dock layout", "workspace layout", "zone layout", "docking shell"],
  relatedEntityFields: ["layout", "workspace", "dockState", "toolbars", "zones"],
  compositionHints: [
    "Usar com SgDockZone, SgToolBar e SgToolbarIconButton em shells complexos.",
    "Combinar com SgScreen ou SgDockScreen quando a tela inteira precisa de docking."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0, denseLayout: 0.98 }
};
