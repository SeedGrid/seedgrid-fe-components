import type { SgAiHintsV0, SgMetaV0 } from "../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "action.toolbar-icon-button",
  package: "@seedgrid/fe-components",
  exportName: "SgToolbarIconButton",
  slug: "sg-toolbar-icon-button",
  displayName: "SgToolbarIconButton",
  category: "action",
  subcategory: "toolbar-icon-button",
  description:
    "Botao compacto para toolbars com icone, label opcional, hint, loading e severidade visual.",
  tags: ["action", "toolbar", "icon-button", "compact-action", "shortcut"],
  capabilities: ["icon-action", "compact-toolbar-action", "loading", "hint", "severity"],
  fieldSemantics: ["toolbarAction", "iconAction", "shortcutAction", "quickAction"],
  props: [
    { name: "icon", type: "ReactNode | string", description: "Icone principal exibido no botao.", semanticRole: "label", bindable: true },
    { name: "label", type: "string", description: "Rotulo textual da acao.", semanticRole: "label", bindable: true },
    { name: "hint", type: "string", description: "Texto auxiliar usado como dica contextual.", semanticRole: "label", bindable: true },
    { name: "showLabel", type: "boolean", default: false, description: "Exibe o rotulo junto do icone quando suportado pela toolbar.", semanticRole: "appearance", bindable: true },
    { name: "loading", type: "boolean", default: false, description: "Indica processamento em andamento.", semanticRole: "behavior", bindable: true },
    { name: "severity", type: '"primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger" | "plain"', default: "plain", description: "Tom visual do botao de toolbar.", semanticRole: "appearance", bindable: true },
    { name: "disabled", type: "boolean", default: false, description: "Desabilita interacao.", semanticRole: "behavior", bindable: true },
    { name: "onClick", type: "() => void | Promise<void>", description: "Callback executado ao clicar no item.", semanticRole: "event", bindable: false }
  ],
  states: ["default", "disabled", "loading"],
  examples: [{ id: "basic", title: "Basico", file: "apps/showcase/src/app/components/sg-toolbar/samples/basico.tsx.sample", kind: "sample" }],
  showcase: { route: "/components/sg-toolbar", hasPlayground: true, hasPropsTable: true },
  sdui: { rendererType: "action.toolbar-icon-button", acceptsDataBinding: true, defaultProps: { showLabel: false, severity: "plain", disabled: false } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Acoes compactas em toolbars com predominancia visual de icone.",
    "Atalhos de navegacao ou comando rapido em barras horizontais e verticais.",
    "Botoes de baixo peso para filtros, refresh, configuracoes e utilitarios."
  ],
  avoidUseCases: [
    "Acoes primarias de formulario; nesses casos prefira SgButton ou SplitButton.",
    "Agrupamento estrutural; nesses casos prefira ToolBar ou Panel.",
    "Menus complexos com muitas opcoes textuais; nesses casos prefira Menu ou DockMenu."
  ],
  synonyms: ["toolbar icon button", "icon action", "quick toolbar action", "shortcut button"],
  relatedEntityFields: ["action", "toolbarAction", "shortcut", "command"],
  compositionHints: [
    "Usar dentro de SgToolBar em cenarios de workspace e dashboards.",
    "Combinar com DockLayout e DockScreen para acoes contextuais por zona."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0, denseLayout: 0.88 }
};
