"use client";

import React from "react";
import {
  SgClockThemePreview,
  sgClockThemesBuiltIn
} from "@seedgrid/fe-components";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";
import ComponentAiPropsTable from "../../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../../ai/useAiManifestComponent";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

const CLOCK_THEME_PREVIEW_PROPS: ShowcasePropRow[] = [
  { prop: "theme", type: "SgClockTheme", defaultValue: "-", description: "Tema visual usado na renderizacao do preview." },
  { prop: "size", type: "number", defaultValue: "64", description: "Tamanho quadrado do preview." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classes adicionais aplicadas ao SVG." }
];

function ThemeGallery() {
  const themes = React.useMemo(() => sgClockThemesBuiltIn.slice(0, 8), []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {themes.map((theme) => (
        <div key={theme.id} className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-center rounded-md bg-foreground/5 p-4 text-foreground">
            <SgClockThemePreview theme={theme} size={72} />
          </div>
          <p className="mt-3 text-sm font-medium">{theme.label ?? theme.id}</p>
          <p className="text-xs text-muted-foreground">{theme.id}</p>
        </div>
      ))}
    </div>
  );
}

export default function SgClockThemePreviewPage() {
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors();
  const aiComponent = useAiManifestComponent("SgClockThemePreview");

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgClockThemePreview"
          subtitle="Miniatura SVG para comparar estilos visuais de clock antes da selecao."
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}

        <Section
          title="1) Theme gallery"
          description="Previews compactos de temas embutidos para comparacao visual."
        >
          <ThemeGallery />
        </Section>

        <ShowcasePropsReference rows={CLOCK_THEME_PREVIEW_PROPS} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
