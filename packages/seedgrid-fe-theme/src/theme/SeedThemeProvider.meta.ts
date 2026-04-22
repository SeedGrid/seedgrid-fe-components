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
  componentId: "provider.seed-theme",
  package: "@seedgrid/fe-theme",
  exportName: "SeedThemeProvider",
  slug: "seed-theme-provider",
  displayName: "SeedThemeProvider",
  category: "provider",
  subcategory: "theme",
  description:
    "Provider de tema SeedGrid com suporte a modo claro/escuro, persistencia, deteccao de modo do sistema e customizacao de cores e raio de borda.",
  tags: ["provider", "theme", "dark-mode", "persistence", "design-tokens"],
  capabilities: ["light-dark-mode", "auto-detect-system", "theme-persistence", "css-variables", "dynamic-theming"],
  fieldSemantics: ["themeProvider", "designTokens", "colorScheme"],
  props: [
    {
      name: "initialTheme",
      type: "SeedThemeInput",
      description: "Configuracao inicial do tema (seed, mode, radius, persistenceStrategy, persistMode).",
      semanticRole: "data",
      bindable: true
    },
    {
      name: "applyTo",
      type: '"html" | "wrapper"',
      default: "html",
      description: "Onde aplicar as variaveis CSS (html ou div wrapper).",
      semanticRole: "behavior",
      bindable: true
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      description: "Arvore de componentes que consome o contexto de tema.",
      semanticRole: "data",
      bindable: false
    }
  ],
  states: ["light", "dark", "auto"],
  examples: [
    {
      id: "basic",
      title: "Tema basico com modo claro",
      file: "apps/showcase/src/app/components/providers/seed-theme-provider/samples/basic.tsx.sample",
      kind: "sample"
    },
    {
      id: "dark-mode",
      title: "Com modo escuro customizado",
      file: "apps/showcase/src/app/components/providers/seed-theme-provider/samples/dark-mode.tsx.sample",
      kind: "sample"
    },
    {
      id: "auto-detect",
      title: "Auto-deteccao do modo do sistema",
      file: "apps/showcase/src/app/components/providers/seed-theme-provider/samples/auto-detect.tsx.sample",
      kind: "sample"
    },
    {
      id: "theme-switcher",
      title: "Seletor dinamico de tema",
      file: "apps/showcase/src/app/components/providers/seed-theme-provider/samples/theme-switcher.tsx.sample",
      kind: "sample"
    }
  ],
  showcase: {
    route: "/components/providers/seed-theme-provider",
    hasPlayground: true,
    hasPropsTable: true
  },
  sdui: {
    rendererType: "provider.seed-theme",
    acceptsDataBinding: true,
    defaultProps: {
      applyTo: "html"
    }
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Aplicar tema SeedGrid a toda a aplicacao com variaveis CSS.",
    "Suportar modo claro/escuro com persistencia de preferencia.",
    "Auto-detectar preferencia do usuario a partir do sistema operacional.",
    "Customizar cores e raio de borda dinamicamente."
  ],
  avoidUseCases: [
    "Apenas trocar cores de componentes individuais; use CSS direto.",
    "Tema nao-SeedGrid; considere solucoes de terceiros (next-themes, etc)."
  ],
  synonyms: ["theme provider", "seed theme", "design token provider"],
  relatedEntityFields: ["theme", "mode", "colors", "darkMode"],
  compositionHints: [
    "Posicionar no topo da arvore React para afetar todos os componentes.",
    "Combinar com useSgTheme() para acessar contexto e alterar tema.",
    "Usar com SgEnvironmentProvider para persistencia coordenada."
  ],
  rankingSignals: {
    freeText: 0.7,
    structuredChoice: 0.9,
    date: 0,
    number: 0.3,
    denseLayout: 0.8
  }
};
