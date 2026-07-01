"use client";

import * as React from "react";
import { SgStringAnimator, type SgStringAnimatorRef, SgButton, SgGrid } from "@seedgrid/fe-components";
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

const K = "showcase.component.stringAnimator";

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
// Example 1 â€” Nomes (Roller 3D, left-aligned, manual trigger)
// ---------------------------------------------------------------------------
const EX1_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="LUCIANO"
    targetString="MARTA"
    stringAnimatorStyle="roller3d"
    alignTo="left"
    fontSize={28}
  />
  <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
    Animar
  </SgButton>
</div>`;

function Ex1() {
  const animRef = React.useRef<SgStringAnimatorRef>(null);
  return (
    <div className="flex flex-col gap-4">
      <SgStringAnimator
        ref={animRef}
        sourceString="LUCIANO"
        targetString="MARTA"
        stringAnimatorStyle="roller3d"
        alignTo="left"
        fontSize={28}
      />
      <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
        Animar
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 2 â€” Numeros (Roller 3D, right-aligned, manual trigger)
// ---------------------------------------------------------------------------
const EX2_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="42"
    targetString="1337"
    stringAnimatorStyle="roller3d"
    alignTo="right"
    fontSize={28}
  />
  <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
    Animar
  </SgButton>
</div>`;

function Ex2() {
  const animRef = React.useRef<SgStringAnimatorRef>(null);
  return (
    <div className="flex flex-col gap-4">
      <SgStringAnimator
        ref={animRef}
        sourceString="42"
        targetString="1337"
        stringAnimatorStyle="roller3d"
        alignTo="right"
        fontSize={28}
      />
      <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
        Animar
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 3 â€” Estilo Flip
// ---------------------------------------------------------------------------
const EX3_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="LUCIANO"
    targetString="MARTA"
    stringAnimatorStyle="flip"
    alignTo="left"
    fontSize={28}
  />
  <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
    Animar
  </SgButton>
</div>`;

function Ex3() {
  const animRef = React.useRef<SgStringAnimatorRef>(null);
  return (
    <div className="flex flex-col gap-4">
      <SgStringAnimator
        ref={animRef}
        sourceString="LUCIANO"
        targetString="MARTA"
        stringAnimatorStyle="flip"
        alignTo="left"
        fontSize={28}
      />
      <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
        Animar
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 4 â€” Estilo Neon
// ---------------------------------------------------------------------------
const EX4_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="LUCIANO"
    targetString="MARTA"
    stringAnimatorStyle="neon"
    alignTo="left"
    fontSize={28}
    color="#e4fbff"
    backgroundColor="#090f22"
  />
  <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
    Animar
  </SgButton>
</div>`;

function Ex4() {
  const animRef = React.useRef<SgStringAnimatorRef>(null);
  return (
    <div className="flex flex-col gap-4">
      <SgStringAnimator
        ref={animRef}
        sourceString="LUCIANO"
        targetString="MARTA"
        stringAnimatorStyle="neon"
        alignTo="left"
        fontSize={28}
        color="#e4fbff"
        backgroundColor="#090f22"
      />
      <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
        Animar
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 5 â€” Estilo Fade
// ---------------------------------------------------------------------------
const EX5_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="LUCIANO"
    targetString="MARTA"
    stringAnimatorStyle="fade"
    alignTo="left"
    fontSize={28}
  />
  <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
    Animar
  </SgButton>
</div>`;

function Ex5() {
  const animRef = React.useRef<SgStringAnimatorRef>(null);
  return (
    <div className="flex flex-col gap-4">
      <SgStringAnimator
        ref={animRef}
        sourceString="LUCIANO"
        targetString="MARTA"
        stringAnimatorStyle="fade"
        alignTo="left"
        fontSize={28}
      />
      <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
        Animar
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 6 â€” Estilo Discard
// ---------------------------------------------------------------------------
const EX6_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="LUCIANO"
    targetString="MARTA"
    stringAnimatorStyle="discard"
    alignTo="left"
    fontSize={28}
  />
  <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
    Animar
  </SgButton>
</div>`;

function Ex6() {
  const animRef = React.useRef<SgStringAnimatorRef>(null);
  return (
    <div className="flex flex-col gap-4">
      <SgStringAnimator
        ref={animRef}
        sourceString="LUCIANO"
        targetString="MARTA"
        stringAnimatorStyle="discard"
        alignTo="left"
        fontSize={28}
      />
      <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
        Animar
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 7 â€” Estilo Matrix
// ---------------------------------------------------------------------------
const EX7_CODE = `const animRef = React.useRef<SgStringAnimatorRef>(null);

<div className="flex flex-col gap-4">
  <SgStringAnimator
    ref={animRef}
    sourceString="LUCIANO"
    targetString="MARTA"
    stringAnimatorStyle="matrix"
    alignTo="left"
    color="#22d3ee"
    backgroundColor="#0b1220"
  />
  <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
    Animar
  </SgButton>
</div>`;

function Ex7() {
  const animRef = React.useRef<SgStringAnimatorRef>(null);
  return (
    <div className="flex flex-col gap-4">
      <SgStringAnimator
        ref={animRef}
        sourceString="LUCIANO"
        targetString="MARTA"
        stringAnimatorStyle="matrix"
        alignTo="left"
        color="#22d3ee"
        backgroundColor="#0b1220"
      />
      <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
        Animar
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 8 â€” autoStart: troca automatica ao mudar targetString
// ---------------------------------------------------------------------------
const EX8_CODE = `const NAMES = ["LUCIANO", "MARTA", "PEDRO", "ANA", "SEEDGRID"];
const [idx, setIdx] = React.useState(0);
const [target, setTarget] = React.useState(NAMES[0] ?? "");

const next = () => {
  const nextIdx = (idx + 1) % NAMES.length;
  const nextName = NAMES[nextIdx] ?? NAMES[0] ?? "";
  setIdx(nextIdx);
  setTarget(nextName);
};

<div className="flex flex-col gap-4">
  <SgStringAnimator
    sourceString={NAMES[(idx - 1 + NAMES.length) % NAMES.length] ?? target}
    targetString={target}
    stringAnimatorStyle="roller3d"
    alignTo="left"
    fontSize={28}
    autoStart
    velocity={60}
  />
  <SgButton size="sm" onClick={next}>
    Next name
  </SgButton>
</div>`;

const EX8_NAMES = ["LUCIANO", "MARTA", "PEDRO", "ANA", "SEEDGRID"];

function Ex8() {
  const [idx, setIdx] = React.useState(0);
  const [target, setTarget] = React.useState(EX8_NAMES[0] ?? "");

  const next = () => {
    const nextIdx = (idx + 1) % EX8_NAMES.length;
    const nextName = EX8_NAMES[nextIdx] ?? EX8_NAMES[0] ?? "";
    setIdx(nextIdx);
    setTarget(nextName);
  };

  return (
    <div className="flex flex-col gap-4">
      <SgStringAnimator
        sourceString={EX8_NAMES[(idx - 1 + EX8_NAMES.length) % EX8_NAMES.length] ?? target}
        targetString={target}
        stringAnimatorStyle="roller3d"
        alignTo="left"
        fontSize={28}
        autoStart
        velocity={60}
      />
      <SgButton size="sm" onClick={next}>
        Next name
      </SgButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Example 9 â€” Velocidades
// ---------------------------------------------------------------------------
const EX9_CODE = `{[
  { label: "Lento (velocity=10)",  velocity: 10 },
  { label: "Medium (velocity=50)",  velocity: 50 },
  { label: "Rapido (velocity=90)", velocity: 90 },
].map(({ label, velocity }) => {
  const r = React.useRef<SgStringAnimatorRef>(null);
  return (
    <div key={label} className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <SgStringAnimator
        ref={r}
        sourceString="ORIGEM"
        targetString="DESTINO"
        stringAnimatorStyle="roller3d"
        alignTo="left"
        fontSize={22}
        velocity={velocity}
      />
      <SgButton size="sm" onClick={() => r.current?.startAnimation()}>
        Animar
      </SgButton>
    </div>
  );
})}`;

const VELOCITY_CASES = [
  { label: "Lento (velocity=10)", velocity: 10 },
  { label: "Medium (velocity=50)", velocity: 50 },
  { label: "Rapido (velocity=90)", velocity: 90 },
] as const;

function Ex9() {
  const refs = [
    React.useRef<SgStringAnimatorRef>(null),
    React.useRef<SgStringAnimatorRef>(null),
    React.useRef<SgStringAnimatorRef>(null),
  ] as const;

  return (
    <SgGrid columns={{ base: 1, md: 3 }} gap={24}>
      {VELOCITY_CASES.map(({ label, velocity }, i) => {
        const ref = refs[i] ?? refs[0];
        return (
          <div key={label} className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">{label}</span>
            <SgStringAnimator
              ref={ref}
              sourceString="ORIGEM"
              targetString="DESTINO"
              stringAnimatorStyle="roller3d"
              alignTo="left"
              fontSize={22}
              velocity={velocity}
            />
            <SgButton size="sm" onClick={() => ref.current?.startAnimation()}>
              Animar
            </SgButton>
          </div>
        );
      })}
    </SgGrid>
  );
}










// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------
const PLAYGROUND_CODE = `import * as React from "react";
import {
  SgStringAnimator,
  type SgStringAnimatorRef,
  SgButton,
  SgGrid,
  SgInputText,
  SgToggleSwitch,
} from "@seedgrid/fe-components";
import { SgPlayground } from "@seedgrid/fe-playground";

export default function App() {
  const animRef = React.useRef(null);
  const [source, setSource] = React.useState("LUCIANO");
  const [target, setTarget] = React.useState("MARTA");
  const [stringAnimatorStyle, setStringAnimatorStyle] = React.useState("roller3d");
  const [alignTo, setAlignTo] = React.useState("left");
  const [velocity, setVelocity] = React.useState(50);
  const [fontSize, setFontSize] = React.useState(28);
  const [emptyChar, setEmptyChar] = React.useState(" ");
  const [autoStart, setAutoStart] = React.useState(false);
  const [color, setColor] = React.useState("");
  const [backgroundColor, setBackgroundColor] = React.useState("");

  return (
    <div className="space-y-6 p-4">
      <SgGrid columns={{ base: 1, md: 2 }} gap={12}>
        <SgInputText
          id="pg-source"
          label="sourceString"
          value={source}
          onChange={(v) => setSource(v.toUpperCase())}
        />
        <SgInputText
          id="pg-target"
          label="targetString"
          value={target}
          onChange={(v) => setTarget(v.toUpperCase())}
        />
      </SgGrid>

      <SgGrid columns={{ base: 2, md: 4 }} gap={12}>
        <label className="text-xs font-medium">
          style
          <select
            className="mt-1 block w-full rounded border border-border bg-background px-2 py-1 text-xs"
            value={stringAnimatorStyle}
            onChange={(e) => setStringAnimatorStyle(e.target.value)}
          >
            <option value="roller3d">roller3d</option>
            <option value="flip">flip</option>
            <option value="neon">neon</option>
            <option value="fade">fade</option>
            <option value="discard">discard</option>
            <option value="matrix">matrix</option>
          </select>
        </label>

        <label className="text-xs font-medium">
          alignTo
          <select
            className="mt-1 block w-full rounded border border-border bg-background px-2 py-1 text-xs"
            value={alignTo}
            onChange={(e) => setAlignTo(e.target.value)}
          >
            <option value="left">left</option>
            <option value="right">right</option>
          </select>
        </label>

        <label className="text-xs font-medium">
          emptyChar
          <input
            className="mt-1 block w-full rounded border border-border bg-background px-2 py-1 text-xs"
            value={emptyChar}
            maxLength={1}
            onChange={(e) => setEmptyChar(e.target.value || " ")}
          />
        </label>

        <SgToggleSwitch
          id="pg-autostart"
          label="autoStart"
          checked={autoStart}
          onChange={setAutoStart}
        />
      </SgGrid>

      <SgGrid columns={{ base: 1, md: 2 }} gap={12}>
        <SgInputText
          id="pg-color"
          label="color (neon/fade/discard/matrix)"
          value={color}
          onChange={setColor}
          placeholder="ex: #e4fbff"
        />
        <SgInputText
          id="pg-bg"
          label="backgroundColor (neon/fade/discard/matrix)"
          value={backgroundColor}
          onChange={setBackgroundColor}
          placeholder="ex: #090f22"
        />
      </SgGrid>

      <SgGrid columns={{ base: 1, md: 2 }} gap={12}>
        <label className="text-xs font-medium">
          velocity ({velocity})
          <input
            className="mt-1 block w-full"
            type="range"
            min={1}
            max={100}
            value={velocity}
            onChange={(e) => setVelocity(Number(e.target.value))}
          />
        </label>
        <label className="text-xs font-medium">
          fontSize ({fontSize}px)
          <input
            className="mt-1 block w-full"
            type="range"
            min={14}
            max={60}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </label>
      </SgGrid>

      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-muted/30 p-4">
        <SgStringAnimator
          ref={animRef}
          sourceString={source}
          targetString={target}
          stringAnimatorStyle={stringAnimatorStyle}
          alignTo={alignTo}
          velocity={velocity}
          fontSize={fontSize}
          emptyChar={emptyChar}
          autoStart={autoStart}
          {...(color ? { color } : {})}
          {...(backgroundColor ? { backgroundColor } : {})}
        />
        <SgButton size="sm" onClick={() => animRef.current?.startAnimation()}>
          startAnimation()
        </SgButton>
      </div>
    </div>
  );
}`;

// ---------------------------------------------------------------------------
// Props reference
// ---------------------------------------------------------------------------
const PROPS: ShowcasePropRow[] = [
  {
    prop: "sourceString",
    type: "string",
    defaultValue: "-",
    description: "String exibida antes da animacao. Ao mudar, o display reseta para ela.",
  },
  {
    prop: "targetString",
    type: "string",
    defaultValue: "-",
    description: "String de destino. A animacao transiciona cada caractere ate o alvo.",
  },
  {
    prop: "stringAnimatorStyle",
    type: '"roller3d" | "flip" | "neon" | "fade" | "discard" | "matrix"',
    defaultValue: '"roller3d"',
    description:
      'Estilo de animacao por caractere: tambor vertical, flip card, neon, fade, discard (folha voadora) ou matrix LED.',
  },
  {
    prop: "velocity",
    type: "number",
    defaultValue: "50",
    description: "Velocidade de 1 (lento) a 100 (rapido). Controla o delay entre cada caractere.",
  },
  {
    prop: "emptyChar",
    type: "string",
    defaultValue: '" "',
    description:
      "Caractere para preencher posicoes extras quando as strings tem comprimentos diferentes.",
  },
  {
    prop: "alignTo",
    type: '"left" | "right"',
    defaultValue: '"left"',
    description:
      '"left" preenche a direita (nomes), "right" preenche a esquerda (numeros). Determina tambem a ordem de animacao dos caracteres.',
  },
  {
    prop: "autoStart",
    type: "boolean",
    defaultValue: "false",
    description:
      "Se true, inicia animacao automaticamente ao montar e sempre que targetString mudar.",
  },
  {
    prop: "fontSize",
    type: "number",
    defaultValue: "32",
    description: "Tamanho da fonte em pixels. Controla a escala de cada digito.",
  },
  {
    prop: "color",
    type: "string",
    defaultValue: "-",
    description:
      "Cor principal do texto/ponto. Aplicada nos estilos neon, fade, discard e matrix.",
  },
  {
    prop: "backgroundColor",
    type: "string",
    defaultValue: "-",
    description: "Cor de fundo de cada digito. Aplicada nos estilos neon, fade, discard e matrix.",
  },
  {
    prop: "charset",
    type: "string[]",
    defaultValue: "DEFAULT_CHARSET",
    description:
      'Conjunto de caracteres validos para o SgRoller3DDigit. Ignorado quando stringAnimatorStyle != "roller3d".',
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "-",
    description: "Classes CSS adicionais no container externo.",
  },
  {
    prop: "ref",
    type: "SgStringAnimatorRef",
    defaultValue: "-",
    description: "Ref imperativa. Expoe o metodo startAnimation() para acionar a animacao manualmente.",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function SgStringAnimatorShowcase() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });
  const aiComponent = useAiManifestComponent("SgStringAnimator");

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
          title="SgStringAnimator"
          subtitle={t(i18n, `${K}.headerSubtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        {/* 1 */}
        <Section
          title={t(i18n, `${K}.section1Title`)}
          description={t(i18n, `${K}.section1Description`)}
        >
          <Ex1 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-string-animator/samples/roller-3d-nomes-left-aligned.tsx.sample" />
        </Section>

        {/* 2 */}
        <Section
          title={t(i18n, `${K}.section2Title`)}
          description={t(i18n, `${K}.section2Description`)}
        >
          <Ex2 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-string-animator/samples/roller-3d-numeros-right-aligned.tsx.sample" />
        </Section>

        {/* 3 */}
        <Section
          title={t(i18n, `${K}.section3Title`)}
          description={t(i18n, `${K}.section3Description`)}
        >
          <Ex3 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-string-animator/samples/estilo-flip.tsx.sample" />
        </Section>

        {/* 4 */}
        <Section
          title={t(i18n, `${K}.section4Title`)}
          description={t(i18n, `${K}.section4Description`)}
        >
          <Ex4 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-string-animator/samples/estilo-neon.tsx.sample" />
        </Section>

        {/* 5 */}
        <Section
          title={t(i18n, `${K}.section5Title`)}
          description={t(i18n, `${K}.section5Description`)}
        >
          <Ex5 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-string-animator/samples/estilo-fade.tsx.sample" />
        </Section>

        {/* 6 */}
        <Section
          title={t(i18n, `${K}.section6Title`)}
          description={t(i18n, `${K}.section6Description`)}
        >
          <Ex6 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-string-animator/samples/estilo-discard.tsx.sample" />
        </Section>

        {/* 7 */}
        <Section
          title={t(i18n, `${K}.section7Title`)}
          description={t(i18n, `${K}.section7Description`)}
        >
          <Ex7 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-string-animator/samples/estilo-matrix.tsx.sample" />
        </Section>

        {/* 8 */}
        <Section
          title={t(i18n, `${K}.section8Title`)}
          description={t(i18n, `${K}.section8Description`)}
        >
          <Ex8 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-string-animator/samples/autostart-animacao-automatica.tsx.sample" />
        </Section>

        {/* 9 */}
        <Section
          title={t(i18n, `${K}.section9Title`)}
          description={t(i18n, `${K}.section9Description`)}
        >
          <Ex9 />
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/gadgets/sg-string-animator/samples/velocidades.tsx.sample" />
        </Section>

        {/* Playground */}
        <Section
          title={t(i18n, `${K}.playgroundTitle`)}
          description={t(i18n, `${K}.playgroundDescription`)}
        >
          <SgPlayground
            title={t(i18n, `${K}.playgroundCardTitle`)}
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/gadgets/sg-string-animator/sg-string-animator.tsx.playground"
            height={760}
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


