"use client";

import * as React from "react";
import {
  SgButton,
  SgGrid,
  SgInputText,
  SgSevenSegmentDigit,
  SgSlider,
  type SgSevenSegmentDigitPalette,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";
import ComponentAiPropsTable from "../../ai/ComponentAiPropsTable";
import ComponentAiSummary from "../../ai/ComponentAiSummary";
import SgCodeBlockBase from "../../sgCodeBlockBase";
import I18NReady from "../../I18NReady";
import ShowcasePropsReference, { type ShowcasePropRow } from "../../ShowcasePropsReference";
import ShowcaseStickyHeader from "../../ShowcaseStickyHeader";
import { useAiManifestComponent } from "../../ai/useAiManifestComponent";
import { useShowcaseAnchors } from "../../useShowcaseAnchors";
import { t, useShowcaseI18n } from "../../../../i18n";

const K = "showcase.component.sevenSegmentDigit";

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










function ColonDots() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-1">
      <span className="size-2 rounded-full bg-red-500/80" />
      <span className="size-2 rounded-full bg-red-500/80" />
    </div>
  );
}

const HEX = Array.from("0123456789ABCDEF");
const COLOR_OPTIONS: Array<{ label: string; value: SgSevenSegmentDigitPalette }> = [
  { label: "Red", value: "red" },
  { label: "Blue", value: "blue" },
  { label: "Yellow", value: "yellow" },
  { label: "Green", value: "green" },
  { label: "White", value: "white" }
];

const BASIC_CODE = `const COLOR_OPTIONS = [
  { label: "Red", value: "red" },
  { label: "Blue", value: "blue" },
  { label: "Yellow", value: "yellow" },
  { label: "Green", value: "green" },
  { label: "White", value: "white" }
];

const [digit, setDigit] = React.useState("0");
const [palette, setPalette] = React.useState("red");

const next = () => setDigit((prev) => String((Number(prev) + 1) % 10));
const prev = () => setDigit((prev) => String((Number(prev) - 1 + 10) % 10));
const random = () => setDigit(String(Math.floor(Math.random() * 10)));

<div className="flex items-center gap-4">
  <SgSevenSegmentDigit value={digit} palette={palette} />
  <div className="flex flex-col gap-2">
    <SgButton size="sm" onClick={next}>Next (+1)</SgButton>
    <SgButton size="sm" severity="secondary" onClick={prev}>Previous (-1)</SgButton>
    <SgButton size="sm" severity="info" onClick={random}>Random</SgButton>
    <div className="flex flex-wrap gap-2 pt-1">
      {COLOR_OPTIONS.map((item) => (
        <SgButton
          key={item.value}
          size="sm"
          appearance={palette === item.value ? "solid" : "outline"}
          onClick={() => setPalette(item.value)}
        >
          {item.label}
        </SgButton>
      ))}
    </div>
  </div>
</div>`;

const HEX_CODE = `const HEX = Array.from("0123456789ABCDEF");
const [hexIndex, setHexIndex] = React.useState(10);
const hexValue = HEX[hexIndex] ?? "A";

const next = () => setHexIndex((prev) => (prev + 1) % HEX.length);

<div className="flex items-center gap-4">
  <SgSevenSegmentDigit value={hexValue} color="#f97316" backgroundColor="#180b05" offColor="rgba(124,45,18,0.24)" />
  <SgButton size="sm" onClick={next}>Next char</SgButton>
</div>`;

const THEMES_CODE = `<SgGrid columns={{ base: 1, md: 5 }} gap={12}>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">red</p>
    <SgSevenSegmentDigit value="8" palette="red" />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">blue</p>
    <SgSevenSegmentDigit value="8" palette="blue" />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">yellow</p>
    <SgSevenSegmentDigit value="8" palette="yellow" />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">green</p>
    <SgSevenSegmentDigit value="8" palette="green" />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">white</p>
    <SgSevenSegmentDigit value="8" palette="white" />
  </div>
</SgGrid>`;

const SIZE_CODE = `<SgGrid columns={{ base: 1, md: 3 }} gap={12}>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Small</p>
    <SgSevenSegmentDigit value="5" size={72} thickness={10} />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Medium</p>
    <SgSevenSegmentDigit value="5" size={108} thickness={14} />
  </div>
  <div className="space-y-2">
    <p className="text-xs text-muted-foreground">Large</p>
    <SgSevenSegmentDigit value="5" size={148} thickness={18} />
  </div>
</SgGrid>`;

const CLOCK_CODE = `function ColonDots() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-1">
      <span className="size-2 rounded-full bg-red-500/80" />
      <span className="size-2 rounded-full bg-red-500/80" />
    </div>
  );
}

const [seconds, setSeconds] = React.useState(0);
const total = seconds % 86400;
const h = Math.floor(total / 3600);
const m = Math.floor((total % 3600) / 60);
const s = total % 60;
const pad = (n) => String(n).padStart(2, "0");
const hh = pad(h);
const mm = pad(m);
const ss = pad(s);

<div className="space-y-4">
  <div className="flex items-center gap-1">
    <SgSevenSegmentDigit value={hh[0] ?? "0"} size={86} />
    <SgSevenSegmentDigit value={hh[1] ?? "0"} size={86} />
    <ColonDots />
    <SgSevenSegmentDigit value={mm[0] ?? "0"} size={86} />
    <SgSevenSegmentDigit value={mm[1] ?? "0"} size={86} />
    <ColonDots />
    <SgSevenSegmentDigit value={ss[0] ?? "0"} size={86} />
    <SgSevenSegmentDigit value={ss[1] ?? "0"} size={86} />
  </div>
  <SgButton size="sm" onClick={() => setSeconds((prev) => prev + 1)}>+1 second</SgButton>
</div>`;

const PLAYGROUND_CODE = `import * as React from "react";
import {
  SgButton,
  SgGrid,
  SgInputText,
  SgSevenSegmentDigit,
  SgSlider,
  type SgSevenSegmentDigitPalette,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function App() {
  const [value, setValue] = React.useState("8");
  const [color, setColor] = React.useState("#ef4444");
  const [backgroundColor, setBackgroundColor] = React.useState("#120909");
  const [offColor, setOffColor] = React.useState("rgba(127, 29, 29, 0.28)");
  const [size, setSize] = React.useState(108);
  const [thickness, setThickness] = React.useState(14);

  return (
    <div className="space-y-4 p-2">
      <SgInputText id="seven-value" label="Value" value={value} onChange={setValue} />

      <SgGrid columns={{ base: 1, md: 3 }} gap={12}>
        <SgInputText id="seven-color" label="Color" value={color} onChange={setColor} />
        <SgInputText id="seven-bg" label="BackgroundColor" value={backgroundColor} onChange={setBackgroundColor} />
        <SgInputText id="seven-off" label="OffColor" value={offColor} onChange={setOffColor} />
      </SgGrid>

      <SgGrid columns={{ base: 1, md: 2 }} gap={12}>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">size: {size}</p>
          <SgSlider id="seven-size" minValue={64} maxValue={180} value={size} onChange={setSize} />
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">thickness: {thickness}</p>
          <SgSlider id="seven-thickness" minValue={6} maxValue={24} value={thickness} onChange={setThickness} />
        </div>
      </SgGrid>

      <div className="rounded border border-border p-4">
        <SgSevenSegmentDigit
          value={value}
          color={color}
          backgroundColor={backgroundColor}
          offColor={offColor}
          size={size}
          thickness={thickness}
        />
      </div>
    </div>
  );
}`;

const PROPS: ShowcasePropRow[] = [
  { prop: "value", type: "string", defaultValue: "-", description: "Character rendered by the component (first character is used)." },
  { prop: "palette", type: "\"red\" | \"blue\" | \"yellow\" | \"green\" | \"white\"", defaultValue: "\"red\"", description: "Preset visual palette for active, inactive and background colors." },
  { prop: "color", type: "string", defaultValue: "\"#ef4444\"", description: "Color of active segments." },
  { prop: "backgroundColor", type: "string", defaultValue: "\"#120909\"", description: "Background color of the panel." },
  { prop: "offColor", type: "string", defaultValue: "\"rgba(127, 29, 29, 0.28)\"", description: "Color of inactive segments." },
  { prop: "size", type: "number", defaultValue: "108", description: "Component height in pixels." },
  { prop: "width", type: "number", defaultValue: "size * 0.62", description: "Component width in pixels." },
  { prop: "thickness", type: "number", defaultValue: "14", description: "Segment thickness in pixels." },
  { prop: "padding", type: "number", defaultValue: "10", description: "Internal panel padding in pixels." },
  { prop: "rounded", type: "number", defaultValue: "12", description: "Panel border radius in pixels." },
  { prop: "skew", type: "number", defaultValue: "-8", description: "Skew angle used to mimic classic LED displays." },
  { prop: "glow", type: "boolean", defaultValue: "true", description: "Enables glow effect for active segments." },
  { prop: "transitionMs", type: "number", defaultValue: "180", description: "Transition duration for segment state changes." },
  { prop: "className", type: "string", defaultValue: "-", description: "Extra CSS classes on outer wrapper." },
  { prop: "style", type: "React.CSSProperties", defaultValue: "-", description: "Additional inline styles on outer wrapper." }
];

export default function SgSevenSegmentDigitShowcase() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });
  const aiComponent = useAiManifestComponent("SgSevenSegmentDigit");

  const [digit, setDigit] = React.useState("0");
  const [palette, setPalette] = React.useState<SgSevenSegmentDigitPalette>("red");
  const [hexIndex, setHexIndex] = React.useState(10);
  const [seconds, setSeconds] = React.useState(0);

  const hexValue = HEX[hexIndex] ?? "A";
  const total = seconds % 86400;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const hh = pad(h);
  const mm = pad(m);
  const ss = pad(s);

  const nextDigit = React.useCallback(() => setDigit((prev) => String((Number(prev) + 1) % 10)), []);
  const prevDigit = React.useCallback(() => setDigit((prev) => String((Number(prev) - 1 + 10) % 10)), []);
  const randomDigit = React.useCallback(() => setDigit(String(Math.floor(Math.random() * 10))), []);
  const nextHex = React.useCallback(() => setHexIndex((prev) => (prev + 1) % HEX.length), []);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgSevenSegmentDigit"
          subtitle={t(i18n, `${K}.headerSubtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section title={t(i18n, `${K}.section1Title`)} description={t(i18n, `${K}.section1Description`)}>
          <div className="flex items-center gap-4">
            <SgSevenSegmentDigit value={digit} palette={palette} />
            <div className="flex flex-col gap-2">
              <SgButton size="sm" onClick={nextDigit}>Next (+1)</SgButton>
              <SgButton size="sm" severity="secondary" onClick={prevDigit}>Previous (-1)</SgButton>
              <SgButton size="sm" severity="info" onClick={randomDigit}>Random</SgButton>
              <div className="flex flex-wrap gap-2 pt-1">
                {COLOR_OPTIONS.map((item) => (
                  <SgButton
                    key={item.value}
                    size="sm"
                    appearance={palette === item.value ? "solid" : "outline"}
                    onClick={() => setPalette(item.value)}
                  >
                    {item.label}
                  </SgButton>
                ))}
              </div>
            </div>
          </div>
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-seven-segment-digit/samples/basico-0-9.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section2Title`)} description={t(i18n, `${K}.section2Description`)}>
          <div className="flex items-center gap-4">
            <SgSevenSegmentDigit
              value={hexValue}
              color="#f97316"
              backgroundColor="#180b05"
              offColor="rgba(124,45,18,0.24)"
            />
            <SgButton size="sm" onClick={nextHex}>Next char</SgButton>
          </div>
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-seven-segment-digit/samples/hexadecimal-0-9-a-f.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section3Title`)} description={t(i18n, `${K}.section3Description`)}>
          <SgGrid columns={{ base: 1, md: 5 }} gap={12}>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">red</p>
              <SgSevenSegmentDigit value="8" palette="red" />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">blue</p>
              <SgSevenSegmentDigit value="8" palette="blue" />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">yellow</p>
              <SgSevenSegmentDigit value="8" palette="yellow" />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">green</p>
              <SgSevenSegmentDigit value="8" palette="green" />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">white</p>
              <SgSevenSegmentDigit value="8" palette="white" />
            </div>
          </SgGrid>
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-seven-segment-digit/samples/temas-de-cor.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section4Title`)} description={t(i18n, `${K}.section4Description`)}>
          <SgGrid columns={{ base: 1, md: 3 }} gap={12}>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Small</p>
              <SgSevenSegmentDigit value="5" size={72} thickness={10} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Medium</p>
              <SgSevenSegmentDigit value="5" size={108} thickness={14} />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Large</p>
              <SgSevenSegmentDigit value="5" size={148} thickness={18} />
            </div>
          </SgGrid>
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-seven-segment-digit/samples/tamanho-e-espessura.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section5Title`)} description={t(i18n, `${K}.section5Description`)}>
          <div className="space-y-4">
            <div className="flex items-center gap-1">
              <SgSevenSegmentDigit value={hh[0] ?? "0"} size={86} />
              <SgSevenSegmentDigit value={hh[1] ?? "0"} size={86} />
              <ColonDots />
              <SgSevenSegmentDigit value={mm[0] ?? "0"} size={86} />
              <SgSevenSegmentDigit value={mm[1] ?? "0"} size={86} />
              <ColonDots />
              <SgSevenSegmentDigit value={ss[0] ?? "0"} size={86} />
              <SgSevenSegmentDigit value={ss[1] ?? "0"} size={86} />
            </div>
            <SgButton size="sm" onClick={() => setSeconds((prev) => prev + 1)}>+1 second</SgButton>
          </div>
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-seven-segment-digit/samples/composicao-estilo-relogio.tsx.sample" />
        </Section>

        <Section title={t(i18n, `${K}.section6Title`)} description={t(i18n, `${K}.section6Description`)}>
          <SgPlayground
            title="SgSevenSegmentDigit Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/digits/sg-seven-segment-digit/sg-seven-segment-digit.tsx.playground"
            height={700}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={PROPS} title={t(i18n, `${K}.propsReferenceTitle`)} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}

