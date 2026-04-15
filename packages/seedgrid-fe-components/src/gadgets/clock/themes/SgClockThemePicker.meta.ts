import type { SgAiHintsV0, SgMetaV0 } from "../../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "gadget.clock-theme-picker",
  package: "@seedgrid/fe-components",
  exportName: "SgClockThemePicker",
  slug: "sg-clock-theme-picker",
  displayName: "SgClockThemePicker",
  category: "gadget",
  subcategory: "theme-picker",
  description:
    "Seletor visual de temas de relogio com preview embutido, filtro de temas e integracao com o resolver de temas do clock.",
  tags: ["gadget", "clock", "theme", "picker", "selection"],
  capabilities: ["theme-selection", "preview-rendering", "searchable-themes", "resolver-aware"],
  fieldSemantics: ["themeSelection", "clockThemePicker", "visualThemeChoice"],
  props: [
    { name: "value", type: "string", required: true, description: "ID do tema atualmente selecionado.", semanticRole: "value", bindable: true },
    { name: "onChange", type: "(id: string) => void", required: true, description: "Callback disparado quando um novo tema e escolhido.", semanticRole: "event", bindable: false },
    { name: "label", type: "string", description: "Rotulo opcional exibido acima do seletor.", semanticRole: "label", bindable: true },
    { name: "placeholder", type: "string", description: "Texto exibido quando nenhum tema valido esta resolvido.", semanticRole: "label", bindable: true },
    { name: "filter", type: "(theme: SgClockTheme) => boolean", description: "Filtro adicional sobre a lista de temas disponiveis.", semanticRole: "behavior", bindable: false },
    { name: "previewSize", type: "number", default: 56, description: "Tamanho do preview visual de cada tema.", semanticRole: "appearance", bindable: true },
    { name: "searchable", type: "boolean", default: true, description: "Ativa busca textual na lista de temas.", semanticRole: "behavior", bindable: true },
    { name: "fallbackThemeId", type: "string", default: "classic", description: "Tema usado quando o valor atual nao pode ser resolvido.", semanticRole: "behavior", bindable: true },
    { name: "defaultOpen", type: "boolean", default: false, description: "Abre a lista inicialmente no primeiro render.", semanticRole: "behavior", bindable: true }
  ],
  states: ["default", "open", "searching", "theme-selected"],
  examples: [
    { id: "provider-basic", title: "Uso com provider", file: "apps/showcase/src/app/components/providers/sg-clock-theme-provider/samples/uso-basico.tsx.sample", kind: "sample" },
    { id: "theme-local", title: "Tema local customizado", file: "apps/showcase/src/app/components/providers/sg-clock-theme-provider/samples/tema-local-customizado.tsx.sample", kind: "sample" }
  ],
  showcase: { route: "/components/gadgets/sg-clock-theme-picker", hasPlayground: false, hasPropsTable: true },
  sdui: {
    rendererType: "gadget.clock-theme-picker",
    acceptsDataBinding: true,
    defaultProps: { searchable: true, previewSize: 56, fallbackThemeId: "classic", defaultOpen: false }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Permitir que o usuario escolha o tema visual de um relogio ou widget temporal.",
    "Explorar galerias de temas de clock com preview rapido e filtro textual.",
    "Compor configuracoes visuais em dashboards ou paines de personalizacao."
  ],
  avoidUseCases: [
    "Selecao generica de opcoes estruturadas sem semantica de tema visual; nesses casos prefira Combobox ou RadioGroup.",
    "Preview estatico sem interacao; nesses casos prefira SgClockThemePreview.",
    "Aplicar tema global de toda a app; nesses casos prefira providers de tema dedicados."
  ],
  synonyms: ["clock theme picker", "theme selector", "theme chooser", "visual theme picker"],
  relatedEntityFields: ["themeId", "clockTheme", "selectedTheme", "appearanceTheme"],
  compositionHints: [
    "Usar junto de SgClockThemeProvider para resolver temas locais e fallback.",
    "Combinar com SgClock e SgClockThemePreview em paineis de personalizacao."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.86, date: 0.12, number: 0, denseLayout: 0.64 }
};
