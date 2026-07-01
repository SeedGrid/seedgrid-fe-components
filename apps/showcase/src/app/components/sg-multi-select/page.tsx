"use client";

import React from "react";
import { SgButton, SgMultiSelect, type SgMultiSelectOptionValue } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import I18NReady from "../I18NReady";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import SgCodeBlockBase from "../sgCodeBlockBase";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../i18n";

const K = "showcase.component.multiSelect";

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

function Section(props: { id?: string; title: string; description?: string; children: React.ReactNode; example?: boolean }) {
  return (
    <section
      id={props.id}
      data-showcase-example={props.example === false ? undefined : "true"}
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">{props.title}</h2>
      {props.description ? <p className="mt-1 text-sm text-muted-foreground">{props.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4">{props.children}</div>
    </section>
  );
}

const COMPANIES = [
  { label: "Empresa 1", value: "e1" },
  { label: "Empresa 2", value: "e2" },
  { label: "Empresa 3", value: "e3" },
  { label: "Empresa 4", value: "e4" },
  { label: "Empresa 5", value: "e5" },
  { label: "Empresa 6", value: "e6" }
];

function Selected(props: { label: string; none: string; value: SgMultiSelectOptionValue[] }) {
  return (
    <div className="mt-2 w-full rounded border border-border bg-foreground/5 p-2 text-xs">
      <strong>{props.label}:</strong> {props.value.length ? props.value.join(", ") : props.none}
    </div>
  );
}

export default function SgMultiSelectPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgMultiSelect");
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

  const [empty, setEmpty] = React.useState<SgMultiSelectOptionValue[]>([]);
  const [preselected, setPreselected] = React.useState<SgMultiSelectOptionValue[]>(["e1", "e2", "e4"]);
  const [searchable, setSearchable] = React.useState<SgMultiSelectOptionValue[]>(["e1"]);
  const [capped, setCapped] = React.useState<SgMultiSelectOptionValue[]>([]);

  const selectedLabel = t(i18n, `${K}.selectedLabel`);
  const noneLabel = t(i18n, `${K}.noneLabel`);
  const companiesPlaceholder = t(i18n, `${K}.placeholders.companies`);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgMultiSelect"
          subtitle={t(i18n, `${K}.subtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={t(i18n, `${K}.sections.basic.title`)} description={t(i18n, `${K}.sections.basic.description`)}>
          <div className="w-96">
            <SgMultiSelect
              id="ms-empty"
              label={t(i18n, `${K}.labels.companies`)}
              placeholder={companiesPlaceholder}
              options={COMPANIES}
              value={empty}
              onChange={setEmpty}
            />
            <Selected label={selectedLabel} none={noneLabel} value={empty} />
          </div>
          <div className="w-96">
            <SgMultiSelect
              id="ms-preselected"
              label={t(i18n, `${K}.labels.companiesSelected`)}
              placeholder={companiesPlaceholder}
              options={COMPANIES}
              value={preselected}
              onChange={setPreselected}
            />
            <Selected label={selectedLabel} none={noneLabel} value={preselected} />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-multi-select/samples/basico.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.sections.searchable.title`)} description={t(i18n, `${K}.sections.searchable.description`)}>
          <div className="w-96">
            <SgMultiSelect
              id="ms-searchable"
              label={t(i18n, `${K}.labels.companies`)}
              placeholder={companiesPlaceholder}
              options={COMPANIES}
              value={searchable}
              onChange={setSearchable}
              searchable
            />
            <Selected label={selectedLabel} none={noneLabel} value={searchable} />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-multi-select/samples/com-busca.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.sections.clearable.title`)} description={t(i18n, `${K}.sections.clearable.description`)}>
          <div className="w-96">
            <SgMultiSelect
              id="ms-capped"
              label={t(i18n, `${K}.labels.companiesMax2`)}
              placeholder={t(i18n, `${K}.placeholders.upTo2`)}
              options={COMPANIES}
              value={capped}
              onChange={setCapped}
              clearable
              maxSelected={2}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <SgButton size="sm" appearance="outline" onClick={() => setCapped([])}>
                {t(i18n, `${K}.buttons.clear`)}
              </SgButton>
            </div>
            <Selected label={selectedLabel} none={noneLabel} value={capped} />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-multi-select/samples/limpavel-e-com-limite.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.sections.disabled.title`)} description={t(i18n, `${K}.sections.disabled.description`)}>
          <div className="w-96">
            <SgMultiSelect
              id="ms-disabled"
              label={t(i18n, `${K}.labels.companies`)}
              placeholder={companiesPlaceholder}
              options={COMPANIES}
              value={["e1", "e3"]}
              enabled={false}
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-multi-select/samples/desabilitado.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.sections.playground.title`)} description={t(i18n, `${K}.sections.playground.description`)}>
          <SgPlayground
            title="SgMultiSelect Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-multi-select/sg-multi-select.tsx.playground"
            height={520}
            defaultOpen
          />
        </Section>

        <section
          id="props-reference"
          className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
        >
          <h2 data-anchor-title="true" className="text-lg font-semibold">{t(i18n, `${K}.props.title`)}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t(i18n, `${K}.props.description`)}</p>
          <div className="mt-4 w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 font-semibold">{t(i18n, `${K}.propsCol.prop`)}</th>
                  <th className="pb-2 pr-4 font-semibold">{t(i18n, `${K}.propsCol.type`)}</th>
                  <th className="pb-2 pr-4 font-semibold">{t(i18n, `${K}.propsCol.default`)}</th>
                  <th className="pb-2 font-semibold">{t(i18n, `${K}.propsCol.description`)}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="py-2 pr-4 font-mono text-xs">options</td><td className="py-2 pr-4">{`{ label, value, disabled? }[]`}</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, `${K}.rows.options`)}</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">value</td><td className="py-2 pr-4">(string | number)[]</td><td className="py-2 pr-4">[]</td><td className="py-2">{t(i18n, `${K}.rows.value`)}</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">onChange</td><td className="py-2 pr-4">(value[]) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, `${K}.rows.onChange`)}</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">searchable</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">{t(i18n, `${K}.rows.searchable`)}</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">clearable</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">{t(i18n, `${K}.rows.clearable`)}</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">maxSelected</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, `${K}.rows.maxSelected`)}</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">summaryThreshold</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">2</td><td className="py-2">{t(i18n, `${K}.rows.summaryThreshold`)}</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">placeholder</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">i18n</td><td className="py-2">{t(i18n, `${K}.rows.placeholder`)}</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">onEnter / onExit</td><td className="py-2 pr-4">() =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">{t(i18n, `${K}.rows.onEnterExit`)}</td></tr>
              </tbody>
            </table>
          </div>
        </section>
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}
