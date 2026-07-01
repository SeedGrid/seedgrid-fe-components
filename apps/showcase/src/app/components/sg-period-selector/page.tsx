"use client";

import React from "react";
import { SgPeriodSelector, SgToggleSwitch, type ResolvedPeriod } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import I18NReady from "../I18NReady";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import SgCodeBlockBase from "../sgCodeBlockBase";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../i18n";

const K = "showcase.component.periodSelector";
const SAMPLES = "apps/showcase/src/app/components/sg-period-selector/samples";

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

function formatDate(date: Date | null): string {
  if (!date) return "null";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

function ResolvedOutput(props: { i18n: ReturnType<typeof useShowcaseI18n>; period: ResolvedPeriod | null }) {
  const { i18n, period } = props;
  if (!period) {
    return (
      <div className="mt-2 rounded border border-border bg-foreground/5 p-2 text-xs">
        {t(i18n, `${K}.noneSelected`)}
      </div>
    );
  }
  return (
    <div className="mt-2 rounded border border-border bg-foreground/5 p-2 text-xs font-mono">
      <div>preset: {period.preset}</div>
      <div>{t(i18n, `${K}.outLabel`)}: {period.label}</div>
      <div>{t(i18n, `${K}.outStart`)}: {formatDate(period.startDate)}</div>
      <div>{t(i18n, `${K}.outEnd`)}: {formatDate(period.endDate)}</div>
    </div>
  );
}

function FlagsInteractiveDemo(props: { i18n: ReturnType<typeof useShowcaseI18n> }) {
  const { i18n } = props;
  const [permitPast, setPermitPast] = React.useState(true);
  const [permitCurrent, setPermitCurrent] = React.useState(true);
  const [permitFuture, setPermitFuture] = React.useState(false);
  const [period, setPeriod] = React.useState<ResolvedPeriod | null>(null);

  return (
    <div className="w-96 space-y-3">
      <div className="flex flex-wrap gap-4">
        <SgToggleSwitch id="ps-flag-past" label="permitPast" checked={permitPast} onChange={setPermitPast} />
        <SgToggleSwitch id="ps-flag-current" label="permitCurrent" checked={permitCurrent} onChange={setPermitCurrent} />
        <SgToggleSwitch id="ps-flag-future" label="permitFuture" checked={permitFuture} onChange={setPermitFuture} />
      </div>
      <SgPeriodSelector
        id="ps-flags"
        label={t(i18n, `${K}.fieldLabel`)}
        locale={i18n.locale}
        permitPast={permitPast}
        permitCurrent={permitCurrent}
        permitFuture={permitFuture}
        permitAll={false}
        onChange={setPeriod}
      />
      <ResolvedOutput i18n={i18n} period={period} />
    </div>
  );
}

function getPeriodSelectorProps(i18n: ReturnType<typeof useShowcaseI18n>): ShowcasePropRow[] {
  return [
    { prop: "value", type: "PeriodPreset", defaultValue: "-", description: t(i18n, `${K}.props.value`) },
    { prop: "onChange", type: "(period: ResolvedPeriod) => void", defaultValue: "-", description: t(i18n, `${K}.props.onChange`) },
    { prop: "permitPast", type: "boolean", defaultValue: "true", description: t(i18n, `${K}.props.permitPast`) },
    { prop: "permitCurrent", type: "boolean", defaultValue: "true", description: t(i18n, `${K}.props.permitCurrent`) },
    { prop: "permitFuture", type: "boolean", defaultValue: "true", description: t(i18n, `${K}.props.permitFuture`) },
    { prop: "permitAll", type: "boolean", defaultValue: "true", description: t(i18n, `${K}.props.permitAll`) },
    { prop: "allowCustomPeriod", type: "boolean", defaultValue: "true", description: t(i18n, `${K}.props.allowCustomPeriod`) },
    { prop: "locale", type: "string", defaultValue: "pt-BR", description: t(i18n, `${K}.props.locale`) },
    { prop: "minDate", type: "Date", defaultValue: "-", description: t(i18n, `${K}.props.minDate`) },
    { prop: "maxDate", type: "Date", defaultValue: "-", description: t(i18n, `${K}.props.maxDate`) },
    { prop: "disabled", type: "boolean", defaultValue: "false", description: t(i18n, `${K}.props.disabled`) },
    { prop: "required", type: "boolean", defaultValue: "false", description: t(i18n, `${K}.props.required`) }
  ];
}

export default function SgPeriodSelectorPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgPeriodSelector");
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

  const propRows = React.useMemo(() => getPeriodSelectorProps(i18n), [i18n]);
  const monthStart = React.useMemo(() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1); }, []);
  const monthEnd = React.useMemo(() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth() + 1, 0); }, []);

  const [basic, setBasic] = React.useState<ResolvedPeriod | null>(null);
  const [custom, setCustom] = React.useState<ResolvedPeriod | null>(null);
  const [clamped, setClamped] = React.useState<ResolvedPeriod | null>(null);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgPeriodSelector"
          subtitle={t(i18n, `${K}.headerSubtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={t(i18n, `${K}.section1Title`)}
          description={t(i18n, `${K}.section1Description`)}
        >
          <div className="w-96">
            <SgPeriodSelector
              id="ps-basic"
              label={t(i18n, `${K}.fieldLabel`)}
              locale={i18n.locale}
              onChange={setBasic}
            />
            <ResolvedOutput i18n={i18n} period={basic} />
          </div>
          <CodeBlock sampleFile={`${SAMPLES}/basico.tsx.sample`} />
        </Section>

        <Section
          title={t(i18n, `${K}.section2Title`)}
          description={t(i18n, `${K}.section2Description`)}
        >
          <FlagsInteractiveDemo i18n={i18n} />
          <CodeBlock sampleFile={`${SAMPLES}/flags-interativas.tsx.sample`} />
        </Section>

        <Section
          title={t(i18n, `${K}.section3Title`)}
          description={t(i18n, `${K}.section3Description`)}
        >
          <div className="w-96">
            <SgPeriodSelector
              id="ps-custom"
              label={t(i18n, `${K}.fieldLabel`)}
              locale={i18n.locale}
              allowCustomPeriod
              permitCurrent={false}
              permitPast={false}
              onChange={setCustom}
            />
            <ResolvedOutput i18n={i18n} period={custom} />
          </div>
          <CodeBlock sampleFile={`${SAMPLES}/periodo-personalizado.tsx.sample`} />
        </Section>

        <Section
          title={t(i18n, `${K}.section4Title`)}
          description={t(i18n, `${K}.section4Description`)}
        >
          <div className="w-96">
            <SgPeriodSelector
              id="ps-disabled"
              label={t(i18n, `${K}.fieldLabel`)}
              locale={i18n.locale}
              disabled
            />
          </div>
          <div className="w-96">
            <SgPeriodSelector
              id="ps-required"
              label={t(i18n, `${K}.fieldLabel`)}
              locale={i18n.locale}
              required
            />
          </div>
          <CodeBlock sampleFile={`${SAMPLES}/desabilitado-e-obrigatorio.tsx.sample`} />
        </Section>

        <Section
          title={t(i18n, `${K}.section5Title`)}
          description={t(i18n, `${K}.section5Description`)}
        >
          <div className="w-96">
            <SgPeriodSelector
              id="ps-clamped"
              label={t(i18n, `${K}.fieldLabel`)}
              locale={i18n.locale}
              permitPast
              permitCurrent
              permitFuture
              minDate={monthStart}
              maxDate={monthEnd}
              onChange={setClamped}
            />
            <ResolvedOutput i18n={i18n} period={clamped} />
          </div>
          <CodeBlock sampleFile={`${SAMPLES}/clamp-min-max.tsx.sample`} />
        </Section>

        <Section
          title={t(i18n, `${K}.section6Title`)}
          description={t(i18n, `${K}.section6Description`)}
        >
          <SgPlayground
            title="SgPeriodSelector Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-period-selector/sg-period-selector.tsx.playground"
            height={560}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={propRows} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
