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
  componentId: "hook.cep-lookup",
  package: "@seedgrid/fe-commons",
  exportName: "buscarCep",
  slug: "buscar-cep",
  displayName: "CEP Lookup",
  category: "hook",
  subcategory: "lookup",
  description:
    "Async function to lookup Brazilian postal code (CEP) details using the free ViaCEP public API. Returns address information: street, city, state, district.",
  tags: ["cep", "postal code", "address", "brazil", "lookup"],
  capabilities: ["lookup", "address", "postal", "brazil"],
  fieldSemantics: ["cep", "postal-code", "address", "location"],
  props: [
    {
      name: "cep",
      type: "string",
      required: true,
      description:
        "Brazilian CEP (postal code) as string. Accepts with or without hyphen (e.g. '12345-678' or '12345678').",
      semanticRole: "data",
    },
    {
      name: "options",
      type: "{ signal?: AbortSignal }",
      required: false,
      description: "Optional abort signal for request cancellation.",
      semanticRole: "behavior",
    },
  ],
  states: ["idle", "loading", "success", "error"],
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Auto-populate address fields based on user-entered CEP in forms.",
    "Validate that a CEP exists and belongs to a real location.",
    "Build address fields: state, city, street based on postal code.",
  ],
  avoidUseCases: [
    "High-frequency lookups on every keystroke — debounce/throttle the call.",
    "Offline applications — ViaCEP requires internet connectivity.",
  ],
  synonyms: ["postal code lookup", "CEP search", "address finder"],
  relatedEntityFields: [
    "cep",
    "postal-code",
    "address",
    "location",
    "city",
    "state",
  ],
  compositionHints: [
    "CEP format: 8 digits, with or without hyphen (both accepted).",
    "Common pattern: user enters CEP, buscarCep fetches, populate 'cidade' (city) and 'estado' (state).",
    "Error cases: throw on invalid CEP format, HTTP error, or data.erro flag.",
    "Debounce rapid CEP input before calling buscarCep to reduce API load.",
  ],
  rankingSignals: {
    freeText: 0.4,
    structuredChoice: 0.2,
    date: 0,
    number: 0.3,
    denseLayout: 0.1,
  },
};
