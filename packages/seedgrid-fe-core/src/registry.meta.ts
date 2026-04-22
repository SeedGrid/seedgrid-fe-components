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
  componentId: "provider.registry",
  package: "@seedgrid/fe-core",
  exportName: "SeedGridRegistry",
  slug: "seedgrid-registry",
  displayName: "SeedGrid Registry",
  category: "provider",
  subcategory: "registry",
  description:
    "Centralized provider and route registry for modular SeedGrid applications. Manages composition of providers, navigation items, and routes with ordering support.",
  tags: ["registry", "provider", "composition", "modular", "architecture"],
  capabilities: ["navItem", "provider", "route", "ordering"],
  fieldSemantics: ["registry", "composition", "navigation"],
  props: [
    {
      name: "addProvider",
      type: "(provider: SeedGridProvider) => void",
      required: true,
      description: "Register a React provider component (context wrapper).",
      semanticRole: "behavior",
    },
    {
      name: "addNavItem",
      type: "(item: SeedGridNavItem) => void",
      required: true,
      description:
        "Register a navigation item with id, labelKey, href, optional icon and order.",
      semanticRole: "behavior",
    },
    {
      name: "addRoute",
      type: "(route: SeedGridRoute) => void",
      required: true,
      description: "Register an application route with id, path, and auth requirements.",
      semanticRole: "behavior",
    },
    {
      name: "getProviders",
      type: "() => SeedGridProvider[]",
      required: true,
      description: "Retrieve all registered providers as a flat array.",
      semanticRole: "behavior",
    },
    {
      name: "getNavItems",
      type: "() => SeedGridNavItem[]",
      required: true,
      description:
        "Retrieve all registered navigation items sorted by order (default 999).",
      semanticRole: "behavior",
    },
    {
      name: "getRoutes",
      type: "() => SeedGridRoute[]",
      required: true,
      description: "Retrieve all registered routes.",
      semanticRole: "behavior",
    },
  ],
  states: ["initialized", "empty", "populated"],
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Modular application architecture where features register themselves independently.",
    "Dynamic provider composition to avoid prop drilling and provider hell.",
    "Centralized routing and navigation configuration across modules.",
  ],
  avoidUseCases: [
    "Simple single-feature applications that don't need modular composition.",
    "Direct React Context usage when a single provider suffices.",
  ],
  synonyms: ["module registry", "provider registry", "app composer", "navigation builder"],
  relatedEntityFields: ["module", "provider", "navigation", "route", "composition"],
  compositionHints: [
    "Registry is typically paired with SeedGridModuleManifest for self-contained module definitions.",
    "Providers registered to the registry should be wrapped to inject dependencies from environment/core.",
    "Order-based nav item sorting enables feature modules to control their menu position without cross-module coupling.",
  ],
  rankingSignals: {
    freeText: 0.3,
    structuredChoice: 0.4,
    date: 0,
    number: 0,
    denseLayout: 0.2,
  },
};
