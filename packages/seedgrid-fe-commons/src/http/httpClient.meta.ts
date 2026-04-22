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
  componentId: "hook.http-client",
  package: "@seedgrid/fe-commons",
  exportName: "createHttpClient",
  slug: "create-http-client",
  displayName: "HTTP Client Factory",
  category: "hook",
  subcategory: "http",
  description:
    "Factory function to create a typed HTTP client with automatic Content-Type and Bearer token injection. Returns a request function with generic type support.",
  tags: ["http", "api", "fetch", "client", "auth"],
  capabilities: ["fetch", "auth", "bearer-token", "json"],
  fieldSemantics: ["http", "api", "request"],
  props: [
    {
      name: "baseUrl",
      type: "string",
      required: true,
      description: "Base URL for all requests (e.g. 'https://api.example.com').",
      semanticRole: "data",
    },
    {
      name: "getAccessToken",
      type: "() => string | null",
      required: false,
      description:
        "Callback to retrieve the access token. If provided, injected as 'Authorization: Bearer {token}'.",
      semanticRole: "behavior",
    },
  ],
  states: ["ready", "loading"],
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "API communication with automatic Authorization header injection.",
    "Type-safe HTTP requests with generic return types.",
    "Authentication flows where tokens change at runtime (refresh tokens).",
  ],
  avoidUseCases: [
    "File uploads/downloads that require multipart or streaming.",
    "GraphQL queries (use a GraphQL client instead).",
  ],
  synonyms: ["api client", "fetch wrapper", "http request client"],
  relatedEntityFields: ["http", "api", "request", "authentication"],
  compositionHints: [
    "getAccessToken should be a getter function to support token refresh without recreating the client.",
    "The returned request function automatically sets Content-Type: application/json.",
    "HTTP errors (non-2xx) throw; 204 No Content returns undefined.",
  ],
  rankingSignals: {
    freeText: 0.2,
    structuredChoice: 0.3,
    date: 0,
    number: 0,
    denseLayout: 0.1,
  },
};
