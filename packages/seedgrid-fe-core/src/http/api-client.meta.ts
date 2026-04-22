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
  componentId: "factory.api-client",
  package: "@seedgrid/fe-core",
  exportName: "createApiClient",
  slug: "create-api-client",
  displayName: "API Client Factory",
  category: "factory",
  subcategory: "http",
  description:
    "Factory function that creates a fetch-based API client with auth token injection, retry policies, response parsing, cURL debug output, and typed request helpers.",
  tags: ["api", "http", "fetch", "auth", "retry", "json"],
  capabilities: ["get", "post", "put", "patch", "delete", "refresh-token", "response-parse", "query-params"],
  fieldSemantics: ["api", "request", "authentication", "retry", "error-handling"],
  props: [
    {
      name: "baseUrl",
      type: "string",
      required: true,
      description: "Base URL used to resolve relative API paths.",
      semanticRole: "data",
    },
    {
      name: "getAccessToken",
      type: "() => Promise<string | null>",
      required: false,
      description: "Async callback used to read the current access token before authenticated requests.",
      semanticRole: "behavior",
    },
    {
      name: "refreshAccessToken",
      type: "() => Promise<string | null>",
      required: false,
      description: "Async callback used after a 401 to obtain a fresh access token and retry once.",
      semanticRole: "behavior",
    },
    {
      name: "defaultHeaders",
      type: "HeadersInit",
      required: false,
      description: "Headers merged into every request before per-request overrides.",
      semanticRole: "data",
    },
    {
      name: "defaultCache",
      type: "RequestCache",
      required: false,
      description: "Default fetch cache mode used when a request does not override cache.",
      semanticRole: "behavior",
    },
    {
      name: "defaultNext",
      type: "{ revalidate?: false | number; tags?: string[] }",
      required: false,
      description: "Next.js fetch options reused across requests.",
      semanticRole: "behavior",
    },
    {
      name: "onAuthFailure",
      type: "(context: ExceptionContext) => void | Promise<void>",
      required: false,
      description: "Optional callback fired when an authenticated request still fails with 401.",
      semanticRole: "event",
    },
    {
      name: "onException",
      type: "(error: Error, context: ExceptionContext) => void | Promise<void>",
      required: false,
      description: "Optional callback invoked before captured API exceptions are rethrown.",
      semanticRole: "event",
    },
  ],
  states: ["ready", "requesting", "retrying", "failed"],
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Server or client HTTP access where auth tokens, retries, and typed JSON parsing should be standardized.",
    "Application modules that need consistent GET/POST/PUT/PATCH/DELETE helpers instead of ad hoc fetch calls.",
    "Next.js integrations that need cache/next options to flow through a shared API layer.",
  ],
  avoidUseCases: [
    "Very small one-off fetch calls where a dedicated client adds no value.",
    "Streaming or multipart-heavy workflows that need low-level fetch control.",
  ],
  synonyms: ["api client", "fetch wrapper", "http client", "authenticated fetch", "request factory"],
  relatedEntityFields: ["api", "request", "auth", "token", "retry", "http"],
  compositionHints: [
    "Pair createApiClient with captureException or module-level error translation when surfacing server errors to the UI.",
    "Use requireAuth: false for public endpoints; leave it enabled by default for private endpoints.",
    "Use parseAs: 'response' when the caller needs raw headers or binary body handling.",
  ],
  rankingSignals: {
    freeText: 0.35,
    structuredChoice: 0.3,
    date: 0,
    number: 0.05,
    denseLayout: 0.1,
  },
};