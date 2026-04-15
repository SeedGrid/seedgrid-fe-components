import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "layout.dock-zone",
  package: "@seedgrid/fe-components",
  exportName: "SgDockZone",
  slug: "sg-dock-zone",
  displayName: "SgDockZone",
  category: "layout",
  subcategory: "dock-zone",
  description:
    "Regiao nomeada dentro de um dock layout usada para alojar toolbars e conteudo por zona.",
  tags: ["layout", "dock", "zone", "region", "workspace"],
  capabilities: ["named-zone", "drop-target", "toolbar-host", "free-zone", "preview-state"],
  fieldSemantics: ["dockZone", "layoutRegion", "workspaceRegion", "dropArea"],
  props: [
    { name: "zone", type: '"top" | "bottom" | "left" | "right" | "free"', required: true, description: "Identificador da zona dentro do dock layout.", semanticRole: "value", bindable: true },
    { name: "children", type: "ReactNode", description: "Conteudo renderizado dentro da zona.", semanticRole: "data", bindable: false },
    { name: "className", type: "string", description: "Classes adicionais da zona.", semanticRole: "appearance", bindable: true }
  ],
  states: ["default", "drop-preview", "active-drop-target"],
  examples: [{ id: "basic", title: "Basico", file: "apps/showcase/src/app/components/sg-dock-layout/samples/basico.tsx.sample", kind: "sample" }],
  showcase: { route: "/components/sg-dock-layout", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "layout.dock-zone", acceptsDataBinding: true, defaultProps: { zone: "free" } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Declarar regioes top, bottom, left, right e free em um DockLayout.",
    "Delimitar areas que recebem toolbars, menus ou conteudo arrastavel.",
    "Separar funcionalmente zonas de uma workspace com docking."
  ],
  avoidUseCases: [
    "Agrupamentos simples fora de docking; nesses casos prefira Panel ou Stack.",
    "Navegacao isolada; nesses casos prefira Menu ou Breadcrumb.",
    "Acoes primarias; nesses casos prefira Button ou ToolbarIconButton."
  ],
  synonyms: ["dock zone", "dock region", "layout zone", "drop area"],
  relatedEntityFields: ["zone", "region", "dockArea", "workspaceArea"],
  compositionHints: [
    "Usar dentro de SgDockLayout ou SgDockScreen.",
    "Combinar com SgToolBar e conteudo de workspace conforme a zona."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0, denseLayout: 0.92 }
};
