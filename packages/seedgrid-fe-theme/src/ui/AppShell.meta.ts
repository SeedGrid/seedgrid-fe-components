type SgMetaPropV0 = {
  name: string;
  type: string;
  required?: boolean;
  default?: unknown;
  description?: string;
  semanticRole?: "value" | "label" | "validation" | "behavior" | "appearance" | "event" | "data";
  bindable?: boolean;
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
  examples?: Array<{ id: string; title: string; file: string; kind: "sample" | "playground" }>;
  showcase?: { route: string; hasPlayground: boolean; hasPropsTable: boolean };
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
  componentId: "layout.app-shell",
  package: "@seedgrid/fe-theme",
  exportName: "AppShell",
  slug: "app-shell",
  displayName: "AppShell",
  category: "layout",
  subcategory: "shell",
  description: "Shell de aplicacao baseado no tema legado, com area de navegacao lateral, header opcional e superficie principal.",
  tags: ["layout", "shell", "app", "navigation", "legacy-theme"],
  capabilities: ["sidebar-layout", "header-slot", "themed-surface", "legacy-theme-aware"],
  fieldSemantics: ["appShell", "navigationLayout", "pageFrame"],
  props: [
    { name: "children", type: "ReactNode", required: true, description: "Conteudo principal da aplicacao.", semanticRole: "data", bindable: false },
    { name: "nav", type: "ReactNode", description: "Conteudo da navegacao lateral.", semanticRole: "data", bindable: false },
    { name: "header", type: "ReactNode", description: "Conteudo opcional de cabecalho.", semanticRole: "data", bindable: false }
  ],
  states: ["default", "with-nav", "with-header"],
  examples: [],
  showcase: { route: "/packages/fe-theme/app-shell", hasPlayground: false, hasPropsTable: false },
  sdui: {
    rendererType: "layout.app-shell",
    acceptsDataBinding: true,
    defaultProps: {}
  }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Montar um shell simples de aplicacao com menu lateral e area principal.",
    "Demonstrar o tema legado aplicado a uma estrutura de pagina completa."
  ],
  avoidUseCases: [
    "Layouts altamente customizaveis com docking ou zonas complexas.",
    "Novo shell baseado no sistema moderno de componentes, se existir alternativa mais atual."
  ],
  synonyms: ["app shell", "application shell", "page frame", "layout shell"],
  relatedEntityFields: ["nav", "header", "layout", "shell"],
  compositionHints: [
    "Usar junto de ThemeProvider em contextos legados.",
    "Migrar para estruturas mais modernas quando o shell deixar de depender do tema legado."
  ],
  rankingSignals: { freeText: 0.12, structuredChoice: 0.24, date: 0, number: 0, denseLayout: 0.9 }
};
