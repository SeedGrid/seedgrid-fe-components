type SgMetaPropV0 = {
  name: string;
  type: string;
  required?: boolean;
  default?: unknown;
  description?: string;
  semanticRole?: "value" | "label" | "validation" | "behavior" | "appearance" | "event" | "data";
  bindable?: boolean;
};

type SgMetaV0 = {
  version: "0.1";
  componentId: string;
  package: string;
  exportName: string;
  slug: string;
  displayName: string;
  category: string;
  subcategory?: string;
  description: string;
  tags?: string[];
  capabilities?: string[];
  fieldSemantics?: string[];
  props?: SgMetaPropV0[];
  states?: string[];
  examples?: Array<{ id: string; title: string; file: string; kind: "sample" | "playground" }>;
  showcase?: { route: string; hasPlayground: boolean; hasPropsTable: boolean };
  sdui?: {
    rendererType: string;
    acceptsDataBinding?: boolean;
    defaultProps?: Record<string, unknown>;
  };
};

type SgAiHintsV0 = {
  version: "0.1";
  preferredUseCases: string[];
  avoidUseCases?: string[];
  synonyms?: string[];
  relatedEntityFields?: string[];
  compositionHints?: string[];
  rankingSignals?: {
    freeText?: number;
    structuredChoice?: number;
    date?: number;
    number?: number;
    denseLayout?: number;
  };
};

export const sgMeta: SgMetaV0 = {
  version: "0.1",
  componentId: "provider.theme-legacy",
  package: "@seedgrid/fe-theme",
  exportName: "ThemeProvider",
  slug: "theme-provider",
  displayName: "ThemeProvider",
  category: "provider",
  subcategory: "theme-legacy",
  description:
    "Provider legado de tema para compatibilidade retroativa, aplicando tokens CSS e expondo contexto simplificado de tema.",
  tags: ["provider", "theme", "legacy", "compatibility"],
  capabilities: ["legacy-theme-context", "css-vars", "compat-layer"],
  fieldSemantics: ["legacyThemeProvider", "themeContext", "compatibilityLayer"],
  props: [
    { name: "theme", type: "Partial<SeedGridThemeConfig>", description: "Configuracao parcial do tema legado.", semanticRole: "data", bindable: true },
    { name: "children", type: "ReactNode", required: true, description: "Arvore de componentes envolvida pelo provider.", semanticRole: "data", bindable: false }
  ],
  states: ["default", "legacy-theme-applied"],
  examples: [],
  showcase: { route: "/packages/fe-theme/theme-provider", hasPlayground: false, hasPropsTable: false },
  sdui: {
    rendererType: "provider.theme-legacy",
    acceptsDataBinding: true,
    defaultProps: { theme: {} }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Manter compatibilidade com consumidores antigos do sistema de tema.",
    "Aplicar configuracao de tema simplificada em arvores legadas.",
    "Servir como camada de transicao entre ThemeProvider e SeedThemeProvider."
  ],
  avoidUseCases: [
    "Novas implementacoes de tema; nesses casos prefira SeedThemeProvider.",
    "Acesso ao contexto moderno de tokens; nesses casos prefira useSgTheme."
  ],
  synonyms: ["legacy theme provider", "theme provider compatibility", "old theme provider"],
  relatedEntityFields: ["theme", "legacyTheme", "themeConfig"],
  compositionHints: [
    "Usar apenas em fluxos legados ou em migracao.",
    "Planejar migracao gradual para SeedThemeProvider."
  ],
  rankingSignals: { freeText: 0.45, structuredChoice: 0.5, date: 0, number: 0, denseLayout: 0.54 }
};
