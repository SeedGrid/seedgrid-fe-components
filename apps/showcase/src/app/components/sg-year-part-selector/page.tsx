"use client";

import React from "react";
import { SgYearPartSelector, YearPartKind, type ResolvedYearPart } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import I18NReady from "../I18NReady";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import ShowcasePropsReference, { type ShowcasePropRow } from "../ShowcasePropsReference";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import SgCodeBlockBase from "../sgCodeBlockBase";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../i18n";

const K = "showcase.component.yearPartSelector";
const SAMPLES = "apps/showcase/src/app/components/sg-year-part-selector/samples";

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

function ResolvedOutput(props: { i18n: ReturnType<typeof useShowcaseI18n>; resolved: ResolvedYearPart | null }) {
  const { i18n, resolved } = props;
  if (!resolved) {
    return (
      <div className="mt-2 rounded border border-border bg-foreground/5 p-2 text-xs">
        {t(i18n, `${K}.noneSelected`)}
      </div>
    );
  }
  return (
    <div className="mt-2 rounded border border-border bg-foreground/5 p-2 text-xs font-mono">
      <div>value: {`{ ${resolved.value.year}, ${resolved.value.kind}, ${resolved.value.part} }`}</div>
      <div>{t(i18n, `${K}.outLabel`)}: {resolved.label}</div>
      <div>{t(i18n, `${K}.outStart`)}: {formatDate(resolved.startDate)}</div>
      <div>{t(i18n, `${K}.outEnd`)}: {formatDate(resolved.endDate)}</div>
    </div>
  );
}

function getYearPartSelectorProps(i18n: ReturnType<typeof useShowcaseI18n>): ShowcasePropRow[] {
  return [
    { prop: "id", type: "string", defaultValue: "sg-year-part-selector", description: t(i18n, `${K}.props.id`) },
    { prop: "label", type: "string", defaultValue: "-", description: t(i18n, `${K}.props.label`) },
    { prop: "value", type: "YearPartValue", defaultValue: "-", description: t(i18n, `${K}.props.value`) },
    { prop: "onChange", type: "(resolved: ResolvedYearPart) => void", defaultValue: "-", description: t(i18n, `${K}.props.onChange`) },
    { prop: "allowedKinds", type: "YearPartKind[]", defaultValue: "SEMESTER, QUARTER, BIMESTER", description: t(i18n, `${K}.props.allowedKinds`) },
    { prop: "minYear", type: "number", defaultValue: t(i18n, `${K}.defaults.minYear`), description: t(i18n, `${K}.props.minYear`) },
    { prop: "maxYear", type: "number", defaultValue: t(i18n, `${K}.defaults.maxYear`), description: t(i18n, `${K}.props.maxYear`) },
    { prop: "locale", type: "string", defaultValue: "pt-BR", description: t(i18n, `${K}.props.locale`) },
    { prop: "disabled", type: "boolean", defaultValue: "false", description: t(i18n, `${K}.props.disabled`) },
    { prop: "required", type: "boolean", defaultValue: "false", description: t(i18n, `${K}.props.required`) },
    { prop: "className", type: "string", defaultValue: "-", description: t(i18n, `${K}.props.className`) }
  ];
}

export default function SgYearPartSelectorPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgYearPartSelector");
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

  const propRows = React.useMemo(() => getYearPartSelectorProps(i18n), [i18n]);

  const [basic, setBasic] = React.useState<ResolvedYearPart | null>(null);
  const [semester, setSemester] = React.useState<ResolvedYearPart | null>(null);
  const [ranged, setRanged] = React.useState<ResolvedYearPart | null>(null);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgYearPartSelector"
          subtitle={t(i18n, `${K}.headerSubtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        {/*
          Fica fora de <Section> de proposito: nao e' um exemplo, e' a decisao de qual dos dois
          seletores usar. Dentro de Section entraria na lista de ancoras como se fosse um exemplo.
        */}
        <div className="rounded-lg border border-border bg-foreground/5 p-6">
          <h2 className="text-lg font-semibold">{t(i18n, `${K}.whenToUseTitle`)}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t(i18n, `${K}.whenToUseBody`)}</p>
        </div>

        <Section
          title={t(i18n, `${K}.section1Title`)}
          description={t(i18n, `${K}.section1Description`)}
        >
          <div className="w-full max-w-xl">
            <SgYearPartSelector
              id="yps-basic"
              label={t(i18n, `${K}.fieldLabel`)}
              locale={i18n.locale}
              onChange={setBasic}
            />
            <ResolvedOutput i18n={i18n} resolved={basic} />
          </div>
          <CodeBlock sampleFile={`${SAMPLES}/basico.tsx.sample`} />
        </Section>

        <Section
          title={t(i18n, `${K}.section2Title`)}
          description={t(i18n, `${K}.section2Description`)}
        >
          <div className="w-full max-w-xl">
            <SgYearPartSelector
              id="yps-semester"
              label={t(i18n, `${K}.semesterFieldLabel`)}
              locale={i18n.locale}
              allowedKinds={[YearPartKind.SEMESTER]}
              onChange={setSemester}
            />
            <ResolvedOutput i18n={i18n} resolved={semester} />
          </div>
          <CodeBlock sampleFile={`${SAMPLES}/so-semestre.tsx.sample`} />
        </Section>

        <Section
          title={t(i18n, `${K}.section3Title`)}
          description={t(i18n, `${K}.section3Description`)}
        >
          <div className="w-full max-w-xl">
            <SgYearPartSelector
              id="yps-range"
              label={t(i18n, `${K}.rangeFieldLabel`)}
              locale={i18n.locale}
              minYear={2020}
              maxYear={2026}
              onChange={setRanged}
            />
            <ResolvedOutput i18n={i18n} resolved={ranged} />
          </div>
          <CodeBlock sampleFile={`${SAMPLES}/faixa-de-anos.tsx.sample`} />
        </Section>

        <Section
          title={t(i18n, `${K}.section4Title`)}
          description={t(i18n, `${K}.section4Description`)}
        >
          <div className="w-full max-w-xl space-y-4">
            <SgYearPartSelector
              id="yps-disabled"
              label={t(i18n, `${K}.fieldLabel`)}
              locale={i18n.locale}
              disabled
            />
            <SgYearPartSelector
              id="yps-required"
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
          {/* Locale fixo em cada um: o ponto do exemplo e' comparar as siglas lado a lado. */}
          <div className="w-full max-w-xl space-y-4">
            <SgYearPartSelector
              id="yps-ptbr"
              label="pt-BR"
              locale="pt-BR"
              allowedKinds={[YearPartKind.QUARTER]}
            />
            <SgYearPartSelector
              id="yps-enus"
              label="en-US"
              locale="en-US"
              allowedKinds={[YearPartKind.SEMESTER]}
            />
            <SgYearPartSelector
              id="yps-es"
              label="es"
              locale="es"
              allowedKinds={[YearPartKind.QUARTER]}
            />
          </div>
          <CodeBlock sampleFile={`${SAMPLES}/locale-en.tsx.sample`} />
        </Section>

        <Section
          title={t(i18n, `${K}.section6Title`)}
          description={t(i18n, `${K}.section6Description`)}
        >
          <SgPlayground
            title="SgYearPartSelector Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-year-part-selector/sg-year-part-selector.tsx.playground"
            height={620}
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
