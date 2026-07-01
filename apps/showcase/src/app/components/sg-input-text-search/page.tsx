"use client";

import React from "react";
import { SgInputTextSearch } from "@seedgrid/fe-components";
import I18NReady from "../I18NReady";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import SgCodeBlockBase from "../sgCodeBlockBase";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../i18n";

const K = "showcase.component.inputTextSearch";

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










function Echo(props: { label: string; value: string; none: string }) {
  return (
    <div className="mt-2 w-full rounded border border-border bg-foreground/5 p-2 text-xs">
      <strong>{props.label}:</strong> {props.value ? props.value : props.none}
    </div>
  );
}

export default function SgInputTextSearchPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgInputTextSearch");
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });

  const [immediate, setImmediate] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");

  const [immediate2, setImmediate2] = React.useState("");
  const [searchTerm2, setSearchTerm2] = React.useState("");

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgInputTextSearch"
          subtitle={t(i18n, `${K}.headerSubtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={t(i18n, `${K}.section1Title`)} description={t(i18n, `${K}.section1Description`)}>
          <div className="w-96">
            <SgInputTextSearch
              id="search-basic"
              label="Busca"
              placeholder="Digite para buscar"
              onChange={setImmediate}
              onSearchChange={setSearchTerm}
            />
            <Echo label={t(i18n, `${K}.immediateLabel`)} value={immediate} none={t(i18n, `${K}.noneLabel`)} />
            <Echo label={t(i18n, `${K}.searchLabel`)} value={searchTerm} none={t(i18n, `${K}.noneLabel`)} />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-input-text-search/samples/basico.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section2Title`)} description={t(i18n, `${K}.section2Description`)}>
          <div className="w-96">
            <SgInputTextSearch
              id="search-tuned"
              label="Busca"
              placeholder="Digite para buscar"
              minChars={1}
              debounceMs={800}
              onChange={setImmediate2}
              onSearchChange={setSearchTerm2}
            />
            <Echo label={t(i18n, `${K}.immediateLabel`)} value={immediate2} none={t(i18n, `${K}.noneLabel`)} />
            <Echo label={t(i18n, `${K}.searchLabel`)} value={searchTerm2} none={t(i18n, `${K}.noneLabel`)} />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-input-text-search/samples/minchars-e-debounce.tsx.sample" />
        </Section>

        <section
          id="props-reference"
          className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
        >
          <h2 data-anchor-title="true" className="text-lg font-semibold">{t(i18n, `${K}.propsTitle`)}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t(i18n, `${K}.propsDescription`)}</p>
          <div className="mt-4 w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 font-semibold">{t(i18n, `${K}.propsColProp`)}</th>
                  <th className="pb-2 pr-4 font-semibold">{t(i18n, `${K}.propsColType`)}</th>
                  <th className="pb-2 pr-4 font-semibold">{t(i18n, `${K}.propsColDefault`)}</th>
                  <th className="pb-2 font-semibold">{t(i18n, `${K}.propsColDescription`)}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr><td className="py-2 pr-4 font-mono text-xs">minChars</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">3</td><td className="py-2">Minimum characters (after trim) before onSearchChange fires; 0 also fires (clearing).</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">debounceMs</td><td className="py-2 pr-4">number</td><td className="py-2 pr-4">350</td><td className="py-2">Debounce delay in milliseconds.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">onChange</td><td className="py-2 pr-4">(value: string) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Immediate, fired on every keystroke with the raw value.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">onSearchChange</td><td className="py-2 pr-4">(value: string) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Debounced, fired with the normalized term (required).</td></tr>
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
