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
  componentId: "hook.persistence-composite",
  package: "@seedgrid/fe-core",
  exportName: "createCompositePersistenceStrategy",
  slug: "create-composite-persistence-strategy",
  displayName: "Composite Persistence Strategy",
  category: "hook",
  subcategory: "persistence",
  description:
    "Combines two persistence strategies (primary and secondary) with configurable fallback behavior: strict (primary only), fallback (try primary, use secondary on error), or mirror (sync to both simultaneously).",
  tags: ["persistence", "composite", "fallback", "resilience", "state"],
  capabilities: ["persistence", "fallback", "resilience", "dual-strategy"],
  fieldSemantics: ["state", "persistence", "composition"],
  props: [
    {
      name: "mode",
      type: "'strict' | 'fallback' | 'mirror'",
      required: true,
      description:
        "Mode: 'strict' uses primary only, 'fallback' falls back to secondary on error, 'mirror' syncs to both.",
      semanticRole: "data",
    },
    {
      name: "primary",
      type: "PersistenceStrategy",
      required: true,
      description:
        "First-choice persistence strategy (e.g. localStorage for fast local access).",
      semanticRole: "behavior",
    },
    {
      name: "secondary",
      type: "PersistenceStrategy",
      required: true,
      description:
        "Fallback or mirror strategy (e.g. API persistence for server sync).",
      semanticRole: "behavior",
    },
  ],
  states: ["ready", "loading", "syncing", "error"],
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Resilient offline-first apps: localStorage primary, API fallback.",
    "Multi-destination state sync: keep local cache and server in sync simultaneously.",
    "Gradual migration: run old persistence (primary) and new (secondary) in parallel to validate.",
  ],
  avoidUseCases: [
    "Simple applications with only one persistence backend.",
    "High-frequency updates to avoid bottleneck of syncing both strategies.",
  ],
  synonyms: [
    "dual persistence",
    "fallback persistence",
    "hybrid storage",
    "resilient persistence",
  ],
  relatedEntityFields: ["persistence", "state", "fallback", "resilience"],
  compositionHints: [
    "Typical offline-first: createLocalStorageStrategy as primary, createApiPersistenceStrategy as secondary with fallback mode.",
    "Mirror mode enables live sync across devices: load from local cache immediately, update server in background.",
    "Fallback mode gracefully degrades when API is unavailable — app stays functional using localStorage.",
  ],
  rankingSignals: {
    freeText: 0.2,
    structuredChoice: 0.4,
    date: 0,
    number: 0,
    denseLayout: 0.15,
  },
};
