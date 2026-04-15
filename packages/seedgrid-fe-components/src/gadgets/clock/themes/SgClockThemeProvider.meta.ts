import type { SgAiHintsV0, SgMetaV0 } from "../../../ai-meta/types";

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "provider.clock-theme",
  package: "@seedgrid/fe-components",
  exportName: "SgClockThemeProvider",
  slug: "sg-clock-theme-provider",
  displayName: "SgClockThemeProvider",
  category: "provider",
  subcategory: "theme",
  description:
    "Provider de resolucao de temas de relogio, com suporte a fallback, temas locais e integracao com o registro global.",
  tags: ["provider", "clock", "theme", "resolver", "context"],
  capabilities: ["theme-context", "fallback-resolution", "local-themes", "global-theme-merge"],
  fieldSemantics: ["themeProvider", "clockThemeResolution", "themeRegistryScope"],
  props: [
    { name: "value.mode", type: '"fallback" | "strict"', default: "fallback", description: "Modo de resolucao para temas ausentes.", semanticRole: "behavior", bindable: true },
    { name: "value.fallbackThemeId", type: "string", default: "classic", description: "Tema padrao usado em modo fallback.", semanticRole: "behavior", bindable: true },
    { name: "value.themes", type: "SgClockTheme[]", default: [], description: "Lista de temas locais adicionados apenas neste escopo.", semanticRole: "data", bindable: true },
    { name: "children", type: "ReactNode", required: true, description: "Arvore que vai consumir o resolver de temas.", semanticRole: "data", bindable: false }
  ],
  states: ["default", "fallback-mode", "strict-mode", "local-themes-loaded"],
  examples: [
    { id: "basic", title: "Uso basico", file: "apps/showcase/src/app/components/providers/sg-clock-theme-provider/samples/uso-basico.tsx.sample", kind: "sample" },
    { id: "global-register", title: "Registro global", file: "apps/showcase/src/app/components/providers/sg-clock-theme-provider/samples/registro-global.tsx.sample", kind: "sample" }
  ],
  showcase: { route: "/components/providers/sg-clock-theme-provider", hasPlayground: false, hasPropsTable: true },
  sdui: {
    rendererType: "provider.clock-theme",
    acceptsDataBinding: true,
    defaultProps: { value: { mode: "fallback", fallbackThemeId: "classic", themes: [] } }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Escopar resolucao de temas de clock para uma subtree especifica.",
    "Fornecer fallback consistente e temas locais para widgets de relogio.",
    "Compor paines de personalizacao com registro global e override local."
  ],
  avoidUseCases: [
    "Selecao visual de tema pelo usuario; nesses casos prefira SgClockThemePicker.",
    "Renderizacao direta do relogio; nesses casos prefira SgClock.",
    "Tema global generico da aplicacao fora do dominio de clock."
  ],
  synonyms: ["clock theme provider", "theme resolver provider", "clock theme context"],
  relatedEntityFields: ["themeResolver", "clockThemeScope", "fallbackThemeId", "localThemes"],
  compositionHints: [
    "Usar com SgClock e SgClockThemePicker no mesmo subtree.",
    "Combinar com registerTheme e registerThemes quando houver catalogo compartilhado."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0.18, number: 0, denseLayout: 0.72 }
};
