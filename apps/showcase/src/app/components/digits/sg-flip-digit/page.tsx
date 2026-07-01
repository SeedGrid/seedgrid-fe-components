"use client";

import * as React from "react";
import { SgButton, SgFlipDigit, SgGrid } from "@seedgrid/fe-components";
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

const K = "showcase.component.flipDigit";

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










const FLIP_DIGIT_PROPS: ShowcasePropRow[] = [
  { prop: "value", type: "string", defaultValue: "-", description: "Caractere exibido no card flip (1 char recomendado)." },
  { prop: "width", type: "number", defaultValue: "80", description: "Largura do card em pixels." },
  { prop: "height", type: "number", defaultValue: "120", description: "Altura do card em pixels." },
  { prop: "fontSize", type: "number", defaultValue: "70", description: "Tamanho da fonte em pixels." },
  { prop: "className", type: "string", defaultValue: "-", description: "Classes CSS adicionais no container." }
];

export default function SgFlipDigitShowcase() {
  const i18n = useShowcaseI18n();
  const { pageRef, stickyHeaderRef, anchorOffset, exampleLinks, handleAnchorClick } =
    useShowcaseAnchors({ deps: [i18n.locale] });
  const aiComponent = useAiManifestComponent("SgFlipDigit");
  const [digit, setDigit] = React.useState("0");
  const [letter, setLetter] = React.useState("A");
  const [running, setRunning] = React.useState(false);
  const [autoDigit, setAutoDigit] = React.useState("0");

  const nextDigit = React.useCallback(() => setDigit((prev) => String((Number(prev) + 1) % 10)), []);
  const prevDigit = React.useCallback(() => setDigit((prev) => String((Number(prev) - 1 + 10) % 10)), []);
  const randomDigit = React.useCallback(() => setDigit(String(Math.floor(Math.random() * 10))), []);

  const nextLetter = React.useCallback(() => {
    const current = letter.charCodeAt(0);
    const next = current >= 90 ? 65 : current + 1;
    setLetter(String.fromCharCode(next));
  }, [letter]);

  React.useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setAutoDigit((prev) => String((Number(prev) + 1) % 10));
    }, 1300);
    return () => window.clearInterval(timer);
  }, [running]);

  return (
    <I18NReady>
      <div
        ref={pageRef}
        className="max-w-5xl space-y-8"
        style={{ ["--showcase-anchor-offset" as string]: `${anchorOffset}px` } as React.CSSProperties}
      >
        <ShowcaseStickyHeader
          stickyHeaderRef={stickyHeaderRef}
          title="SgFlipDigit"
          subtitle={t(i18n, `${K}.headerSubtitle`)}
          exampleLinks={exampleLinks}
          onAnchorClick={handleAnchorClick}
        />

        <Section
          title={t(i18n, `${K}.section1Title`)}
          description={t(i18n, `${K}.section1Description`)}
        >
          <div className="flex items-center gap-4">
            <SgFlipDigit value={digit} />
            <div className="flex flex-col gap-2">
              <SgButton onClick={nextDigit} size="sm">Next (+1)</SgButton>
              <SgButton onClick={prevDigit} size="sm" severity="secondary">Previous (-1)</SgButton>
              <SgButton onClick={randomDigit} size="sm" severity="info">Random</SgButton>
            </div>
          </div>
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-flip-digit/samples/basico.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.section2Title`)}
          description={t(i18n, `${K}.section2Description`)}
        >
          <div className="flex items-center gap-4">
            <SgFlipDigit value={letter} />
            <SgButton onClick={nextLetter} size="sm">Proxima letra</SgButton>
          </div>
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-flip-digit/samples/letras-a-z.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.section3Title`)}
          description={t(i18n, `${K}.section3Description`)}
        >
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="mb-2 text-xs text-muted-foreground">Small</p>
              <SgFlipDigit value={digit} width={50} height={75} fontSize={45} />
            </div>
            <div className="text-center">
              <p className="mb-2 text-xs text-muted-foreground">Medium</p>
              <SgFlipDigit value={digit} />
            </div>
            <div className="text-center">
              <p className="mb-2 text-xs text-muted-foreground">Large</p>
              <SgFlipDigit value={digit} width={120} height={180} fontSize={120} />
            </div>
          </div>
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-flip-digit/samples/variacoes-de-tamanho.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.section4Title`)}
          description={t(i18n, `${K}.section4Description`)}
        >
          <div className="flex items-center gap-2">
            <SgFlipDigit value={digit} />
            <SgFlipDigit value={String((Number(digit) + 1) % 10)} />
            <span className="mx-2 text-4xl font-bold">:</span>
            <SgFlipDigit value={String((Number(digit) + 2) % 10)} />
            <SgFlipDigit value={String((Number(digit) + 3) % 10)} />
          </div>
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-flip-digit/samples/sequencia-estilo-relogio.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.section5Title`)}
          description={t(i18n, `${K}.section5Description`)}
        >
          <div className="flex items-center gap-4">
            <SgFlipDigit value={autoDigit} />
            <SgButton onClick={() => setRunning((prev) => !prev)}>
              {running ? "Parar" : "Iniciar"}
            </SgButton>
          </div>
          <SgCodeBlockBase sampleFile="apps/showcase/src/app/components/digits/sg-flip-digit/samples/auto-increment.tsx.sample" />
        </Section>

        <Section
          title={t(i18n, `${K}.section6Title`)}
          description={t(i18n, `${K}.section6Description`)}
        >
          <SgPlayground
            title="SgFlipDigit Playground"
            interactive
            codeContract="appFile"
            playgroundFile="apps/showcase/src/app/components/digits/sg-flip-digit/sg-flip-digit.tsx.playground"
            height={560}
            defaultOpen
          />
        </Section>

        <ShowcasePropsReference rows={FLIP_DIGIT_PROPS} title={t(i18n, `${K}.propsReferenceTitle`)} />
        {aiComponent ? <ComponentAiPropsTable component={aiComponent} /> : null}
        {aiComponent ? <ComponentAiSummary component={aiComponent} /> : null}
        <div aria-hidden="true" className="pointer-events-none" style={{ height: `calc(${anchorOffset}px + 40vh)` }} />
      </div>
    </I18NReady>
  );
}


