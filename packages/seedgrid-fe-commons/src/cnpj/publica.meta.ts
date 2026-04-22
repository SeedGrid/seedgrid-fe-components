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
  componentId: "hook.cnpj-lookup",
  package: "@seedgrid/fe-commons",
  exportName: "buscarCnpj",
  slug: "buscar-cnpj",
  displayName: "CNPJ Lookup",
  category: "hook",
  subcategory: "lookup",
  description:
    "Async function to lookup Brazilian company registration (CNPJ) details using the free Publica CNPJ API. Returns business information: legal name, address, shareholders, tax status.",
  tags: ["cnpj", "company", "business", "brazil", "lookup", "registration"],
  capabilities: ["lookup", "business", "company", "brazil"],
  fieldSemantics: ["cnpj", "company", "business", "registration"],
  props: [
    {
      name: "cnpj",
      type: "string",
      required: true,
      description:
        "Brazilian company registration (CNPJ) as string. Accepts with or without formatting (e.g. '12.345.678/0001-90' or '12345678000190').",
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
    "Auto-populate company/vendor fields in B2B forms based on CNPJ.",
    "Verify company details (legal name, address) before contract.",
    "Business directory or company search features.",
  ],
  avoidUseCases: [
    "High-frequency lookups on every keystroke — debounce/throttle the call.",
    "Offline applications — Publica API requires internet connectivity.",
  ],
  synonyms: ["company lookup", "CNPJ search", "business finder"],
  relatedEntityFields: ["cnpj", "company", "business", "registration", "vendor"],
  compositionHints: [
    "CNPJ format: 14 digits, with or without formatting (both accepted).",
    "Returns null on network error or non-2xx response — gracefully handle in UI.",
    "Response includes établecimento (main address), sócios (shareholders), optants (tax status).",
    "Common pattern: user enters CNPJ, buscarCnpj fetches, display company name and address.",
    "Debounce rapid CNPJ input before calling buscarCnpj to reduce API load.",
  ],
  rankingSignals: {
    freeText: 0.35,
    structuredChoice: 0.25,
    date: 0,
    number: 0.3,
    denseLayout: 0.1,
  },
};
