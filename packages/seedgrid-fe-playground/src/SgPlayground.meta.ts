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
  componentId: "gadget.playground",
  package: "@seedgrid/fe-playground",
  exportName: "SgPlayground",
  slug: "sg-playground",
  displayName: "SeedGrid Playground",
  category: "gadget",
  subcategory: "playground",
  description:
    "Interactive code playground component powered by Sandpack. Embed live, editable code examples with preview, customizable presets, dependency management, and private NPM registry support.",
  tags: ["playground", "sandbox", "code", "interactive", "example", "demo"],
  capabilities: ["interactive", "sandpack", "custom-dependencies", "npm-registry"],
  fieldSemantics: ["code", "example", "playground", "demo"],
  props: [
    {
      name: "code or playgroundFile",
      type: "string",
      required: true,
      description: "JSX/TSX code to execute, or path to a playground file.",
      semanticRole: "data",
    },
    {
      name: "preset",
      type: "'auto' | 'basic' | 'seedgrid' | 'editor' | 'full'",
      required: false,
      default: "auto",
      description:
        "Preset: auto (auto-detect), basic (minimal), seedgrid (SeedGrid optimized), editor (code-focused), full (all features).",
      semanticRole: "behavior",
    },
    {
      name: "interactive",
      type: "boolean",
      required: false,
      default: true,
      description: "Enable/disable code editing and execution.",
      semanticRole: "behavior",
    },
    {
      name: "title",
      type: "string",
      required: false,
      description: "Display title above the playground.",
      semanticRole: "label",
    },
    {
      name: "description",
      type: "string",
      required: false,
      description: "Descriptive text shown below the title.",
      semanticRole: "label",
    },
    {
      name: "height",
      type: "string | number",
      required: false,
      default: "400px",
      description: "Playground container height.",
      semanticRole: "appearance",
    },
    {
      name: "expandedHeight",
      type: "string | number",
      required: false,
      description: "Height when expanded (if expandable is true).",
      semanticRole: "appearance",
    },
    {
      name: "expandable",
      type: "boolean",
      required: false,
      description: "Allow toggling between collapsed and expanded view.",
      semanticRole: "behavior",
    },
    {
      name: "resizable",
      type: "boolean",
      required: false,
      description: "Allow manual resizing of the playground panels.",
      semanticRole: "behavior",
    },
    {
      name: "resizeAxis",
      type: "'vertical' | 'horizontal' | 'both'",
      required: false,
      description: "Restrict resize direction: vertical (editor/preview split), horizontal (left/right), both.",
      semanticRole: "behavior",
    },
    {
      name: "previewPadding",
      type: "string | number",
      required: false,
      description: "Padding inside the preview container.",
      semanticRole: "appearance",
    },
    {
      name: "dependencies",
      type: "Record<string, string>",
      required: false,
      description:
        "Additional npm packages (e.g. { 'lodash': '^4.17.0' }). Merged with preset defaults.",
      semanticRole: "data",
    },
    {
      name: "defaultImports",
      type: "string",
      required: false,
      description:
        "Import statements injected at the top of user code (e.g. 'import React from \"react\"').",
      semanticRole: "data",
    },
    {
      name: "seedgridDependency",
      type: "string",
      required: false,
      description: "Override the @seedgrid/fe-components version (for seedgrid preset).",
      semanticRole: "data",
    },
    {
      name: "bundlerURL",
      type: "string",
      required: false,
      default: "https://sandpack.seedgrid.com.br",
      description: "Custom Sandpack bundler endpoint.",
      semanticRole: "data",
    },
    {
      name: "bundlerTimeoutMs",
      type: "number",
      required: false,
      default: 60000,
      description: "Bundler timeout in milliseconds.",
      semanticRole: "data",
    },
    {
      name: "npmRegistries",
      type: "SgPlaygroundNpmRegistry[]",
      required: false,
      description:
        "Custom NPM registries with scope filtering and optional proxy/auth.",
      semanticRole: "data",
    },
    {
      name: "withCard",
      type: "boolean",
      required: false,
      description: "Wrap playground in an SgCard component.",
      semanticRole: "appearance",
    },
    {
      name: "collapsible",
      type: "boolean",
      required: false,
      description: "Show collapse/expand toggle on the card.",
      semanticRole: "behavior",
    },
    {
      name: "defaultOpen",
      type: "boolean",
      required: false,
      default: true,
      description: "Initial open/closed state (if collapsible).",
      semanticRole: "behavior",
    },
  ],
  states: ["ready", "loading", "error", "collapsed", "expanded"],
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Embedding live, editable code examples in documentation or tutorials.",
    "Interactive component showcases where users can modify props and see results in real-time.",
    "Demo code sandboxes that allow experimentation without external dependencies.",
  ],
  avoidUseCases: [
    "Production applications requiring strict security (avoid exposing user-facing bundler).",
    "Complex multi-file projects — playground is single-file focused.",
  ],
  synonyms: ["code sandbox", "interactive editor", "live demo", "code playground"],
  relatedEntityFields: [
    "code",
    "example",
    "documentation",
    "tutorial",
    "component",
  ],
  compositionHints: [
    "Use preset='seedgrid' for demos of SeedGrid components (includes necessary shims).",
    "Preset='basic' for minimal setup; preset='full' for complete feature set.",
    "Combine with expandable/collapsible for better UX in dense documentation.",
    "Custom bundlerURL allows self-hosted sandpack for air-gapped environments.",
    "npmRegistries support private package distribution (e.g. internal component libs).",
  ],
  rankingSignals: {
    freeText: 0.3,
    structuredChoice: 0.2,
    date: 0,
    number: 0,
    denseLayout: 0.4,
  },
};
