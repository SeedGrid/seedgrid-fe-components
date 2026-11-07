"use client";

import React from "react";
import {
  SgClockThemePreview,
  sgClockThemesBuiltIn,
  type SgClockTheme
} from "@seedgrid/fe-components";
import SgCodeBlockBase from "../../sgCodeBlockBase";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";
import ComponentAiPropsTable from "../../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../../ai/useAiManifestComponent";
import { t, useShowcaseI18n } from "../../../../i18n";

const K = "showcase.component.clockThemePreview";

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

function getClockThemePreviewProps(i18n: ReturnType<typeof useShowcaseI18n>): ShowcasePropRow[] {
  return [
    { prop: "theme", type: "SgClockTheme", defaultValue: "-", description: t(i18n, `${K}.props.theme`) },
    { prop: "size", type: "number", defaultValue: "64", description: t(i18n, `${K}.props.size`) },
    { prop: "className", type: "string", defaultValue: "-", description: t(i18n, `${K}.props.className`) }
  ];
}

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

function SingleThemePreview() {
  return (
    <div className="flex items-center rounded-md bg-foreground/5 p-4 text-foreground">
      <SgClockThemePreview theme={sgClockThemesBuiltIn[0]!} />
    </div>
  );
}

function ThemePreviewSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-foreground">
      <SgClockThemePreview theme={sgClockThemesBuiltIn[7]!} size={32} />
      <SgClockThemePreview theme={sgClockThemesBuiltIn[7]!} />
      <SgClockThemePreview theme={sgClockThemesBuiltIn[7]!} size={128} />
    </div>
  );
}

const dotTheme: SgClockTheme = {
  id: "ponto",
  label: "Ponto",
  render: () => (
    <>
      <circle cx="50" cy="50" r="48" fill="#FFF7ED" stroke="#F97316" strokeWidth="2" />
      <circle cx="50" cy="12" r="3" fill="#F97316" />
    </>
  )
};

function OwnThemePreview() {
  return <SgClockThemePreview theme={dotTheme} size={96} />;
}

export default function SgClockThemePreviewPage() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({ deps: [i18n.locale] });
  const aiComponent = useAiManifestComponent("SgClockThemePreview");
  const propRows = React.useMemo(() => getClockThemePreviewProps(i18n), [i18n]);

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
          subtitle={t(i18n, `${K}.subtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={t(i18n, `${K}.section1Title`)}
          description={t(i18n, `${K}.section1Description`)}
        >
          <ThemeGallery />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-clock-theme-preview/samples/galeria-de-temas.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.section2Title`)}
          description={t(i18n, `${K}.section2Description`)}
        >
          <SingleThemePreview />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-clock-theme-preview/samples/um-tema.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.section3Title`)}
          description={t(i18n, `${K}.section3Description`)}
        >
          <ThemePreviewSizes />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-clock-theme-preview/samples/tamanhos.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.section4Title`)}
          description={t(i18n, `${K}.section4Description`)}
        >
          <OwnThemePreview />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-clock-theme-preview/samples/tema-proprio.tsx.sample" />
        </Section>

        <ShowcasePropsReference rows={propRows} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
