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
  componentId: "hook.persistence-api",
  package: "@seedgrid/fe-core",
  exportName: "createApiPersistenceStrategy",
  slug: "create-api-persistence-strategy",
  displayName: "API Persistence Strategy",
  category: "hook",
  subcategory: "persistence",
  description:
    "Creates a persistence strategy that syncs application state with a backend API endpoint. Supports custom fetch implementations and versioned state.",
  tags: ["persistence", "api", "state", "server", "sync"],
  capabilities: ["persistence", "server-sync", "versioned-state"],
  fieldSemantics: ["state", "persistence", "api", "backend"],
  props: [
    {
      name: "baseUrl",
      type: "string",
      required: true,
      description:
        "Base URL of the persistence API (e.g. https://api.example.com/state).",
      semanticRole: "data",
    },
    {
      name: "fetcher",
      type: "(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>",
      required: false,
      description:
        "Custom fetch implementation (default: global fetch). Useful for adding auth headers.",
      semanticRole: "behavior",
    },
    {
      name: "scope",
      type: "string",
      required: true,
      description:
        "Scope/namespace for the persisted state (e.g. 'app.dashboard', 'user.preferences').",
      semanticRole: "data",
    },
    {
      name: "stateVersion",
      type: "number",
      required: true,
      description:
        "Version number of the state schema. Increment when structure changes.",
      semanticRole: "data",
    },
  ],
  states: ["ready", "loading", "syncing", "error"],
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Synchronizing application state with a backend server across sessions and devices.",
    "Multi-device sync where a user's state updates on all their devices.",
    "Server-side state versioning and schema evolution.",
  ],
  avoidUseCases: [
    "Offline-first applications — use localStorage first, then API (composite strategy).",
    "High-frequency state updates that would overwhelm the server.",
    "Real-time collaborative editing — use WebSocket-based persistence instead.",
  ],
  synonyms: ["server persistence", "API state sync", "backend storage"],
  relatedEntityFields: ["persistence", "state", "api", "backend", "sync"],
  compositionHints: [
    "Provide a custom fetcher that injects authorization headers if the API requires authentication.",
    "Use scope to separate user preferences, app state, form cache, etc. on the server.",
    "Increment stateVersion when the state shape changes to handle schema migrations.",
    "Pair with createCompositePersistenceStrategy (localStorage primary, API fallback) for resilience.",
  ],
  rankingSignals: {
    freeText: 0.25,
    structuredChoice: 0.35,
    date: 0,
    number: 0,
    denseLayout: 0.1,
  },
};
