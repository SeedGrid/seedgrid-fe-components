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
  componentId: "hook.use-sg-theme",
  package: "@seedgrid/fe-theme",
  exportName: "useSgTheme",
  slug: "use-sg-theme",
  displayName: "useSgTheme",
  category: "hook",
  subcategory: "theme",
  description:
    "Hook para acessar contexto de tema. Fornece variaveis CSS, modo atual, funcoes para alternar tema e modo.",
  tags: ["hook", "theme", "design-tokens", "context"],
  capabilities: ["theme-access", "mode-toggling", "css-variables"],
  fieldSemantics: ["themeContext", "designTokens", "colorScheme"],
  props: [
    {
      name: "returns.vars",
      type: "Record<string, string>",
      description: "Dicionario de variaveis CSS atuais (cores, raios, etc).",
      semanticRole: "data",
      bindable: false
    },
    {
      name: "returns.setTheme",
      type: "(next: Partial<SeedThemeInput>) => void",
      description: "Funcao para alterar tema (seed, mode, radius).",
      semanticRole: "event",
      bindable: false
    },
    {
      name: "returns.setMode",
      type: "(m: 'light' | 'dark') => void",
      description: "Funcao para alternar modo claro/escuro.",
      semanticRole: "event",
      bindable: false
    },
    {
      name: "returns.currentMode",
      type: "'light' | 'dark'",
      description: "Modo atual normalizado (sem 'auto').",
      semanticRole: "data",
      bindable: true
    },
    {
      name: "returns.currentTheme",
      type: "{ seed: string; mode?: Mode; radius?: string }",
      description: "Tema atual (seed, mode, radius).",
      semanticRole: "data",
      bindable: false
    }
  ],
  states: ["light", "dark"],
  examples: [
    {
      id: "basic",
      title: "Acessar tema atual",
      file: "apps/showcase/src/app/components/hooks/use-sg-theme/samples/basic.tsx.sample",
      kind: "sample"
    },
    {
      id: "theme-switcher",
      title: "Criar seletor de tema",
      file: "apps/showcase/src/app/components/hooks/use-sg-theme/samples/theme-switcher.tsx.sample",
      kind: "sample"
    },
    {
      id: "dark-mode-toggle",
      title: "Toggle claro/escuro",
      file: "apps/showcase/src/app/components/hooks/use-sg-theme/samples/dark-mode-toggle.tsx.sample",
      kind: "sample"
    }
  ],
  showcase: {
    route: "/components/hooks/use-sg-theme",
    hasPlayground: true,
    hasPropsTable: true
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Ler variaveis de tema para usar em componentes customizados.",
    "Criar seletor de tema com lista de opcoes.",
    "Implementar toggle de modo claro/escuro.",
    "Reagir a mudancas de tema."
  ],
  avoidUseCases: [
    "Usar fora de SeedThemeProvider; vai lancar erro.",
    "Modificar diretamente o contexto; use setTheme e setMode."
  ],
  synonyms: ["theme context", "theme hook", "design token access"],
  relatedEntityFields: ["theme", "mode", "darkMode", "styling"],
  compositionHints: [
    "Usar dentro de SeedThemeProvider.",
    "Combinar com button ou select para UI de mudanca de tema.",
    "Acessar currentMode para renderizacao condicional (light vs dark)."
  ],
  rankingSignals: {
    freeText: 0.8,
    structuredChoice: 0.85,
    date: 0,
    number: 0.3,
    denseLayout: 0.7
  }
};
