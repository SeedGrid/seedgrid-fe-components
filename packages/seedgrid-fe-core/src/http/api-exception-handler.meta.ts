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
  componentId: "utility.exception-capture",
  package: "@seedgrid/fe-core",
  exportName: "captureException",
  slug: "capture-exception",
  displayName: "Exception Capture",
  category: "utility",
  subcategory: "error-handling",
  description:
    "Captures, normalizes, deduplicates, and reports exceptions through registered reporters with contextual metadata.",
  tags: ["error", "exception", "reporting", "observability", "guard"],
  capabilities: ["normalize-error", "deduplicate", "reporter-pipeline", "context-metadata"],
  fieldSemantics: ["error", "exception", "context", "reporting"],
  props: [
    {
      name: "error",
      type: "unknown",
      required: true,
      description: "Unknown thrown value that will be normalized into an Error instance.",
      semanticRole: "data",
    },
    {
      name: "context",
      type: "ExceptionContext",
      required: false,
      description: "Optional metadata describing area, source, HTTP status, retryability, and extra attributes.",
      semanticRole: "data",
    },
  ],
  states: ["idle", "captured", "reported", "deduplicated"],
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Centralized exception capture from UI events, async actions, and API failures.",
    "Server or client flows that should log/report errors with structured context before rethrowing or translating them.",
    "Wrapping actions with runGuarded to standardize error capture without repeating try/catch boilerplate.",
  ],
  avoidUseCases: [
    "User-facing validation branches that are expected control flow rather than real exceptions.",
    "Hot paths where repeated non-error control flow would spam the reporter pipeline.",
  ],
  synonyms: ["error capture", "exception reporter", "error guard", "run guarded"],
  relatedEntityFields: ["error", "exception", "status", "source", "reporting"],
  compositionHints: [
    "Register reporters at app bootstrap, then call captureException from feature modules instead of logging ad hoc.",
    "Use runGuarded around async actions that should always capture and rethrow unexpected failures.",
    "Use suppressException when an error was intentionally handled and should not be reported again.",
  ],
  rankingSignals: {
    freeText: 0.3,
    structuredChoice: 0.25,
    date: 0,
    number: 0,
    denseLayout: 0.05,
  },
};