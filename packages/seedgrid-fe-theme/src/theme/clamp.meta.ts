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
  componentId: "utility.clamp",
  package: "@seedgrid/fe-theme",
  exportName: "clamp",
  slug: "clamp",
  displayName: "clamp",
  category: "utility",
  subcategory: "math",
  description: "Funcao utilitaria para limitar um numero entre minimo e maximo.",
  tags: ["utility", "math", "range"],
  capabilities: ["numeric-clamp", "value-bounding"],
  fieldSemantics: ["rangeConstraint", "numericClamp"],
  props: [
    { name: "n", type: "number", required: true, description: "Valor a limitar.", semanticRole: "value", bindable: true },
    { name: "a", type: "number", required: true, description: "Limite minimo.", semanticRole: "validation", bindable: true },
    { name: "b", type: "number", required: true, description: "Limite maximo.", semanticRole: "validation", bindable: true }
  ],
  states: [],
  examples: [],
  showcase: { route: "/packages/fe-theme/clamp", hasPlayground: false, hasPropsTable: false },
  sdui: { rendererType: "utility.clamp", acceptsDataBinding: false, defaultProps: {} }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Limitar valores numericos em utilitarios de tema e cor.",
    "Garantir que saturacao, luminosidade ou canais RGB fiquem dentro do intervalo valido."
  ],
  avoidUseCases: [
    "Validacao complexa de dominio ou regras de negocio.",
    "Fluxos de interface onde um input especializado seria mais apropriado."
  ],
  synonyms: ["clamp", "bound number", "limit value"],
  relatedEntityFields: ["min", "max", "value"],
  compositionHints: [
    "Usar em helpers de cor e tokenizacao quando for preciso manter valores em faixas validas."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0, date: 0, number: 0.86, denseLayout: 0.15 }
};
