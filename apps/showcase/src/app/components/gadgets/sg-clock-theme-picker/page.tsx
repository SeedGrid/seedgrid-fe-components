"use client";

import React from "react";
import {
  SgClock,
  SgClockThemePicker,
  SgClockThemeProvider,
  SgTimeProvider
} from "@seedgrid/fe-components";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";
import ComponentAiPropsTable from "../../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../../ai/useAiManifestComponent";
import { t, useShowcaseI18n } from "../../../../i18n";

const K = "showcase.component.clockThemePicker";

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

function getClockThemePickerProps(i18n: ReturnType<typeof useShowcaseI18n>): ShowcasePropRow[] {
  return [
    { prop: "value", type: "string", defaultValue: "-", description: t(i18n, `${K}.props.value`) },
    { prop: "onChange", type: "(id: string) => void", defaultValue: "-", description: t(i18n, `${K}.props.onChange`) },
    { prop: "label", type: "string", defaultValue: 'tema', description: t(i18n, `${K}.props.label`) },
    { prop: "placeholder", type: "string", defaultValue: "tema padrao", description: t(i18n, `${K}.props.placeholder`) },
    { prop: "filter", type: "(theme) => boolean", defaultValue: "-", description: t(i18n, `${K}.props.filter`) },
    { prop: "previewSize", type: "number", defaultValue: "56", description: t(i18n, `${K}.props.previewSize`) },
    { prop: "searchable", type: "boolean", defaultValue: "true", description: t(i18n, `${K}.props.searchable`) },
    { prop: "fallbackThemeId", type: "string", defaultValue: '"classic"', description: t(i18n, `${K}.props.fallbackThemeId`) },
    { prop: "defaultOpen", type: "boolean", defaultValue: "false", description: t(i18n, `${K}.props.defaultOpen`) }
  ];
}

function LiveThemePicker() {
  const [themeId, setThemeId] = React.useState("classic");
  const now = new Date().toISOString();

  return (
    <SgTimeProvider initialServerTime={now}>
      <SgClockThemeProvider>
        <div className="flex flex-col items-center gap-4 rounded-lg border border-border p-4">
          <SgClock themeId={themeId} />
          <div className="w-full max-w-md">
            <SgClockThemePicker value={themeId} onChange={setThemeId} />
          </div>
        </div>
      </SgClockThemeProvider>
    </SgTimeProvider>
  );
}

export default function SgClockThemePickerPage() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({ deps: [i18n.locale] });
  const aiComponent = useAiManifestComponent("SgClockThemePicker");
  const propRows = React.useMemo(() => getClockThemePickerProps(i18n), [i18n]);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-4xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgClockThemePicker"
          subtitle={t(i18n, `${K}.subtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={t(i18n, `${K}.section1Title`)}
          description={t(i18n, `${K}.section1Description`)}
        >
          <LiveThemePicker />
        </Section>

        <ShowcasePropsReference rows={propRows} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
