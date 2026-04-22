type SgMetaPropV0 = {
  name: string;
  type: string;
  required?: boolean;
  default?: unknown;
  description?: string;
  semanticRole?: "value" | "label" | "validation" | "behavior" | "appearance" | "event" | "data";
  bindable?: boolean;
};

type SgMetaExampleV0 = {
  id: string;
  title: string;
  file: string;
  kind: "sample" | "playground";
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
  examples?: SgMetaExampleV0[];
  showcase?: {
    route: string;
    hasPlayground: boolean;
    hasPropsTable: boolean;
  };
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
  componentId: "hook.persistence-localstorage",
  package: "@seedgrid/fe-core",
  exportName: "createLocalStorageStrategy",
  slug: "create-localstorage-strategy",
  displayName: "Local Storage Persistence Strategy",
  category: "hook",
  subcategory: "persistence",
  description:
    "Creates a persistence strategy that stores and retrieves application state from browser localStorage with optional key prefix.",
  tags: ["persistence", "storage", "state", "localStorage", "browser"],
  capabilities: ["persistence", "offline", "browser-native"],
  fieldSemantics: ["state", "persistence", "storage"],
  props: [
    {
      name: "options",
      type: "{ prefix?: string }",
      required: false,
      description: "Optional configuration: prefix for localStorage keys (default: no prefix).",
      semanticRole: "data",
    },
  ],
  states: ["ready", "loading", "error"],
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Client-side application state persistence across browser sessions.",
    "Caching user preferences, form state, or temporary data in the browser.",
    "Single-origin applications where cross-origin data sharing is not needed.",
  ],
  avoidUseCases: [
    "Sensitive data (passwords, tokens) — use secure server-side persistence instead.",
    "Large datasets that exceed localStorage limit (~5-10MB per origin).",
    "Server-synchronized state that requires real-time consistency across tabs.",
  ],
  synonyms: [
    "browser persistence",
    "local storage strategy",
    "client-side state storage",
  ],
  relatedEntityFields: ["persistence", "state", "storage", "caching"],
  compositionHints: [
    "Use prefix option to namespace data when multiple apps share the same origin.",
    "Combine with createCompositePersistenceStrategy to fall back to API persistence on failure.",
    "State should be serializable to JSON — complex objects are converted via stringify.",
  ],
  rankingSignals: {
    freeText: 0.2,
    structuredChoice: 0.3,
    date: 0,
    number: 0,
    denseLayout: 0.1,
  },
};
