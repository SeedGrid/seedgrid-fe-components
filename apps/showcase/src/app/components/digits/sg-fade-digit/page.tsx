"use client";

import * as React from "react";
import { SgButton, SgFadeDigit } from "@seedgrid/fe-components";
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

const K = "showcase.component.fadeDigit";

function Section(props: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      data-showcase-example="true"
      className="scroll-mt-[var(--showcase-anchor-offset,18rem)] rounded-lg border border-border p-6"
    >
      <h2 data-anchor-title="true" className="text-lg font-semibold">
        {props.title}
      </h2>
      {props.description ? (
        <p className="mt-1 text-sm text-muted-foreground">{props.description}</p>
      ) : null}
      <div className="mt-4 space-y-4">{props.children}</div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Colon helper â€” matches the flip/fade clock aesthetic
// ---------------------------------------------------------------------------









function Colon({ height }: { height: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2"
      style={{ height }}
    >
      <div className="h-2 w-2 rounded-full bg-[#edebeb]/80" />
      <div className="h-2 w-2 rounded-full bg-[#edebeb]/80" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 1 â€” Basico (0-9)
// ---------------------------------------------------------------------------
const EX1_CODE = `const [digit, setDigit] = React.useState("0");

const next   = () => setDigit((p) => String((Number(p) + 1) % 10));
const prev   = () => setDigit((p) => String((Number(p) - 1 + 10) % 10));
const random = () => setDigit(String(Math.floor(Math.random() * 10)));

<div className="flex items-center gap-4">
  <SgFadeDigit value={digit} />
  <div className="flex flex-col gap-2">
    <SgButton size="sm" onClick={next}>Next (+1)</SgButton>
    <SgButton size="sm" severity="secondary" onClick={prev}>Previous (-1)</SgButton>
    <SgButton size="sm" severity="info" onClick={random}>Random</SgButton>
  </div>
</div>`;

function Ex1() {
  const [digit, setDigit] = React.useState("0");
  const next = () => setDigit((p) => String((Number(p) + 1) % 10));
  const prev = () => setDigit((p) => String((Number(p) - 1 + 10) % 10));
  const random = () => setDigit(String(Math.floor(Math.random() * 10)));
  return (
    <div className="flex items-center gap-4">
      <SgFadeDigit value={digit} />
      <div className="flex flex-col gap-2">
        <SgButton size="sm" onClick={next}>Next (+1)</SgButton>
        <SgButton size="sm" severity="secondary" onClick={prev}>Previous (-1)</SgButton>
        <SgButton size="sm" severity="info" onClick={random}>Random</SgButton>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 2 â€” Letras (A-Z)
// ---------------------------------------------------------------------------
const EX2_CODE = `const ALPHA = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const [letter, setLetter] = React.useState("A");

const nextLetter = () => {
  const i = ALPHA.indexOf(letter);
  const next = ALPHA[(i + 1) % ALPHA.length] ?? ALPHA[0] ?? "A";
  setLetter(next);
};

<div className="flex items-center gap-4">
  <SgFadeDigit value={letter} />
  <SgButton size="sm" onClick={nextLetter}>Proxima letra</SgButton>
</div>`;

const ALPHA = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

function Ex2() {
  const [letter, setLetter] = React.useState("A");
  const nextLetter = () => {
    const i = ALPHA.indexOf(letter);
    const next = ALPHA[(i + 1) % ALPHA.length] ?? ALPHA[0] ?? "A";
    setLetter(next);
  };
  return (
    <div className="flex items-center gap-4">
      <SgFadeDigit value={letter} />
      <SgButton size="sm" onClick={nextLetter}>Proxima letra</SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 3 â€” Cores customizadas
// ---------------------------------------------------------------------------
const EX3_CODE = `{/* Cada cartao usa color + backgroundColor independentes */}
<div className="flex flex-wrap items-center gap-4">
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Padrao</p>
    <SgFadeDigit value="7" color="#edebeb" backgroundColor="#333232" />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Verde</p>
    <SgFadeDigit value="7" color="#4ade80" backgroundColor="#052e16" />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Azul</p>
    <SgFadeDigit value="7" color="#60a5fa" backgroundColor="#0f172a" />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Rosa</p>
    <SgFadeDigit value="7" color="#f472b6" backgroundColor="#2d0a1e" />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Ambar</p>
    <SgFadeDigit value="7" color="#fbbf24" backgroundColor="#1c1007" />
  </div>
</div>`;

function Ex3() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="text-center">
        <p className="mb-2 text-xs text-muted-foreground">Padrao</p>
        <SgFadeDigit value="7" color="#edebeb" backgroundColor="#333232" />
      </div>
      <div className="text-center">
        <p className="mb-2 text-xs text-muted-foreground">Verde</p>
        <SgFadeDigit value="7" color="#4ade80" backgroundColor="#052e16" />
      </div>
      <div className="text-center">
        <p className="mb-2 text-xs text-muted-foreground">Azul</p>
        <SgFadeDigit value="7" color="#60a5fa" backgroundColor="#0f172a" />
      </div>
      <div className="text-center">
        <p className="mb-2 text-xs text-muted-foreground">Rosa</p>
        <SgFadeDigit value="7" color="#f472b6" backgroundColor="#2d0a1e" />
      </div>
      <div className="text-center">
        <p className="mb-2 text-xs text-muted-foreground">Ambar</p>
        <SgFadeDigit value="7" color="#fbbf24" backgroundColor="#1c1007" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 4 â€” Auto increment
// ---------------------------------------------------------------------------
const EX4_CODE = `const [running, setRunning] = React.useState(false);
const [counter, setCounter] = React.useState("0");

React.useEffect(() => {
  if (!running) return;
  const id = window.setInterval(() => {
    setCounter((p) => String((Number(p) + 1) % 10));
  }, 800);
  return () => window.clearInterval(id);
}, [running]);

<div className="flex items-center gap-4">
  <SgFadeDigit value={counter} />
  <SgButton onClick={() => setRunning((p) => !p)}>
    {running ? "Parar" : "Iniciar"}
  </SgButton>
</div>`;

function Ex4() {
  const [running, setRunning] = React.useState(false);
  const [counter, setCounter] = React.useState("0");
  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setCounter((p) => String((Number(p) + 1) % 10));
    }, 800);
    return () => window.clearInterval(id);
  }, [running]);
  return (
    <div className="flex items-center gap-4">
      <SgFadeDigit value={counter} />
      <SgButton onClick={() => setRunning((p) => !p)}>
        {running ? "Parar" : "Iniciar"}
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 5 â€” Sequencia estilo relogio
// ---------------------------------------------------------------------------
const CARD_H_70 = Math.round(70 * 1.38); // matches default fontSize=70

const EX5_CODE = `const [running, setRunning] = React.useState(false);
const [time, setTime] = React.useState({ h: 0, m: 0, s: 0 });

React.useEffect(() => {
  if (!running) return;
  const id = window.setInterval(() => {
    setTime((prev) => {
      const s = (prev.s + 1) % 60;
      const m = s === 0 ? (prev.m + 1) % 60 : prev.m;
      const h = s === 0 && m === 0 ? (prev.h + 1) % 24 : prev.h;
      return { h, m, s };
    });
  }, 1000);
  return () => window.clearInterval(id);
}, [running]);

const pad = (n: number) => String(n).padStart(2, "0");
const CARD_H = Math.round(70 * 1.38); // card height at fontSize=70

const Colon = () => (
  <div className="flex flex-col items-center justify-center gap-2" style={{ height: CARD_H }}>
    <div className="h-2 w-2 rounded-full bg-[#edebeb]/80" />
    <div className="h-2 w-2 rounded-full bg-[#edebeb]/80" />
  </div>
);

<div className="flex flex-col gap-4">
  <div className="flex items-center gap-2">
    <SgFadeDigit value={pad(time.h).charAt(0)} />
    <SgFadeDigit value={pad(time.h).charAt(1)} />
    <Colon />
    <SgFadeDigit value={pad(time.m).charAt(0)} />
    <SgFadeDigit value={pad(time.m).charAt(1)} />
    <Colon />
    <SgFadeDigit value={pad(time.s).charAt(0)} />
    <SgFadeDigit value={pad(time.s).charAt(1)} />
  </div>
  <SgButton size="sm" onClick={() => setRunning((p) => !p)}>
    {running ? "Parar" : "Iniciar"}
  </SgButton>
</div>`;

function Ex5() {
  const [running, setRunning] = React.useState(false);
  const [time, setTime] = React.useState({ h: 0, m: 0, s: 0 });
  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setTime((prev) => {
        const s = (prev.s + 1) % 60;
        const m = s === 0 ? (prev.m + 1) % 60 : prev.m;
        const h = s === 0 && m === 0 ? (prev.h + 1) % 24 : prev.h;
        return { h, m, s };
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <SgFadeDigit value={pad(time.h).charAt(0)} />
        <SgFadeDigit value={pad(time.h).charAt(1)} />
        <Colon height={CARD_H_70} />
        <SgFadeDigit value={pad(time.m).charAt(0)} />
        <SgFadeDigit value={pad(time.m).charAt(1)} />
        <Colon height={CARD_H_70} />
        <SgFadeDigit value={pad(time.s).charAt(0)} />
        <SgFadeDigit value={pad(time.s).charAt(1)} />
      </div>
      <SgButton size="sm" onClick={() => setRunning((p) => !p)}>
        {running ? "Parar" : "Iniciar"}
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 6 â€” Tamanhos
// ---------------------------------------------------------------------------
const EX6_CODE = `<div className="flex items-end gap-6">
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Small (40px)</p>
    <SgFadeDigit value="5" fontSize={40} />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Medium (70px)</p>
    <SgFadeDigit value="5" fontSize={70} />
  </div>
  <div className="text-center">
    <p className="mb-2 text-xs text-muted-foreground">Large (110px)</p>
    <SgFadeDigit value="5" fontSize={110} />
  </div>
</div>`;

function Ex6() {
  return (
    <div className="flex items-end gap-6">
      <div className="text-center">
        <p className="mb-2 text-xs text-muted-foreground">Small (40px)</p>
        <SgFadeDigit value="5" fontSize={40} />
      </div>
      <div className="text-center">
        <p className="mb-2 text-xs text-muted-foreground">Medium (70px)</p>
        <SgFadeDigit value="5" fontSize={70} />
      </div>
      <div className="text-center">
        <p className="mb-2 text-xs text-muted-foreground">Large (110px)</p>
        <SgFadeDigit value="5" fontSize={110} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------
const PLAYGROUND_CODE = `import * as React from "react";
import { SgButton, SgFadeDigit } from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

const PALETTE = [
  { label: "Padrao",  color: "#edebeb", backgroundColor: "#333232" },
  { label: "Verde",   color: "#4ade80", backgroundColor: "#052e16" },
  { label: "Azul",    color: "#60a5fa", backgroundColor: "#0f172a" },
  { label: "Rosa",    color: "#f472b6", backgroundColor: "#2d0a1e" },
  { label: "Ambar",   color: "#fbbf24", backgroundColor: "#1c1007" },
];

const CARD_H = (fs) => Math.round(fs * 1.38);

function Colon({ fontSize }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2"
         style={{ height: CARD_H(fontSize) }}>
      <div className="h-2 w-2 rounded-full bg-[#edebeb]/80" />
      <div className="h-2 w-2 rounded-full bg-[#edebeb]/80" />
    </div>
  );
}

export default function App() {
  const [running, setRunning] = React.useState(false);
  const [time, setTime] = React.useState({ h: 0, m: 0, s: 0 });
  const [fontSize, setFontSize] = React.useState(60);
  const [paletteIdx, setPaletteIdx] = React.useState(0);
  const palette = PALETTE[paletteIdx];

  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setTime((prev) => {
        const s = (prev.s + 1) % 60;
        const m = s === 0 ? (prev.m + 1) % 60 : prev.m;
        const h = s === 0 && m === 0 ? (prev.h + 1) % 24 : prev.h;
        return { h, m, s };
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-wrap gap-2">
        {PALETTE.map((p, i) => (
          <SgButton
            key={p.label}
            size="sm"
            severity={i === paletteIdx ? "primary" : "secondary"}
            onClick={() => setPaletteIdx(i)}
          >
            {p.label}
          </SgButton>
        ))}
      </div>

      <label className="block text-xs font-medium">
        fontSize ({fontSize}px)
        <input
          className="mt-1 w-full"
          type="range" min={30} max={120}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />
      </label>

      <div className="flex items-center gap-2">
        <SgFadeDigit value={pad(time.h).charAt(0)} fontSize={fontSize} {...palette} />
        <SgFadeDigit value={pad(time.h).charAt(1)} fontSize={fontSize} {...palette} />
        <Colon fontSize={fontSize} />
        <SgFadeDigit value={pad(time.m).charAt(0)} fontSize={fontSize} {...palette} />
        <SgFadeDigit value={pad(time.m).charAt(1)} fontSize={fontSize} {...palette} />
        <Colon fontSize={fontSize} />
        <SgFadeDigit value={pad(time.s).charAt(0)} fontSize={fontSize} {...palette} />
        <SgFadeDigit value={pad(time.s).charAt(1)} fontSize={fontSize} {...palette} />
      </div>

      <SgButton onClick={() => setRunning((p) => !p)}>
        {running ? "Parar" : "Iniciar relogio"}
      </SgButton>
    </div>
  );
}`;

// ---------------------------------------------------------------------------
// Props reference
// ---------------------------------------------------------------------------
const PROPS: ShowcasePropRow[] = [
  {
    prop: "value",
    type: "string",
    defaultValue: "-",
    description:
      "Caractere exibido no card. Ao mudar, o digito atual apaga e o novo acende.",
  },
  {
    prop: "color",
    type: "string",
    defaultValue: '"#edebeb"',
    description: "Cor do texto e do brilho (glow). Tambem controla o halo de luz.",
  },
  {
    prop: "backgroundColor",
    type: "string",
    defaultValue: '"#333232"',
    description: "Cor de fundo do card.",
  },
  {
    prop: "font",
    type: "string",
    defaultValue: "-",
    description: "CSS font-family aplicado ao digito.",
  },
  {
    prop: "fontSize",
    type: "number",
    defaultValue: "70",
    description: "Tamanho da fonte em pixels. Controla a escala geral do card (largura, altura e raio).",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "-",
    description: "Classes CSS adicionais no wrapper externo do card.",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function SgFadeDigitShowcase() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });
  const aiComponent = useAiManifestComponent("SgFadeDigit");

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={
          { ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties
        }
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgFadeDigit"
          subtitle={t(i18n, `${K}.headerSubtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        {/* 1 */}
        <Section title={t(i18n, `${K}.section1Title`)} description={t(i18n, `${K}.section1Description`)}>
          <Ex1 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-fade-digit/samples/basico-0-9.tsx.sample" />
        </Section>

        {/* 2 */}
        <Section title={t(i18n, `${K}.section2Title`)} description={t(i18n, `${K}.section2Description`)}>
          <Ex2 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-fade-digit/samples/letras-a-z.tsx.sample" />
        </Section>

        {/* 3 */}
        <Section title={t(i18n, `${K}.section3Title`)} description={t(i18n, `${K}.section3Description`)}>
          <Ex3 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-fade-digit/samples/cores-customizadas.tsx.sample" />
        </Section>

        {/* 4 */}
        <Section title={t(i18n, `${K}.section4Title`)} description={t(i18n, `${K}.section4Description`)}>
          <Ex4 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-fade-digit/samples/auto-increment.tsx.sample" />
        </Section>

        {/* 5 */}
        <Section title={t(i18n, `${K}.section5Title`)} description={t(i18n, `${K}.section5Description`)}>
          <Ex5 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-fade-digit/samples/sequencia-estilo-relogio.tsx.sample" />
        </Section>

        {/* 6 */}
        <Section title={t(i18n, `${K}.section6Title`)} description={t(i18n, `${K}.section6Description`)}>
          <Ex6 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-fade-digit/samples/tamanhos.tsx.sample" />
        </Section>

        {/* Playground */}
        <Section title={t(i18n, `${K}.section7Title`)} description={t(i18n, `${K}.section7Description`)}>
          <SgPlayground
            title="SgFadeDigit Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/digits/sg-fade-digit/sg-fade-digit.tsx.playground"
            height={560}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={PROPS} title={t(i18n, `${K}.propsReferenceTitle`)} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div
          aria-hidden="true"
          className="pointer-events-none"
          style={{ height: `calc(${anchorOffset}px + 40vh)` }}
        />
      </div>
    </I18NReady>
  );
}



