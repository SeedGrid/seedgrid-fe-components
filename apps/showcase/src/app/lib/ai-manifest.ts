type AiManifestProp = {
  name: string;
  type: string;
  required?: boolean;
  default?: unknown;
  description?: string;
  semanticRole?: "value" | "label" | "validation" | "behavior" | "appearance" | "event" | "data";
  bindable?: boolean;
};

export type AiManifestComponent = {
  componentId: string;
  exportName: string;
  sgMeta: {
    version: string;
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
    props?: AiManifestProp[];
    states?: string[];
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
  aiHints: {
    version: string;
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
};

export type AiManifest = {
  schemaVersion: string;
  package?: string;
  packageVersion?: string;
  components: AiManifestComponent[];
};

export async function loadAiManifest(): Promise<AiManifest | null> {
  try {
    const response = await fetch("/api/ai-manifest", {
      cache: "no-store"
    });
    if (!response.ok) return null;
    return (await response.json()) as AiManifest;
  } catch {
    return null;
  }
}

export async function loadAiManifestComponent(exportName: string): Promise<AiManifestComponent | null> {
  const manifest = await loadAiManifest();
  if (!manifest) return null;
  return manifest.components.find((component) => component.exportName === exportName) ?? null;
}
