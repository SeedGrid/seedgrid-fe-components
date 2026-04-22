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
  componentId: "utility.build-scale-from-hex",
  package: "@seedgrid/fe-theme",
  exportName: "buildScaleFromHex",
  slug: "build-scale-from-hex",
  displayName: "buildScaleFromHex",
  category: "utility",
  subcategory: "color-scale",
  description: "Gera uma escala tonal 50..900 a partir de uma cor base hexadecimal e do modo resolvido.",
  tags: ["utility", "color", "palette", "theme"],
  capabilities: ["palette-generation", "mode-aware-scale", "hsl-harmonization"],
  fieldSemantics: ["colorScaleGeneration", "themePalette"],
  props: [
    { name: "baseHex", type: "string", required: true, description: "Cor base hexadecimal.", semanticRole: "value", bindable: true },
    { name: "resolvedMode", type: '"light" | "dark"', required: true, description: "Modo usado para calcular a escala.", semanticRole: "behavior", bindable: true },
    { name: "opts.boostS", type: "number", description: "Ajuste opcional de saturacao.", semanticRole: "behavior", bindable: true },
    { name: "opts.biasL", type: "number", description: "Ajuste opcional de luminosidade.", semanticRole: "behavior", bindable: true }
  ],
  states: ["light", "dark"],
  examples: [],
  showcase: { route: "/packages/fe-theme/build-scale-from-hex", hasPlayground: false, hasPropsTable: false },
  sdui: { rendererType: "utility.build-scale-from-hex", acceptsDataBinding: false, defaultProps: { opts: {} } }
};

export const aiHints: SgAiHintsV0 = {
  version: "0.1",
  preferredUseCases: [
    "Gerar paletas tonais a partir de uma seed color.",
    "Construir escalas harmonizadas para tema claro e escuro."
  ],
  avoidUseCases: [
    "Conversao simples de uma unica cor sem necessidade de escala.",
    "Escolha manual de tokens quando a paleta ja estiver pronta."
  ],
  synonyms: ["build color scale", "palette generator", "hex scale"],
  relatedEntityFields: ["seed", "palette", "colorScale", "mode"],
  compositionHints: [
    "Usar com generateThemeVars e outros utilitarios de tokenizacao."
  ],
  rankingSignals: { freeText: 0, structuredChoice: 0.2, date: 0, number: 0.54, denseLayout: 0.32 }
};
