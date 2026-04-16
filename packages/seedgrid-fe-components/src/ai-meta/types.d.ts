export type SgMetaPropV0 = {
    name: string;
    type: string;
    required?: boolean;
    default?: unknown;
    description?: string;
    semanticRole?: "value" | "label" | "validation" | "behavior" | "appearance" | "event" | "data";
    bindable?: boolean;
};
export type SgMetaExampleV0 = {
    id: string;
    title: string;
    file: string;
    kind: "sample" | "playground";
};
export type SgMetaV0 = {
    version: "0.1";
    componentId: string;
    package: "@seedgrid/fe-components";
    exportName: string;
    slug: string;
    displayName: string;
    category: "input" | "action" | "layout" | "feedback" | "navigation" | "data" | "provider" | "hook" | "gadget";
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
export type SgAiHintsV0 = {
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
//# sourceMappingURL=types.d.ts.map