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
  componentId: "hook.use-theme-legacy",
  package: "@seedgrid/fe-theme",
  exportName: "useTheme",
  slug: "use-theme",
  displayName: "useTheme",
  category: "hook",
  subcategory: "theme-legacy",
  description:
    "Hook legado para consumir o contexto de tema antigo exposto por ThemeProvider.",
  tags: ["hook", "theme", "legacy", "compatibility"],
  capabilities: ["legacy-theme-read", "theme-access"],
  fieldSemantics: ["legacyThemeHook", "themeContextAccess"],
  props: [
    { name: "returns", type: "SeedGridThemeConfig", description: "Configuracao de tema legado atual.", semanticRole: "data", bindable: false }
  ],
  states: ["inside-provider"],
  examples: [],
  showcase: { route: "/packages/fe-theme/use-theme", hasPlayground: false, hasPropsTable: false },
  sdui: {
    rendererType: "hook.use-theme-legacy",
    acceptsDataBinding: false,
    defaultProps: {}
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Ler tema em consumidores antigos baseados em ThemeProvider.",
    "Manter compatibilidade durante migracao do sistema de tema."
  ],
  avoidUseCases: [
    "Novos componentes e fluxos de tema; nesses casos prefira useSgTheme.",
    "Uso fora de ThemeProvider, onde o hook lancara erro."
  ],
  synonyms: ["legacy theme hook", "use theme", "theme compatibility hook"],
  relatedEntityFields: ["theme", "legacyTheme", "colors"],
  compositionHints: [
    "Usar apenas com ThemeProvider.",
    "Migrar gradualmente para useSgTheme quando possivel."
  ],
  rankingSignals: { freeText: 0.42, structuredChoice: 0.46, date: 0, number: 0, denseLayout: 0.45 }
};
