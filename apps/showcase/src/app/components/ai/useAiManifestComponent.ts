"use client";

import React from "react";
import { loadAiManifestComponent, type AiManifestComponent } from "../../lib/ai-manifest";

const componentCache = new Map<string, AiManifestComponent | null>();

export function useAiManifestComponent(exportName: string) {
  const [component, setComponent] = React.useState<AiManifestComponent | null>(
    componentCache.has(exportName) ? componentCache.get(exportName) ?? null : null
  );

  React.useEffect(() => {
    let active = true;

    if (componentCache.has(exportName)) {
      setComponent(componentCache.get(exportName) ?? null);
      return () => {
        active = false;
      };
    }

    const load = async () => {
      const loaded = await loadAiManifestComponent(exportName);
      componentCache.set(exportName, loaded);
      if (active) {
        setComponent(loaded);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [exportName]);

  return component;
}
