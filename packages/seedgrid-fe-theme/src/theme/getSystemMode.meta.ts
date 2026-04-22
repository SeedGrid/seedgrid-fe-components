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
  componentId: "utility.get-system-mode",
  package: "@seedgrid/fe-theme",
  exportName: "getSystemMode",
  slug: "get-system-mode",
  displayName: "getSystemMode",
  category: "utility",
  subcategory: "system-mode",
  description: "Resolve o modo claro ou escuro com base na preferencia do sistema operacional no browser.",
  tags: ["utility", "theme", "dark-mode", "system-preference"],
  capabilities: ["prefers-color-scheme", "light-dark-resolution", "browser-aware"],
  fieldSemantics: ["systemModeDetection", "preferredColorScheme"],
  props: [],
  states: ["light", "dark"],
  examples: [],
  showcase: { route: "/packages/fe-theme/get-system-mode", hasPlayground: false, hasPropsTable: false },
  sdui: { rendererType: "utility.get-system-mode", acceptsDataBinding: false, defaultProps: {} }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Detectar preferencia inicial de claro ou escuro no cliente.",
    "Apoiar modos automaticos de tema baseados em prefers-color-scheme."
  ],
  avoidUseCases: [
    "Persistencia da escolha do usuario; isso deve ser tratado por provider ou storage.",
    "Uso em ambiente puramente server-side como fonte definitiva de tema."
  ],
  synonyms: ["system mode", "prefers color scheme", "detect dark mode"],
  relatedEntityFields: ["mode", "systemMode", "colorScheme"],
  compositionHints: [
    "Usar com SeedThemeProvider quando o modo auto precisar de fallback para o sistema."
  ],
  rankingSignals: { freeText: 0.2, structuredChoice: 0.36, date: 0, number: 0, denseLayout: 0.22 }
};
