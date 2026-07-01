"use client";

import React from "react";
import { SgButton, SgRadialGauge, type SgRadialGaugePointer } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import SgCodeBlockBase from "../../sgCodeBlockBase";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";
import ComponentAiPropsTable from "../../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../../ai/ComponentAiSummary";
import { useAiManifestComponent } from "../../ai/useAiManifestComponent";
import { t, useShowcaseI18n } from "../../../../i18n";

const K = "showcase.component.radialGauge";

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

function CodeBlock(props: { sampleFile: string }) {
  return <SgCodeBlockBase sampleFile={props.sampleFile} />;
}

const EXAMPLE_SPEEDOMETER_CODE = `import React from "react";
import { SgButton, SgRadialGauge, type SgRadialGaugePointer } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [rpm, setRpm] = React.useState(62);

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border p-4">
      <SgRadialGauge
        min={0}
        max={100}
        value={rpm}
        onValueChange={setRpm}
        startAngle={140}
        endAngle={40}
        ranges={[
          { start: 0, end: 40, color: "#22c55e", width: 14 },
          { start: 40, end: 75, color: "#f59e0b", width: 14 },
          { start: 75, end: 100, color: "#ef4444", width: 14 }
        ]}
        showTicks
        showLabels
        majorTickCount={5}
        minorTicksPerInterval={2}
        primaryPointerDraggable
        primaryPointerType="needle"
        primaryPointerColor="#2563eb"
        centerContent={
          <div className="text-center">
            <div className="text-xs uppercase text-muted-foreground">RPM</div>
            <div className="text-xl font-semibold">{Math.round(rpm)}</div>
          </div>
        }
      />
      <div className="space-y-2 text-sm">
        <p>
          Current value: <span className="font-semibold">{Math.round(rpm)}</span>
        </p>
        <input
          type="range"
          min={0}
          max={100}
          value={rpm}
          onChange={(event) => setRpm(Number(event.target.value))}
          className="w-64"
        />
      </div>
    </div>
  );
}`;

const EXAMPLE_THICK_RING_CODE = `import React from "react";
import { SgButton, SgRadialGauge, type SgRadialGaugePointer } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [value, setValue] = React.useState(72);

  return (
    <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border p-4">
      <SgRadialGauge
        min={0}
        max={120}
        value={value}
        onValueChange={setValue}
        startAngle={150}
        endAngle={30}
        ringThickness={36}
        radiusFactor={1}
        axisColor="#e2e8f0"
        showTicks={false}
        showLabels
        majorTickCount={6}
        labelFormatter={(v) => String(Math.round(v))}
        ranges={[
          { start: 0, end: 40, color: "#22c55e" },
          { start: 40, end: 85, color: "#f59e0b" },
          { start: 85, end: 120, color: "#ef4444" }
        ]}
        primaryPointerType="marker"
        primaryPointerShape="circle"
        primaryPointerSize={14}
        primaryPointerColor="#0f172a"
        primaryPointerDraggable
        centerContent={
          <div className="text-center">
            <div className="text-xs uppercase text-muted-foreground">Ring 36px</div>
            <div className="text-2xl font-bold">{Math.round(value)}</div>
          </div>
        }
      />

      <div className="space-y-2 text-sm">
        <p>
          Ring thickness: <span className="font-semibold">36px</span>
        </p>
        <p>
          Value: <span className="font-semibold">{Math.round(value)}</span>
        </p>
        <input
          type="range"
          min={0}
          max={120}
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
          className="w-64"
        />
      </div>
    </div>
  );
}`;

const EXAMPLE_AXIS_INVERSED_CODE = `import React from "react";
import { SgButton, SgRadialGauge, type SgRadialGaugePointer } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [value, setValue] = React.useState(24);

  return (
    <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border p-4">
      <SgRadialGauge
        min={0}
        max={100}
        value={value}
        onValueChange={setValue}
        startAngle={220}
        endAngle={-40}
        isAxisInversed
        ringThickness={18}
        showTicks
        showLabels
        majorTickCount={8}
        minorTicksPerInterval={0}
        animate={false}
        primaryPointerType="marker"
        primaryPointerShape="triangle"
        primaryPointerSize={14}
        primaryPointerColor="#7c3aed"
        ranges={[
          { start: 0, end: 35, color: "#0ea5e9", width: 14 },
          { start: 35, end: 70, color: "#22c55e", width: 14 },
          { start: 70, end: 100, color: "#f97316", width: 14 }
        ]}
        centerContent={<div className="text-sm font-semibold">isAxisInversed</div>}
      />
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="w-64"
      />
    </div>
  );
}`;

const EXAMPLE_MULTI_POINTER_CODE = `import React from "react";
import { SgButton, SgRadialGauge, type SgRadialGaugePointer } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [rpm, setRpm] = React.useState(62);
  const [target, setTarget] = React.useState(70);
  const [consumption, setConsumption] = React.useState(44);

  const pointers = React.useMemo<SgRadialGaugePointer[]>(
    () => [
      {
        id: "target",
        type: "marker",
        value: target,
        color: "#8b5cf6",
        size: 13,
        shape: "diamond",
        draggable: true,
        label: String(Math.round(target))
      },
      {
        id: "consumption",
        type: "range",
        value: consumption,
        color: "#14b8a6",
        width: 10,
        draggable: true
      }
    ],
    [consumption, target]
  );

  return (
    <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border p-4">
      <SgRadialGauge
        min={0}
        max={120}
        value={rpm}
        onValueChange={setRpm}
        startAngle={135}
        endAngle={45}
        radiusFactor={0.95}
        ranges={[
          { start: 0, end: 60, color: "#60a5fa", width: 12, opacity: 0.45 },
          { start: 60, end: 90, color: "#f59e0b", width: 12, opacity: 0.45 },
          { start: 90, end: 120, color: "#ef4444", width: 12, opacity: 0.45 }
        ]}
        pointers={pointers}
        onPointerValueChange={(id, next) => {
          if (id === "target") setTarget(next);
          if (id === "consumption") setConsumption(next);
        }}
        annotations={[
          {
            id: "target-label",
            value: target,
            radiusFactor: 0.8,
            content: (
              <span className="rounded bg-violet-600 px-2 py-1 text-[10px] font-semibold text-white">
                target
              </span>
            )
          }
        ]}
        centerContent={
          <div className="text-center">
            <div className="text-xs uppercase text-muted-foreground">Output</div>
            <div className="text-xl font-semibold">{Math.round(rpm)}</div>
            <div className="text-[11px] text-muted-foreground">consumo {Math.round(consumption)}%</div>
          </div>
        }
        primaryPointerDraggable
      />

      <div className="space-y-2 text-sm">
        <p>Primary: <span className="font-semibold">{Math.round(rpm)}</span></p>
        <p>Target marker: <span className="font-semibold">{Math.round(target)}</span></p>
        <p>Range pointer: <span className="font-semibold">{Math.round(consumption)}</span></p>
      </div>
    </div>
  );
}`;

const EXAMPLE_RANGE_POINTER_CODE = `import React from "react";
import { SgButton, SgRadialGauge, type SgRadialGaugePointer } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  return (
    <div className="rounded-lg border border-border p-4">
      <SgRadialGauge
        min={0}
        max={100}
        showPrimaryPointer={false}
        pointers={[
          {
            id: "donut-progress",
            type: "range",
            value: 50,
            color: "#8b5cf6",
            width: 14
          }
        ]}
        startAngle={135}
        endAngle={45}
        axisColor="#d4d4d8"
        axisWidth={14}
        showTicks={false}
        showLabels={false}
        centerContent={<div className="text-lg font-semibold text-slate-700">50 / 100</div>}
      />
    </div>
  );
}`;

const EXAMPLE_OTHER_PROPS_CODE = `import React from "react";
import { SgButton, SgRadialGauge, type SgRadialGaugePointer } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function Example() {
  const [value, setValue] = React.useState(35);

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div className="grid gap-2 sm:grid-cols-4">
        <SgButton size="sm" appearance="outline" onClick={() => setValue(20)}>20%</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(50)}>50%</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue(85)}>85%</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setValue((prev) => (prev >= 90 ? 15 : prev + 15))}>
          +15
        </SgButton>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <SgRadialGauge
          min={0}
          max={100}
          value={value}
          onValueChange={setValue}
          width={220}
          height={220}
          axisWidth={10}
          ringThickness={16}
          animationDuration={900}
          primaryPointerType="needle"
          primaryPointerLabel={\`\${Math.round(value)}%\`}
          labelFormatter={(v) => \`\${Math.round(v)}%\`}
          majorTickCount={5}
          minorTicksPerInterval={0}
          ariaLabel="Gauge de eficiencia"
          style={{ filter: "drop-shadow(0 4px 10px rgb(0 0 0 / 0.12))" }}
          ranges={[
            { start: 0, end: 40, color: "#22c55e", width: 12 },
            { start: 40, end: 70, color: "#f59e0b", width: 12 },
            { start: 70, end: 100, color: "#ef4444", width: 12 }
          ]}
          centerContent={
            <div className="text-center">
              <div className="text-xs uppercase text-muted-foreground">Eficiencia</div>
              <div className="text-2xl font-bold">{Math.round(value)}%</div>
            </div>
          }
        />

        <div className="space-y-2 text-sm">
      <p>
        Current value: <span className="font-semibold">{Math.round(value)}%</span>
      </p>
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            className="w-64"
          />
        </div>
      </div>
    </div>
  );
}`;

const PLAYGROUND_CODE = `import * as React from "react";
import {
  SgButton,
  SgRadialGauge,
  type SgRadialGaugePointer,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function App() {
  const [value, setValue] = React.useState(62);
  const [showTicks, setShowTicks] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);
  const [pointerType, setPointerType] = React.useState<"needle" | "marker" | "range">("needle");
  const [ringThickness, setRingThickness] = React.useState(14);
  const [isAxisInversed, setIsAxisInversed] = React.useState(false);

  return (
    <div className="space-y-4 p-2">
      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setPointerType("needle")}>needle</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setPointerType("marker")}>marker</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setPointerType("range")}>range</SgButton>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setRingThickness(14)}>ring 14</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setRingThickness(24)}>ring 24</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setRingThickness(36)}>ring 36</SgButton>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <SgButton size="sm" appearance="outline" onClick={() => setShowTicks((v) => !v)}>toggle ticks</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setShowLabels((v) => !v)}>toggle labels</SgButton>
        <SgButton size="sm" appearance="outline" onClick={() => setIsAxisInversed((v) => !v)}>toggle inversed</SgButton>
      </div>

      <SgRadialGauge
        min={0}
        max={100}
        value={value}
        onValueChange={setValue}
        ringThickness={ringThickness}
        radiusFactor={1}
        showTicks={showTicks}
        showLabels={showLabels}
        isAxisInversed={isAxisInversed}
        primaryPointerType={pointerType}
        primaryPointerDraggable
        ranges={[
          { start: 0, end: 40, color: "#22c55e" },
          { start: 40, end: 75, color: "#f59e0b" },
          { start: 75, end: 100, color: "#ef4444" }
        ]}
      />
    </div>
  );
}`;

function getRadialGaugeProps(i18n: ReturnType<typeof useShowcaseI18n>): ShowcasePropRow[] {
  return [
    { prop: "min / max", type: "number", defaultValue: "0 / 100", description: t(i18n, `${K}.props.minMax`) },
    { prop: "value / defaultValue / onValueChange", type: "number / number / callback", defaultValue: "usage-defined", description: t(i18n, `${K}.props.value`) },
    { prop: "pointers / onPointerValueChange", type: "SgRadialGaugePointer[] / callback", defaultValue: "[]", description: t(i18n, `${K}.props.pointers`) },
    { prop: "ranges", type: "SgRadialGaugeRange[]", defaultValue: "[]", description: t(i18n, `${K}.props.ranges`) },
    { prop: "annotations", type: "SgRadialGaugeAnnotation[]", defaultValue: "[]", description: t(i18n, `${K}.props.annotations`) },
    { prop: "startAngle / endAngle / isAxisInversed", type: "number / number / boolean", defaultValue: "135 / 45 / false", description: t(i18n, `${K}.props.angles`) },
    { prop: "showPrimaryPointer / primaryPointer*", type: "boolean + props", defaultValue: "true", description: t(i18n, `${K}.props.primaryPointer`) },
    { prop: "showTicks / showLabels / majorTickCount / minorTicksPerInterval / labelFormatter", type: "tick/label props", defaultValue: "true / true / 5 / 1 / -", description: t(i18n, `${K}.props.ticks`) },
    { prop: "axisColor / axisWidth / ringThickness / radiusFactor / centerContent", type: "style props", defaultValue: "border / 14 / - / 0.9 / auto", description: t(i18n, `${K}.props.axisStyle`) },
    { prop: "width / height", type: "number", defaultValue: "300 / 300", description: t(i18n, `${K}.props.size`) },
    { prop: "animate / animationDuration", type: "boolean / number", defaultValue: "true / 350", description: t(i18n, `${K}.props.animate`) },
    { prop: "className / style / ariaLabel", type: "string / CSSProperties / string", defaultValue: "- / - / Radial gauge", description: t(i18n, `${K}.props.styling`) },
    { prop: "SgRadialGaugePointer.id / type / value / color / width / size / shape / draggable / onValueChange / label", type: "pointer props", defaultValue: "-", description: t(i18n, `${K}.props.pointerConfig`) },
    { prop: "SgRadialGaugeRange.start / end / color / width / opacity", type: "range props", defaultValue: "-", description: t(i18n, `${K}.props.rangeConfig`) },
    { prop: "SgRadialGaugeAnnotation.id / value / angle / radiusFactor / content", type: "annotation props", defaultValue: "-", description: t(i18n, `${K}.props.annotationConfig`) }
  ];
}

export default function SgRadialGaugePage() {
  const i18n = useShowcaseI18n();
  const [rpm, setRpm] = React.useState(62);
  const [thickValue, setThickValue] = React.useState(72);
  const [inversedValue, setInversedValue] = React.useState(24);
  const [otherPropsValue, setOtherPropsValue] = React.useState(35);
  const [target, setTarget] = React.useState(70);
  const [consumption, setConsumption] = React.useState(44);
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } = useShowcaseAnchors({ deps: [i18n.locale] });
  const aiComponent = useAiManifestComponent("SgRadialGauge");
  const propRows = React.useMemo(() => getRadialGaugeProps(i18n), [i18n]);

  const extraPointers = React.useMemo<SgRadialGaugePointer[]>(
    () => [
      {
        id: "target",
        type: "marker",
        value: target,
        color: "#8b5cf6",
        size: 13,
        shape: "diamond",
        draggable: true,
        label: String(Math.round(target))
      },
      {
        id: "consumption",
        type: "range",
        value: consumption,
        color: "#14b8a6",
        width: 10,
        draggable: true
      }
    ],
    [consumption, target]
  );

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgRadialGauge"
          subtitle={t(i18n, `${K}.subtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={t(i18n, `${K}.section1Title`)} description={t(i18n, `${K}.section1Description`)}>
          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border p-4">
            <SgRadialGauge
              min={0}
              max={100}
              value={rpm}
              onValueChange={setRpm}
              startAngle={140}
              endAngle={40}
              ranges={[
                { start: 0, end: 40, color: "#22c55e", width: 14 },
                { start: 40, end: 75, color: "#f59e0b", width: 14 },
                { start: 75, end: 100, color: "#ef4444", width: 14 }
              ]}
              showTicks
              showLabels
              majorTickCount={5}
              minorTicksPerInterval={2}
              primaryPointerDraggable
              primaryPointerType="needle"
              primaryPointerColor="#2563eb"
              centerContent={
                <div className="text-center">
                  <div className="text-xs uppercase text-muted-foreground">{t(i18n, `${K}.section1CenterLabel`)}</div>
                  <div className="text-xl font-semibold">{Math.round(rpm)}</div>
                </div>
              }
            />
            <div className="space-y-2 text-sm">
              <p>
                {t(i18n, `${K}.currentValue`)} <span className="font-semibold">{Math.round(rpm)}</span>
              </p>
              <input
                type="range"
                min={0}
                max={100}
                value={rpm}
                onChange={(event) => setRpm(Number(event.target.value))}
                className="w-64"
              />
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/gadgets/sg-radial-gauge/samples/speedometer-style.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.section2Title`)}
          description={t(i18n, `${K}.section2Description`)}
        >
          <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border p-4">
            <SgRadialGauge
              min={0}
              max={120}
              value={thickValue}
              onValueChange={setThickValue}
              startAngle={150}
              endAngle={30}
              ringThickness={36}
              radiusFactor={1}
              axisColor="#e2e8f0"
              showTicks={false}
              showLabels
              majorTickCount={6}
              labelFormatter={(v) => String(Math.round(v))}
              ranges={[
                { start: 0, end: 40, color: "#22c55e" },
                { start: 40, end: 85, color: "#f59e0b" },
                { start: 85, end: 120, color: "#ef4444" }
              ]}
              primaryPointerType="marker"
              primaryPointerShape="circle"
              primaryPointerSize={14}
              primaryPointerColor="#0f172a"
              primaryPointerDraggable
              centerContent={
                <div className="text-center">
                  <div className="text-xs uppercase text-muted-foreground">{t(i18n, `${K}.section2CenterLabel`)}</div>
                  <div className="text-2xl font-bold">{Math.round(thickValue)}</div>
                </div>
              }
            />

            <div className="space-y-2 text-sm">
              <p>
                {t(i18n, `${K}.section2RingThicknessLabel`)} <span className="font-semibold">36px</span>
              </p>
              <p>
                {t(i18n, `${K}.valueLabel`)} <span className="font-semibold">{Math.round(thickValue)}</span>
              </p>
              <input
                type="range"
                min={0}
                max={120}
                value={thickValue}
                onChange={(event) => setThickValue(Number(event.target.value))}
                className="w-64"
              />
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/gadgets/sg-radial-gauge/samples/thicker-ring-ringthickness.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.section3Title`)}
          description={t(i18n, `${K}.section3Description`)}
        >
          <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border p-4">
            <SgRadialGauge
              min={0}
              max={100}
              value={inversedValue}
              onValueChange={setInversedValue}
              startAngle={220}
              endAngle={-40}
              isAxisInversed
              ringThickness={18}
              showTicks
              showLabels
              majorTickCount={8}
              minorTicksPerInterval={0}
              animate={false}
              primaryPointerType="marker"
              primaryPointerShape="triangle"
              primaryPointerSize={14}
              primaryPointerColor="#7c3aed"
              ranges={[
                { start: 0, end: 35, color: "#0ea5e9", width: 14 },
                { start: 35, end: 70, color: "#22c55e", width: 14 },
                { start: 70, end: 100, color: "#f97316", width: 14 }
              ]}
              centerContent={<div className="text-sm font-semibold">isAxisInversed</div>}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={inversedValue}
              onChange={(event) => setInversedValue(Number(event.target.value))}
              className="w-64"
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/gadgets/sg-radial-gauge/samples/axis-inversed-angulos-custom.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section4Title`)} description={t(i18n, `${K}.section4Description`)}>
          <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border p-4">
            <SgRadialGauge
              min={0}
              max={120}
              value={rpm}
              onValueChange={setRpm}
              startAngle={135}
              endAngle={45}
              radiusFactor={0.95}
              ranges={[
                { start: 0, end: 60, color: "#60a5fa", width: 12, opacity: 0.45 },
                { start: 60, end: 90, color: "#f59e0b", width: 12, opacity: 0.45 },
                { start: 90, end: 120, color: "#ef4444", width: 12, opacity: 0.45 }
              ]}
              pointers={extraPointers}
              onPointerValueChange={(id, next) => {
                if (id === "target") setTarget(next);
                if (id === "consumption") setConsumption(next);
              }}
              annotations={[
                {
                  id: "target-label",
                  value: target,
                  radiusFactor: 0.8,
                  content: (
                    <span className="rounded bg-violet-600 px-2 py-1 text-[10px] font-semibold text-white">
                      {t(i18n, `${K}.section4AnnotationTarget`)}
                    </span>
                  )
                }
              ]}
              centerContent={
                <div className="text-center">
                  <div className="text-xs uppercase text-muted-foreground">{t(i18n, `${K}.section4OutputLabel`)}</div>
                  <div className="text-xl font-semibold">{Math.round(rpm)}</div>
                  <div className="text-[11px] text-muted-foreground">{t(i18n, `${K}.section4ConsumoLabel`)} {Math.round(consumption)}%</div>
                </div>
              }
              primaryPointerDraggable
            />

            <div className="space-y-2 text-sm">
          <p>{t(i18n, `${K}.section4PrimaryLabel`)} <span className="font-semibold">{Math.round(rpm)}</span></p>
              <p>{t(i18n, `${K}.section4TargetMarkerLabel`)} <span className="font-semibold">{Math.round(target)}</span></p>
              <p>{t(i18n, `${K}.section4RangePointerLabel`)} <span className="font-semibold">{Math.round(consumption)}</span></p>
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/gadgets/sg-radial-gauge/samples/multi-pointers-annotation.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section5Title`)} description={t(i18n, `${K}.section5Description`)}>
          <div className="rounded-lg border border-border p-4">
            <SgRadialGauge
              min={0}
              max={100}
              showPrimaryPointer={false}
              pointers={[
                {
                  id: "donut-progress",
                  type: "range",
                  value: 50,
                  color: "#8b5cf6",
                  width: 14
                }
              ]}
              startAngle={135}
              endAngle={45}
              axisColor="#d4d4d8"
              axisWidth={14}
              showTicks={false}
              showLabels={false}
              centerContent={<div className="text-lg font-semibold text-slate-700">50 / 100</div>}
            />
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/gadgets/sg-radial-gauge/samples/range-pointer-donut.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.section6Title`)}
          description={t(i18n, `${K}.section6Description`)}
        >
          <div className="space-y-4 rounded-lg border border-border p-4">
            <div className="grid gap-2 sm:grid-cols-4">
              <SgButton size="sm" appearance="outline" onClick={() => setOtherPropsValue(20)}>20%</SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => setOtherPropsValue(50)}>50%</SgButton>
              <SgButton size="sm" appearance="outline" onClick={() => setOtherPropsValue(85)}>85%</SgButton>
              <SgButton
                size="sm"
                appearance="outline"
                onClick={() => setOtherPropsValue((prev) => (prev >= 90 ? 15 : prev + 15))}
              >
                +15
              </SgButton>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <SgRadialGauge
                min={0}
                max={100}
                value={otherPropsValue}
                onValueChange={setOtherPropsValue}
                width={220}
                height={220}
                axisWidth={10}
                ringThickness={16}
                animationDuration={900}
                primaryPointerType="needle"
                primaryPointerLabel={`${Math.round(otherPropsValue)}%`}
                labelFormatter={(v) => `${Math.round(v)}%`}
                majorTickCount={5}
                minorTicksPerInterval={0}
                ariaLabel="Gauge de eficiencia"
                style={{ filter: "drop-shadow(0 4px 10px rgb(0 0 0 / 0.12))" }}
                ranges={[
                  { start: 0, end: 40, color: "#22c55e", width: 12 },
                  { start: 40, end: 70, color: "#f59e0b", width: 12 },
                  { start: 70, end: 100, color: "#ef4444", width: 12 }
                ]}
                centerContent={
                  <div className="text-center">
                    <div className="text-xs uppercase text-muted-foreground">{t(i18n, `${K}.section6CenterLabel`)}</div>
                    <div className="text-2xl font-bold">{Math.round(otherPropsValue)}%</div>
                  </div>
                }
              />

              <div className="space-y-2 text-sm">
                <p>
              {t(i18n, `${K}.currentValue`)} <span className="font-semibold">{Math.round(otherPropsValue)}%</span>
                </p>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={otherPropsValue}
                  onChange={(event) => setOtherPropsValue(Number(event.target.value))}
                  className="w-64"
                />
              </div>
            </div>
          </div>
          <CodeBlock sampleFile="apps/showcase/src/app/components/gadgets/sg-radial-gauge/samples/other-props-size-labels-accessibility.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.section7Title`)}
          description={t(i18n, `${K}.section7Description`)}
        >
          <SgPlayground
            title="SgRadialGauge Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/gadgets/sg-radial-gauge/sg-radial-gauge.tsx.playground"
            height={760}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={propRows} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

