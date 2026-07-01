"use client";

import React from "react";
import { SgButton, SgCombobox } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../sgCodeBlockBase";
import I18NReady from "../I18NReady";
import ComponentAiPropsTable from "../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../ai/useAiManifestComponent";
import ShowcaseStickyHeader from "../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../i18n";

const K = "showcase.component.combobox";

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

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

type Country = {
  id: number;
  description: string;
  code: string;
  region: string;
};

const COUNTRIES: Country[] = [
  { id: 1, description: "Brazil", code: "BR", region: "Americas" },
  { id: 2, description: "Argentina", code: "AR", region: "Americas" },
  { id: 3, description: "United States", code: "US", region: "Americas" },
  { id: 4, description: "Canada", code: "CA", region: "Americas" },
  { id: 5, description: "Germany", code: "DE", region: "Europe" },
  { id: 6, description: "France", code: "FR", region: "Europe" },
  { id: 7, description: "Portugal", code: "PT", region: "Europe" },
  { id: 8, description: "India", code: "IN", region: "Asia" },
  { id: 9, description: "Japan", code: "JP", region: "Asia" },
  { id: 10, description: "Australia", code: "AU", region: "Oceania" }
];

const PLAYGROUND_APP_FILE = `import * as React from "react";
import * as SeedGrid from "@seedgrid/fe-components";

const SgComboboxFromLib = (SeedGrid as Record<string, unknown>).SgCombobox as
  | React.ComponentType<any>
  | undefined;

type Country = {
  id: number;
  description: string;
  code: string;
  region: string;
};

const COUNTRIES: Country[] = [
  { id: 1, description: "Brazil", code: "BR", region: "Americas" },
  { id: 2, description: "Argentina", code: "AR", region: "Americas" },
  { id: 3, description: "United States", code: "US", region: "Americas" },
  { id: 4, description: "Canada", code: "CA", region: "Americas" },
  { id: 5, description: "Germany", code: "DE", region: "Europe" },
  { id: 6, description: "France", code: "FR", region: "Europe" },
  { id: 7, description: "Portugal", code: "PT", region: "Europe" },
  { id: 8, description: "India", code: "IN", region: "Asia" },
  { id: 9, description: "Japan", code: "JP", region: "Asia" }
];

function LocalSelectFallback(props: {
  label: string;
  value: string;
  grouped: boolean;
  source: Country[];
  onChange: (next: string) => void;
}) {
  const groups = props.source.reduce<Record<string, Country[]>>((acc, item) => {
    const key = item.region || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-md space-y-1">
      <label className="text-sm font-medium">{props.label}</label>
      <select
        className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        <option value="">Select...</option>
        {props.grouped
          ? Object.keys(groups).map((group) => (
              <optgroup key={group} label={group}>
                {(groups[group] ?? []).map((item) => (
                  <option key={item.id} value={String(item.id)}>
                    {item.description} ({item.code})
                  </option>
                ))}
              </optgroup>
            ))
          : props.source.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item.description} ({item.code})
              </option>
            ))}
      </select>
    </div>
  );
}

export default function App() {
  const hasCombobox = typeof SgComboboxFromLib === "function";
  const [selectedId, setSelectedId] = React.useState<string>("");
  const [grouped, setGrouped] = React.useState(true);
  const [openOnFocus, setOpenOnFocus] = React.useState(true);
  const [asyncMode, setAsyncMode] = React.useState(false);
  const selectedByValue = COUNTRIES.find((item) => String(item.id) === selectedId) ?? null;

  const source = React.useCallback(async () => {
    if (asyncMode) {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    return COUNTRIES;
  }, [asyncMode]);

  return (
    <div className="space-y-4 p-2">
      {!hasCombobox ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
          SgCombobox is not available in the published Sandpack version. Showing local fallback.
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm inline-flex items-center gap-1">
          <input
            className="mr-1"
            type="checkbox"
            checked={grouped}
            onChange={(e) => setGrouped(e.target.checked)}
          />
          grouped
        </label>
        <label className="text-sm inline-flex items-center gap-1">
          <input
            className="mr-1"
            type="checkbox"
            checked={openOnFocus}
            onChange={(e) => setOpenOnFocus(e.target.checked)}
          />
          openOnFocus
        </label>
        <label className="text-sm inline-flex items-center gap-1">
          <input
            className="mr-1"
            type="checkbox"
            checked={asyncMode}
            onChange={(e) => setAsyncMode(e.target.checked)}
          />
          source async
        </label>
      </div>

      {hasCombobox ? (
        <SgComboboxFromLib
          id="cb-playground"
          label="Country"
          value={selectedId}
          source={source}
          grouped={grouped}
          openOnFocus={openOnFocus}
          loadingText="Loading countries..."
          mapItem={(raw: Country) => ({
            id: raw.id,
            label: raw.description,
            value: raw.code,
            group: raw.region
          })}
          onValueChange={(next: string | number | null) => setSelectedId(next == null ? "" : String(next))}
          renderFooter={(_, hasResults) => (
            <div className="text-xs text-slate-500">{hasResults ? "Select one option" : "No records found"}</div>
          )}
        />
      ) : (
        <LocalSelectFallback
          label="Country"
          value={selectedId}
          grouped={grouped}
          source={COUNTRIES}
          onChange={(next) => {
            setSelectedId(next);
          }}
        />
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-border bg-background px-2 py-1 text-xs hover:bg-muted"
          onClick={() => setSelectedId("5")}
        >
          Set Germany (id 5)
        </button>
        <button
          type="button"
          className="rounded border border-border bg-background px-2 py-1 text-xs hover:bg-muted"
          onClick={() => setSelectedId("9")}
        >
          Set Japan (id 9)
        </button>
        <button
          type="button"
          className="rounded border border-border bg-background px-2 py-1 text-xs hover:bg-muted"
          onClick={() => setSelectedId("")}
        >
          Clear
        </button>
      </div>

      <div className="rounded border border-border bg-muted/40 p-3 text-xs">
        <div><strong>hint:</strong> focus and type letters (B, G, J) to jump like select</div>
        <div><strong>value:</strong> {selectedId || "(none)"}</div>
        <div><strong>selected:</strong> {selectedByValue ? selectedByValue.description + " (" + selectedByValue.code + ")" : "(none)"}</div>
      </div>
    </div>
  );
}`;










export default function SgComboboxPage() {
  const i18n = useShowcaseI18n();
  const aiComponent = useAiManifestComponent("SgCombobox");
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });
  const [selectedCountry, setSelectedCountry] = React.useState<Country | null>(null);
  const [selectedId, setSelectedId] = React.useState<string | number | null>(null);
  const [selectedControlled, setSelectedControlled] = React.useState<Country | null>(null);
  const [selectedAsync, setSelectedAsync] = React.useState<Country | null>(null);
  const selectedByValue = React.useMemo(
    () => COUNTRIES.find((item) => String(item.id) === String(selectedId ?? "")) ?? null,
    [selectedId]
  );

  const asyncSource = React.useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return COUNTRIES;
  }, []);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgCombobox"
          subtitle={t(i18n, `${K}.headerSubtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={t(i18n, `${K}.section1Title`)}
          description={t(i18n, `${K}.section1Description`)}
        >
          <div className="w-96">
            <SgCombobox<Country>
              id="cb-basic"
              label="Country"
              source={COUNTRIES}
              openOnFocus
              grouped
              mapItem={(raw) => ({
                id: raw.id,
                label: raw.description,
                value: raw.code,
                group: raw.region
              })}
              onSelect={(value) => setSelectedCountry(value)}
            />
            <div className="mt-2 rounded border border-border bg-foreground/5 p-2 text-xs">
              {selectedCountry ? JSON.stringify(selectedCountry, null, 2) : "No item selected"}
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-combobox/samples/basico-com-lista-de-objetos.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.section2Title`)}
          description={t(i18n, `${K}.section2Description`)}
        >
          <div className="w-96">
            <SgCombobox<Country>
              id="cb-controlled"
              label="Country (controlled)"
              value={selectedId}
              source={COUNTRIES}
              openOnFocus
              mapItem={(raw) => ({
                id: raw.id,
                label: `${raw.description} (${raw.code})`,
                value: raw.code,
                group: raw.region
              })}
              onValueChange={setSelectedId}
              onSelect={setSelectedControlled}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <SgButton size="sm" appearance="outline" onClick={() => setSelectedId(5)}>
                Set Germany (id 5)
              </SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => setSelectedId(9)}>
                Set Japan (id 9)
              </SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => setSelectedId(null)}>
                Clear value
              </SgButton>
            </div>
            <div className="mt-2 rounded border border-border bg-foreground/5 p-2 text-xs">
              <div>value: {selectedId == null || selectedId === "" ? "(empty)" : String(selectedId)}</div>
              <div>
                resolved by value:{" "}
                {selectedByValue ? `${selectedByValue.description} (${selectedByValue.code})` : "(none)"}
              </div>
              <div>
                last onSelect:{" "}
                {selectedControlled ? `${selectedControlled.description} (${selectedControlled.code})` : "(none)"}
              </div>
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-combobox/samples/controlado-por-value.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.section3Title`)}
          description={t(i18n, `${K}.section3Description`)}
        >
          <div className="w-96">
            <SgCombobox<Country>
              id="cb-async"
              label="Country (async)"
              source={asyncSource}
              openOnFocus
              grouped
              loadingText="Loading countries..."
              mapItem={(raw) => ({
                id: raw.id,
                label: raw.description,
                value: raw.code,
                group: raw.region
              })}
              renderGroupHeader={(group) => <span className="uppercase tracking-wide">{group}</span>}
              renderItem={(item) => (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">{item.value}</span>
                  <span>{item.label}</span>
                </div>
              )}
              itemTooltip={(item) => <span>{item.label}</span>}
              renderFooter={(_, hasResults) => (
                <span className="text-xs text-muted-foreground">
                  {hasResults ? "Select one item from the list." : "No records."}
                </span>
              )}
              onSelect={setSelectedAsync}
            />
            <div className="mt-2 rounded border border-border bg-foreground/5 p-2 text-xs">
              {selectedAsync ? `Selected: ${selectedAsync.description} (${selectedAsync.code})` : "No item selected"}
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-combobox/samples/source-async-custom-render.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.section4Title`)}
          description={t(i18n, `${K}.section4Description`)}
        >
          <div className="w-96">
            <SgCombobox<Country>
              id="cb-radius"
              label="Country with custom radius"
              source={COUNTRIES}
              openOnFocus
              grouped
              borderRadius={14}
              mapItem={(raw) => ({
                id: raw.id,
                label: raw.description,
                value: raw.code,
                group: raw.region
              })}
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/sg-combobox/samples/border-radius.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.section5Title`)}
          description={t(i18n, `${K}.section5Description`)}
        >
          <SgPlayground
            title="SgCombobox Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/sg-combobox/sg-combobox.tsx.playground"
            height={560}
            defaultOpen
          />
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
                <tr><td className="py-2 pr-4 font-mono text-xs">source</td><td className="py-2 pr-4">array | async function</td><td className="py-2 pr-4">-</td><td className="py-2">Source for list items.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">value</td><td className="py-2 pr-4">string | number | null</td><td className="py-2 pr-4">null</td><td className="py-2">Selected value in controlled mode.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">onValueChange</td><td className="py-2 pr-4">(value) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Fired when value changes.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">onSelect</td><td className="py-2 pr-4">(item) =&gt; void</td><td className="py-2 pr-4">-</td><td className="py-2">Returns the selected item.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">mapItem</td><td className="py-2 pr-4">(raw) =&gt; item</td><td className="py-2 pr-4">auto</td><td className="py-2">Maps raw item to combobox format.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">grouped / groupped</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Groups items by group.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">openOnFocus</td><td className="py-2 pr-4">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Opens list on focus.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">borderRadius</td><td className="py-2 pr-4">number | string</td><td className="py-2 pr-4">-</td><td className="py-2">Sets border radius for field and dropdown.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">loadingText / emptyText</td><td className="py-2 pr-4">string</td><td className="py-2 pr-4">i18n</td><td className="py-2">Texts for loading and empty list states.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">renderItem</td><td className="py-2 pr-4">(item, isActive) =&gt; ReactNode</td><td className="py-2 pr-4">-</td><td className="py-2">Custom item rendering.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">renderGroupHeader</td><td className="py-2 pr-4">(group) =&gt; ReactNode</td><td className="py-2 pr-4">-</td><td className="py-2">Custom group header rendering.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">renderFooter</td><td className="py-2 pr-4">(query, hasResults) =&gt; ReactNode</td><td className="py-2 pr-4">-</td><td className="py-2">Custom list footer rendering.</td></tr>
                <tr><td className="py-2 pr-4 font-mono text-xs">itemTooltip</td><td className="py-2 pr-4">(item) =&gt; ReactNode</td><td className="py-2 pr-4">-</td><td className="py-2">Tooltip content for item.</td></tr>
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



